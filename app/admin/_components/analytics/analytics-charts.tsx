"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Analytics</CardTitle>
        <CardDescription>Real-time website analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Page Views</span>
            <span className="text-2xl font-bold">24,567</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Unique Visitors</span>
            <span className="text-2xl font-bold">18,432</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bounce Rate</span>
            <span className="text-2xl font-bold">32.4%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Avg. Session Duration</span>
            <span className="text-2xl font-bold">4:32</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
