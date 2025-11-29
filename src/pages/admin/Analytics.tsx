import { useState } from "react";
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { AnalyticsOverview } from "@/components/admin/analytics/AnalyticsOverview";
import { ActionableInsights } from "@/components/admin/analytics/ActionableInsights";
import { TrafficSourcesChart } from "@/components/admin/analytics/TrafficSourcesChart";
import { FunnelChart } from "@/components/admin/analytics/FunnelChart";
import { ProductEngagementCard } from "@/components/admin/analytics/ProductEngagementCard";
import { BehaviorAnalysisCard } from "@/components/admin/analytics/BehaviorAnalysisCard";
import { AudienceInsightsCard } from "@/components/admin/analytics/AudienceInsightsCard";
import { ActiveUsersCard } from "@/components/admin/analytics/ActiveUsersCard";

export default function Analytics() {
  const [period, setPeriod] = useState(30);

  return (
    <div className="space-y-6">
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />
      
      <AnalyticsOverview days={period} />
      
      <ActionableInsights days={period} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <TrafficSourcesChart days={period} />
        <FunnelChart days={period} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductEngagementCard days={period} />
        <BehaviorAnalysisCard days={period} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <AudienceInsightsCard days={period} />
        <ActiveUsersCard days={period} />
      </div>
    </div>
  );
}
