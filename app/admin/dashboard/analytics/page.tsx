import { AnalyticsOverview } from "@/app/admin/_components/analytics/analytics-overview"
import { AnalyticsCharts } from "@/app/admin/_components/analytics/analytics-charts"
import { AnalyticsStats } from "@/app/admin/_components/analytics/analytics-stats"

export default async function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>
      <AnalyticsOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsStats />
        <AnalyticsCharts />
      </div>
    </div>
  )
}
