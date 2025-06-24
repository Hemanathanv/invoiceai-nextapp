"use client"

import { useEffect, useState } from "react"
import { Bell, CreditCard, ShoppingCart, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


type DashboardMetrics = {
  orders: number
  income: number
  notifications: number
  payment: number
}

export function DashboardCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    orders: 0,
    income: 0,
    notifications: 0,
    payment: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // In a real app, you would fetch this data from Supabase
        // This is a simulation for demonstration purposes
    
        setMetrics({
          orders: 85246,
          income: 96147,
          notifications: 846,
          payment: 84472,
        })
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error)
        // Fallback to sample data
        setMetrics({
          orders: 85246,
          income: 96147,
          notifications: 846,
          payment: 84472,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "Loading..." : metrics.orders.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <Printer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{loading ? "Loading..." : metrics.income.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+1.2% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "Loading..." : metrics.notifications.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+7% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{loading ? "Loading..." : metrics.payment.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+5.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}
