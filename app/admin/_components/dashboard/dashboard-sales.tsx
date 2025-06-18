"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DashboardSales() {
  const [monthlySales, setMonthlySales] = useState(0)
  const [yearlySales, setYearlySales] = useState(0)
  const [monthlyGrowth, setMonthlyGrowth] = useState(0)
  const [yearlyGrowth, setYearlyGrowth] = useState(0)
  const [goalProgress, setGoalProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSalesData() {
      try {
        // In a real app, you would fetch this data from Supabase
        // This is a simulation for demonstration purposes

        // Simulate sales data
        const mockMonthlySales = 65127
        const mockYearlySales = 984246
        const mockMonthlyGrowth = 16.5
        const mockYearlyGrowth = 24.9
        const mockGoalProgress = 78

        setMonthlySales(mockMonthlySales)
        setYearlySales(mockYearlySales)
        setMonthlyGrowth(mockMonthlyGrowth)
        setYearlyGrowth(mockYearlyGrowth)
        setGoalProgress(mockGoalProgress)
      } catch (error) {
        console.error("Error fetching sales data:", error)
        // Fallback to sample data
        setMonthlySales(65127)
        setYearlySales(984246)
        setMonthlyGrowth(16.5)
        setYearlyGrowth(24.9)
        setGoalProgress(78)
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales This Year</CardTitle>
        <CardDescription>₹{loading ? "Loading..." : yearlySales.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Monthly</p>
            <div className="flex items-start justify-between">
              <div className="text-2xl font-bold">{loading ? "Loading..." : monthlySales.toLocaleString()}</div>
              <div className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                +{monthlyGrowth}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">₹55.21 USD</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Yearly</p>
            <div className="flex items-start justify-between">
              <div className="text-2xl font-bold">{loading ? "Loading..." : yearlySales.toLocaleString()}</div>
              <div className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                +{yearlyGrowth}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">₹267.35 USD</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p>285 left to Goal</p>
            <p className="font-medium">{goalProgress}%</p>
          </div>
          <Progress value={goalProgress} />
        </div>
      </CardContent>
    </Card>
  )
}
