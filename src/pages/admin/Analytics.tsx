import { useState } from "react";
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { AnalyticsOverview } from "@/components/admin/analytics/AnalyticsOverview";
import { TrafficSourcesChart } from "@/components/admin/analytics/TrafficSourcesChart";
import { FunnelChart } from "@/components/admin/analytics/FunnelChart";
import { HourlyHeatmap } from "@/components/admin/analytics/HourlyHeatmap";
import { UserJourneysCard } from "@/components/admin/analytics/UserJourneysCard";
import { BounceRateAnalysis } from "@/components/admin/analytics/BounceRateAnalysis";
import { ProductEngagementCard } from "@/components/admin/analytics/ProductEngagementCard";
import { GeographicInsights } from "@/components/admin/analytics/GeographicInsights";
import { SessionAnalysis } from "@/components/admin/analytics/SessionAnalysis";
import { DeviceResolutionChart } from "@/components/admin/analytics/DeviceResolutionChart";

export default function Analytics() {
  const [period, setPeriod] = useState(30);

  return (
    <div className="space-y-6">
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />
      
      <AnalyticsOverview days={period} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <TrafficSourcesChart days={period} />
        <FunnelChart days={period} />
      </div>
      
      <HourlyHeatmap days={period} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <UserJourneysCard days={period} />
        <BounceRateAnalysis days={period} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductEngagementCard days={period} />
        <SessionAnalysis days={period} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <GeographicInsights days={period} />
        <DeviceResolutionChart days={period} />
      </div>
    </div>
  );
}
