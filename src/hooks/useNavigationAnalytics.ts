import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Filtros para excluir admins das estatísticas gerais
const EXCLUDED_USER_IDS = [
  '3acaa3c2-9cc5-4a12-9c26-360012dfbaf9', // GUILHERME PESSOTO CERONI
  'dd38f546-6478-443b-91a3-54b6d48ad0c1', // GUILHERME Ceroni Pessoto
  '3017bb09-f709-409f-b476-de90b4926e50'  // Aline Cuartero
];

interface NavigationMetrics {
  totalViews: number;
  uniqueUsers: number;
  uniqueSessions: number;
  avgDuration: number;
  viewsLast7d: number;
  activeUsersLast7d: number;
}

interface TopPage {
  pagePath: string;
  viewCount: number;
  avgDuration: number;
  uniqueVisitors: number;
}

interface DeviceAnalytics {
  desktop: number;
  mobile: number;
  tablet: number;
  unknown: number;
}

interface TimelineData {
  date: string;
  views: number;
  sessions: number;
}

export function useNavigationMetrics(days: number = 30) {
  return useQuery<NavigationMetrics>({
    queryKey: ['navigation-metrics', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Filtrar visualizações de admins (mantém visitantes não autenticados)
      const views = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );
      const totalViews = views.length;
      const uniqueUsers = new Set(views.filter(v => v.user_id).map(v => v.user_id)).size;
      const uniqueSessions = new Set(views.map(v => v.session_id)).size;
      const avgDuration = views.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) / totalViews || 0;

      const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const viewsLast7d = views.filter(v => new Date(v.viewed_at) >= last7d).length;
      const activeUsersLast7d = new Set(
        views.filter(v => v.user_id && new Date(v.viewed_at) >= last7d).map(v => v.user_id)
      ).size;

      return {
        totalViews,
        uniqueUsers,
        uniqueSessions,
        avgDuration: Math.round(avgDuration),
        viewsLast7d,
        activeUsersLast7d,
      };
    },
  });
}

export function useTopPages(limit: number = 10, days: number = 30) {
  return useQuery<TopPage[]>({
    queryKey: ['top-pages', limit, days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path, duration_seconds, user_id, session_id')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Filtrar visualizações de admins (mantém visitantes não autenticados)
      const filteredData = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const pageStats = filteredData.reduce((acc, view: any) => {
        if (!acc[view.page_path]) {
          acc[view.page_path] = {
            viewCount: 0,
            totalDuration: 0,
            uniqueVisitors: new Set(),
          };
        }
        acc[view.page_path].viewCount++;
        acc[view.page_path].totalDuration += view.duration_seconds || 0;
        if (view.user_id) {
          acc[view.page_path].uniqueVisitors.add(view.user_id);
        }
        return acc;
      }, {} as Record<string, { viewCount: number; totalDuration: number; uniqueVisitors: Set<string> }>);

      return Object.entries(pageStats)
        .map(([pagePath, stats]) => ({
          pagePath,
          viewCount: stats.viewCount,
          avgDuration: Math.round(stats.totalDuration / stats.viewCount),
          uniqueVisitors: stats.uniqueVisitors.size,
        }))
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, limit);
    },
  });
}

export function useDeviceAnalytics(days: number = 30) {
  return useQuery<DeviceAnalytics>({
    queryKey: ['device-analytics', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('device_type, session_id')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Filtrar visualizações de admins (mantém visitantes não autenticados)
      const filteredData = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const devices = filteredData.reduce(
        (acc, view) => {
          const type = view.device_type?.toLowerCase() || 'unknown';
          if (type.includes('mobile')) acc.mobile++;
          else if (type.includes('tablet')) acc.tablet++;
          else if (type.includes('desktop') || type.includes('computer')) acc.desktop++;
          else acc.unknown++;
          return acc;
        },
        { desktop: 0, mobile: 0, tablet: 0, unknown: 0 }
      );

      return devices;
    },
  });
}

export function useNavigationTimeline(days: number = 30) {
  return useQuery<TimelineData[]>({
    queryKey: ['navigation-timeline', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('viewed_at, session_id')
        .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('viewed_at', { ascending: true });

      if (error) throw error;

      // Filtrar visualizações de admins (mantém visitantes não autenticados)
      const filteredData = (data || []).filter((v: any) => 
        !v.user_id || !EXCLUDED_USER_IDS.includes(v.user_id)
      );

      const timeline = filteredData.reduce((acc, view: any) => {
        const date = new Date(view.viewed_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { views: 0, sessions: new Set() };
        }
        acc[date].views++;
        acc[date].sessions.add(view.session_id);
        return acc;
      }, {} as Record<string, { views: number; sessions: Set<string> }>);

      return Object.entries(timeline)
        .map(([date, stats]) => ({
          date,
          views: stats.views,
          sessions: stats.sessions.size,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
  });
}
