"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { toast } from "sonner"
import LoadingScreen from "@/components/LoadingScreen"

type mockWeeklyData = {
  week: string
  sales: number
}

export function AnalyticsOverview() {
  const [weeklyData, setWeeklyData] = useState<mockWeeklyData[]>([])
  const [averageSales, setAverageSales] = useState(0)
  const [growthPercentage, setGrowthPercentage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        // In a real app, you would fetch this data from Google Analytics
        // This is a simulation for demonstration purposes

        const mockWeeklyData = [
          { week: "W1", sales: 8500 },
          { week: "W2", sales: 9200 },
          { week: "W3", sales: 8800 },
          { week: "W4", sales: 10200 },
          { week: "W5", sales: 9800 },
          { week: "W6", sales: 11500 },
          { week: "W7", sales: 9568 },
        ]

        setWeeklyData(mockWeeklyData)
        setAverageSales(9568)
        setGrowthPercentage(-8.6)
      } catch (error) {
        // console.error("Error fetching analytics data:", error)
        if (error instanceof Error){
          toast("Loading mock data" + error.message)
        }
        // Fallback to sample data
        setWeeklyData([
          { week: "W1", sales: 8500 },
          { week: "W2", sales: 9200 },
          { week: "W3", sales: 8800 },
          { week: "W4", sales: 10200 },
          { week: "W5", sales: 9800 },
          { week: "W6", sales: 11500 },
          { week: "W7", sales: 9568 },
        ])
        setAverageSales(9568)
        setGrowthPercentage(-8.6)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">${loading ? "Loading..." : averageSales.toLocaleString()}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          Average Weekly Sales
          <span className={`text-sm ${growthPercentage < 0 ? "text-red-500" : "text-green-500"}`}>
            {growthPercentage > 0 ? "↗" : "↘"} {Math.abs(growthPercentage)}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingScreen />
        ) : (
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="week" hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-sales)"
                  strokeWidth={3}
                  dot={false}
                  fill="url(#salesGradient)"
                />
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
