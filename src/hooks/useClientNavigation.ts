import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PageView {
  page_path: string;
  page_title: string | null;
  viewed_at: string;
  duration_seconds: number | null;
}

interface NavigationInsights {
  recentPages: PageView[];
  totalViews: number;
  avgDuration: number;
  topPages: { path: string; count: number }[];
}

export function useClientNavigation(userId: string | null) {
  return useQuery<NavigationInsights>({
    queryKey: ['client-navigation', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      const { data: pageViews, error } = await supabase
        .from('page_views')
        .select('page_path, page_title, viewed_at, duration_seconds')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const views = (pageViews as any[]) || [];
      
      // Calculate insights
      const totalViews = views.length;
      const avgDuration = views.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) / totalViews || 0;
      
      // Count page visits
      const pageCounts = views.reduce((acc, v) => {
        acc[v.page_path] = (acc[v.page_path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        recentPages: views.slice(0, 10) as PageView[],
        totalViews,
        avgDuration: Math.round(avgDuration),
        topPages,
      };
    },
    enabled: !!userId,
  });
}
