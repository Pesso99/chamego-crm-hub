import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Filtros para excluir admins
const EXCLUDED_USER_IDS = [
  '3acaa3c2-9cc5-4a12-9c26-360012dfbaf9',
  'dd38f546-6478-443b-91a3-54b6d48ad0c1',
  '3017bb09-f709-409f-b476-de90b4926e50'
];

export interface TrafficSource {
  source: string;
  count: number;
  percentage: number;
}

export interface FunnelStep {
  name: string;
  path: string;
  count: number;
  percentage: number;
}

export interface HourlyData {
  day: number;
  hour: number;
  count: number;
}

export interface UserJourney {
  path: string;
  count: number;
  avgDuration: number;
}

export interface BounceRate {
  page: string;
  views: number;
  bounces: number;
  rate: number;
}

export interface ProductEngagement {
  productName: string;
  views: number;
  avgDuration: number;
}

export interface GeographicData {
  timezone: string;
  count: number;
}

export interface SessionMetrics {
  authenticated: number;
  anonymous: number;
  avgPagesPerSession: number;
}

export interface DeviceResolution {
  resolution: string;
  count: number;
}

export function useTrafficSources(days: number = 30) {
  return useQuery<TrafficSource[]>({
    queryKey: ['traffic-sources', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('referrer')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const sources = filtered.reduce((acc: Record<string, number>, view: any) => {
        let source = 'Direto';
        if (view.referrer) {
          if (view.referrer.includes('instagram')) source = 'Instagram';
          else if (view.referrer.includes('google')) source = 'Google';
          else if (view.referrer.includes('facebook')) source = 'Facebook';
          else source = 'Outros';
        }
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(sources).reduce((sum, count) => sum + count, 0);

      return Object.entries(sources)
        .map(([source, count]) => ({
          source,
          count,
          percentage: Math.round((count / total) * 100)
        }))
        .sort((a, b) => b.count - a.count);
    },
  });
}

export function useConversionFunnel(days: number = 30) {
  return useQuery<FunnelStep[]>({
    queryKey: ['conversion-funnel', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path, session_id')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const steps = [
        { name: 'Home', path: '/', count: 0 },
        { name: 'Produtos', path: '/produtos', count: 0 },
        { name: 'Detalhe', path: '/produtos/', count: 0 },
        { name: 'Carrinho', path: '/carrinho', count: 0 },
        { name: 'Checkout', path: '/checkout', count: 0 },
      ];

      const sessions = new Map<string, Set<string>>();

      filtered.forEach((view: any) => {
        if (!sessions.has(view.session_id)) {
          sessions.set(view.session_id, new Set());
        }
        sessions.get(view.session_id)!.add(view.page_path);
      });

      sessions.forEach((paths) => {
        if (paths.has('/')) steps[0].count++;
        if (paths.has('/produtos')) steps[1].count++;
        if (Array.from(paths).some(p => p.startsWith('/produtos/') && p !== '/produtos')) steps[2].count++;
        if (paths.has('/carrinho')) steps[3].count++;
        if (paths.has('/checkout')) steps[4].count++;
      });

      const total = steps[0].count || 1;
      return steps.map((step, idx) => ({
        ...step,
        percentage: idx === 0 ? 100 : Math.round((step.count / steps[0].count) * 100)
      }));
    },
  });
}

export function useHourlyDistribution(days: number = 30) {
  return useQuery<HourlyData[]>({
    queryKey: ['hourly-distribution', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('viewed_at')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const heatmap: Record<string, number> = {};
      
      filtered.forEach((view: any) => {
        const date = new Date(view.viewed_at);
        const day = date.getDay();
        const hour = date.getHours();
        const key = `${day}-${hour}`;
        heatmap[key] = (heatmap[key] || 0) + 1;
      });

      return Object.entries(heatmap).map(([key, count]) => {
        const [day, hour] = key.split('-').map(Number);
        return { day, hour, count };
      });
    },
  });
}

export function useUserJourneys(days: number = 30) {
  return useQuery<UserJourney[]>({
    queryKey: ['user-journeys', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path, session_id, duration_seconds, viewed_at')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('viewed_at', { ascending: true });

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const sessions = new Map<string, Array<{ path: string; duration: number }>>();

      filtered.forEach((view: any) => {
        if (!sessions.has(view.session_id)) {
          sessions.set(view.session_id, []);
        }
        sessions.get(view.session_id)!.push({
          path: view.page_path,
          duration: view.duration_seconds || 0
        });
      });

      const journeys: Record<string, { count: number; totalDuration: number }> = {};

      sessions.forEach((paths) => {
        if (paths.length >= 2) {
          const journey = paths.slice(0, 3).map(p => p.path).join(' → ');
          const duration = paths.reduce((sum, p) => sum + p.duration, 0);
          
          if (!journeys[journey]) {
            journeys[journey] = { count: 0, totalDuration: 0 };
          }
          journeys[journey].count++;
          journeys[journey].totalDuration += duration;
        }
      });

      return Object.entries(journeys)
        .map(([path, data]) => ({
          path,
          count: data.count,
          avgDuration: Math.round(data.totalDuration / data.count)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
  });
}

export function useBounceRates(days: number = 30) {
  return useQuery<BounceRate[]>({
    queryKey: ['bounce-rates', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path, session_id')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const pageViews: Record<string, number> = {};
      const sessionPages: Record<string, Set<string>> = {};

      filtered.forEach((view: any) => {
        pageViews[view.page_path] = (pageViews[view.page_path] || 0) + 1;
        
        if (!sessionPages[view.session_id]) {
          sessionPages[view.session_id] = new Set();
        }
        sessionPages[view.session_id].add(view.page_path);
      });

      const bounces: Record<string, number> = {};
      Object.values(sessionPages).forEach((pages) => {
        if (pages.size === 1) {
          const page = Array.from(pages)[0];
          bounces[page] = (bounces[page] || 0) + 1;
        }
      });

      return Object.entries(pageViews)
        .map(([page, views]) => ({
          page,
          views,
          bounces: bounces[page] || 0,
          rate: Math.round(((bounces[page] || 0) / views) * 100)
        }))
        .filter(b => b.views >= 5)
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 10);
    },
  });
}

export function useProductEngagement(days: number = 30) {
  return useQuery<ProductEngagement[]>({
    queryKey: ['product-engagement', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path, page_title, duration_seconds')
        .like('page_path', '/produtos/%')
        .neq('page_path', '/produtos')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const products: Record<string, { count: number; totalDuration: number }> = {};

      filtered.forEach((view: any) => {
        const name = view.page_title || view.page_path.split('/').pop() || 'Unknown';
        if (!products[name]) {
          products[name] = { count: 0, totalDuration: 0 };
        }
        products[name].count++;
        products[name].totalDuration += view.duration_seconds || 0;
      });

      return Object.entries(products)
        .map(([productName, data]) => ({
          productName,
          views: data.count,
          avgDuration: Math.round(data.totalDuration / data.count)
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
    },
  });
}

export function useGeographicData(days: number = 30) {
  return useQuery<GeographicData[]>({
    queryKey: ['geographic-data', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('metadata')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const timezones: Record<string, number> = {};

      filtered.forEach((view: any) => {
        const timezone = view.metadata?.timezone || 'Unknown';
        timezones[timezone] = (timezones[timezone] || 0) + 1;
      });

      return Object.entries(timezones)
        .map(([timezone, count]) => ({ timezone, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
  });
}

export function useSessionMetrics(days: number = 30) {
  return useQuery<SessionMetrics>({
    queryKey: ['session-metrics', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('session_id, is_authenticated, page_path')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const sessions = new Map<string, { auth: boolean; pages: number }>();

      filtered.forEach((view: any) => {
        if (!sessions.has(view.session_id)) {
          sessions.set(view.session_id, { auth: view.is_authenticated, pages: 0 });
        }
        sessions.get(view.session_id)!.pages++;
      });

      let authenticated = 0;
      let anonymous = 0;
      let totalPages = 0;

      sessions.forEach((session) => {
        if (session.auth) authenticated++;
        else anonymous++;
        totalPages += session.pages;
      });

      return {
        authenticated,
        anonymous,
        avgPagesPerSession: Math.round(totalPages / sessions.size)
      };
    },
  });
}

export function useDeviceResolutions(days: number = 30) {
  return useQuery<DeviceResolution[]>({
    queryKey: ['device-resolutions', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('screen_width, screen_height')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const resolutions: Record<string, number> = {};

      filtered.forEach((view: any) => {
        if (view.screen_width && view.screen_height) {
          const resolution = `${view.screen_width}x${view.screen_height}`;
          resolutions[resolution] = (resolutions[resolution] || 0) + 1;
        }
      });

      return Object.entries(resolutions)
        .map(([resolution, count]) => ({ resolution, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
  });
}

export interface PeakHours {
  hour: number;
  day: string;
  count: number;
}

export interface ActiveUser {
  userId: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  totalViews: number;
  sessions: number;
  lastActivity: string;
  avgDuration: number;
}

export interface DeviceCategory {
  category: string;
  count: number;
  percentage: number;
}

export function useActiveUsers(days: number = 30) {
  return useQuery<ActiveUser[]>({
    queryKey: ['active-users', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('user_id, viewed_at, session_id, duration_seconds')
        .not('user_id', 'is', null)
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      // Group by user_id
      const userStats = new Map<string, {
        views: number;
        sessions: Set<string>;
        lastActivity: string;
        totalDuration: number;
      }>();

      filtered.forEach((view: any) => {
        const userId = view.user_id;
        if (!userStats.has(userId)) {
          userStats.set(userId, {
            views: 0,
            sessions: new Set(),
            lastActivity: view.viewed_at,
            totalDuration: 0,
          });
        }
        const stats = userStats.get(userId)!;
        stats.views++;
        stats.sessions.add(view.session_id);
        stats.totalDuration += view.duration_seconds || 0;
        if (new Date(view.viewed_at) > new Date(stats.lastActivity)) {
          stats.lastActivity = view.viewed_at;
        }
      });

      // Fetch profile data for all users
      const userIds = Array.from(userStats.keys());
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, avatar_url')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      const profileMap = new Map(
        (profiles || []).map((p: any) => [p.user_id, p])
      );

      return Array.from(userStats.entries())
        .map(([userId, stats]) => {
          const profile = profileMap.get(userId);
          return {
            userId,
            name: profile?.full_name || null,
            email: profile?.email || 'unknown@email.com',
            avatarUrl: profile?.avatar_url || null,
            totalViews: stats.views,
            sessions: stats.sessions.size,
            lastActivity: stats.lastActivity,
            avgDuration: Math.round(stats.totalDuration / stats.views),
          };
        })
        .sort((a, b) => b.totalViews - a.totalViews);
    },
  });
}

export function useDeviceCategories(days: number = 30) {
  return useQuery<DeviceCategory[]>({
    queryKey: ['device-categories', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('screen_width')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const categories = { mobile: 0, tablet: 0, desktop: 0 };

      filtered.forEach((view: any) => {
        const width = view.screen_width;
        if (!width) return;
        
        if (width < 768) categories.mobile++;
        else if (width < 1024) categories.tablet++;
        else categories.desktop++;
      });

      const total = categories.mobile + categories.tablet + categories.desktop;

      return [
        { category: 'Mobile', count: categories.mobile, percentage: Math.round((categories.mobile / total) * 100) },
        { category: 'Tablet', count: categories.tablet, percentage: Math.round((categories.tablet / total) * 100) },
        { category: 'Desktop', count: categories.desktop, percentage: Math.round((categories.desktop / total) * 100) },
      ].filter(c => c.count > 0);
    },
  });
}

export function usePeakHours(days: number = 30) {
  return useQuery<PeakHours>({
    queryKey: ['peak-hours', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('viewed_at')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const filtered = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const hourCounts: Record<number, number> = {};
      const dayCounts: Record<number, number> = {};

      filtered.forEach((view: any) => {
        const date = new Date(view.viewed_at);
        const hour = date.getHours();
        const day = date.getDay();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      });

      const peakHour = Object.entries(hourCounts).sort(([,a], [,b]) => b - a)[0];
      const peakDay = Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0];

      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

      return {
        hour: parseInt(peakHour[0]),
        day: dayNames[parseInt(peakDay[0])],
        count: peakHour[1]
      };
    },
  });
}

export interface AuthenticationUserDetail {
  userId: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  pageViews: number;
}

export interface AuthenticationData {
  date: string;
  uniqueUsers: number;
  sessions: number;
  users: AuthenticationUserDetail[];
}

export interface AuthenticationTimeline {
  daily: AuthenticationData[];
  monthly: AuthenticationData[];
  totals: {
    totalUsers: number;
    totalSessions: number;
    avgDaily: number;
  };
}

export function useAuthenticationTimeline(days: number = 30) {
  return useQuery<AuthenticationTimeline>({
    queryKey: ['authentication-timeline', days],
    staleTime: 0, // Always revalidate to avoid serving stale cached data in analytics
    queryFn: async () => {
      console.log('[AuthTimeline] Fetching authentication timeline for last days =', days);

      const { data, error } = await supabase
        .from('page_views')
        .select('viewed_at, user_id, session_id, is_authenticated')
        .eq('is_authenticated', true)
        .not('user_id', 'is', null)
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('viewed_at', { ascending: true });

      if (error) {
        console.error('[AuthTimeline] Error fetching page_views:', error);
        throw error;
      }

      console.log('[AuthTimeline] Raw auth events count:', data?.length ?? 0);

      const filtered = (data || []).filter((v: any) => 
        !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      console.log('[AuthTimeline] Filtered auth events (after excluded users):', filtered.length);

      // Get unique user IDs
      const userIds = [...new Set(filtered.map((v: any) => v.user_id))];
      console.log('[AuthTimeline] Distinct userIds to load profiles for:', userIds.length);

      // Fetch user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, avatar_url')
        .in('user_id', userIds);

      if (profileError) {
        console.error('[AuthTimeline] Failed to fetch profiles:', profileError);
        throw profileError;
      }

      console.log('[AuthTimeline] Profiles fetched:', profiles?.length ?? 0);

      const profileMap = new Map(
        (profiles || []).map(p => [p.user_id, p])
      );

      // Process daily and monthly data with user details
      const dailyMap = new Map<string, { 
        users: Set<string>; 
        sessions: Set<string>;
        userDetails: Map<string, number>;
      }>();
      const monthlyMap = new Map<string, { 
        users: Set<string>; 
        sessions: Set<string>;
        userDetails: Map<string, number>;
      }>();

      filtered.forEach((view: any) => {
        const date = new Date(view.viewed_at);
        const dayKey = date.toISOString().split('T')[0];
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;

        // Daily aggregation
        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, { 
            users: new Set(), 
            sessions: new Set(),
            userDetails: new Map()
          });
        }
        const dailyData = dailyMap.get(dayKey)!;
        dailyData.users.add(view.user_id);
        dailyData.sessions.add(view.session_id);
        dailyData.userDetails.set(
          view.user_id, 
          (dailyData.userDetails.get(view.user_id) || 0) + 1
        );

        // Monthly aggregation
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { 
            users: new Set(), 
            sessions: new Set(),
            userDetails: new Map()
          });
        }
        const monthlyData = monthlyMap.get(monthKey)!;
        monthlyData.users.add(view.user_id);
        monthlyData.sessions.add(view.session_id);
        monthlyData.userDetails.set(
          view.user_id, 
          (monthlyData.userDetails.get(view.user_id) || 0) + 1
        );
      });

      const buildAuthData = (
        dateMap: Map<string, { users: Set<string>; sessions: Set<string>; userDetails: Map<string, number> }>
      ): AuthenticationData[] => {
        return Array.from(dateMap.entries())
          .map(([date, data]) => {
            const users: AuthenticationUserDetail[] = Array.from(data.userDetails.entries())
              .map(([userId, pageViews]) => {
                const profile = profileMap.get(userId);
                return {
                  userId,
                  name: profile?.full_name || null,
                  email: profile?.email || 'unknown@email.com',
                  avatarUrl: profile?.avatar_url || null,
                  pageViews,
                };
              })
              .sort((a, b) => b.pageViews - a.pageViews);

            return {
              date,
              uniqueUsers: data.users.size,
              sessions: data.sessions.size,
              users,
            };
          })
          .sort((a, b) => a.date.localeCompare(b.date));
      };

      const daily = buildAuthData(dailyMap);
      const monthly = buildAuthData(monthlyMap);

      // Calculate totals
      const allUsers = new Set(filtered.map((v: any) => v.user_id));
      const allSessions = new Set(filtered.map((v: any) => v.session_id));
      const avgDaily = daily.length > 0 
        ? daily.reduce((sum, d) => sum + d.uniqueUsers, 0) / daily.length 
        : 0;

      return {
        daily,
        monthly,
        totals: {
          totalUsers: allUsers.size,
          totalSessions: allSessions.size,
          avgDaily,
        },
      };
    },
  });
}
