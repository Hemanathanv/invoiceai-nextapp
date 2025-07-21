"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { toast } from "sonner"
type mockGrowth = {
  month: string
  users: number
}
export function DashboardStats() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [userGrowth, setUserGrowth] = useState<mockGrowth[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserStats() {
      try {
        // In a real app, you would fetch this data from Supabase
        // This is a simulation for demonstration purposes

        // Simulate user growth data
        const mockGrowth = [
          { month: "Jan", users: 25 },
          { month: "Feb", users: 45 },
          { month: "Mar", users: 68 },
          { month: "Apr", users: 92 },
          { month: "May", users: 108 },
          { month: "Jun", users: 95 },
          { month: "Jul", users: 78 },
          { month: "Aug", users: 65 },
          { month: "Sep", users: 55 },
          { month: "Oct", users: 42 },
          { month: "Nov", users: 58 },
          { month: "Dec", users: 65 },
        ]

        setTotalUsers(97400)
        setActiveUsers(42500)
        setUserGrowth(mockGrowth)
      } catch (error) {
        if ( error instanceof Error){
          toast.error("Error fetching campaign data:" + error.message)
        }
        // console.error("Error fetching user stats:", error)
        // Fallback to sample data
        setTotalUsers(97400)
        setActiveUsers(42500)
        setUserGrowth([
          { month: "Jan", users: 25 },
          { month: "Feb", users: 45 },
          { month: "Mar", users: 68 },
          { month: "Apr", users: 92 },
          { month: "May", users: 108 },
          { month: "Jun", users: 95 },
          { month: "Jul", users: 78 },
          { month: "Aug", users: 65 },
          { month: "Sep", users: 55 },
          { month: "Oct", users: 42 },
          { month: "Nov", users: 58 },
          { month: "Dec", users: 65 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  const activePercentage = Math.round((activeUsers / totalUsers) * 100)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "Loading..." : `${(totalUsers / 1000).toFixed(1)}K`}</div>
          <div className="h-[80px] mt-4">
            {!loading && (
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowth}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="users" fill="var(--color-users)" radius={2} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
          <p className="text-xs text-muted-foreground">+12.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "Loading..." : `${(activeUsers / 1000).toFixed(1)}K`}</div>
          <div className="mt-4 h-[80px]">
            <div className="flex h-2 w-full items-center rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${activePercentage}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium text-foreground">{activePercentage}%</span>
              <span>100%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">24K users increased from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}
