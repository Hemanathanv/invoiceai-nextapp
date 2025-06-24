"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Where your visitors come from</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Direct</span>
            <span className="text-sm font-bold">45.2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Organic Search</span>
            <span className="text-sm font-bold">32.1%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Social Media</span>
            <span className="text-sm font-bold">12.8%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Referral</span>
            <span className="text-sm font-bold">9.9%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
