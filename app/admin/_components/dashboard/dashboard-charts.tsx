"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"

interface DashboardChartsProps {
  className?: string
}
type mockData = {
  month: string
  sales: number
  views: number
}

export function DashboardCharts({ className }: DashboardChartsProps) {
  const [chartData, setChartData] = useState<mockData[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      try {
        // In a real app, you would fetch this data from Supabase or Google Analytics
        // This is a simulation for demonstration purposes

        // Simulate sales and views data
        const mockData = [
          { month: "Jan", sales: 18, views: 25 },
          { month: "Feb", sales: 5, views: 15 },
          { month: "Mar", sales: 42, views: 55 },
          { month: "Apr", sales: 10, views: 20 },
          { month: "May", sales: 30, views: 48 },
          { month: "Jun", sales: 15, views: 30 },
          { month: "Jul", sales: 22, views: 35 },
          { month: "Aug", sales: 18, views: 48 },
          { month: "Sep", sales: 32, views: 40 },
          { month: "Oct", sales: 15, views: 25 },
        ]

        setChartData(mockData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // Fallback to sample data
        setChartData([
          { month: "Jan", sales: 18, views: 25 },
          { month: "Feb", sales: 5, views: 15 },
          { month: "Mar", sales: 42, views: 55 },
          { month: "Apr", sales: 10, views: 20 },
          { month: "May", sales: 30, views: 48 },
          { month: "Jun", sales: 15, views: 30 },
          { month: "Jul", sales: 22, views: 35 },
          { month: "Aug", sales: 18, views: 48 },
          { month: "Sep", sales: 32, views: 40 },
          { month: "Oct", sales: 15, views: 25 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales & Views</CardTitle>
        <CardDescription>Monthly sales and views comparison</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--chart-1))",
              },
              views: {
                label: "Views",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                <Bar dataKey="views" fill="var(--color-views)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
