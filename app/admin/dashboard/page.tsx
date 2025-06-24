// Name: V.Hemanathan
// Describe: Dashboard page for the admin dashboard.It use the dashboard components from the _components folder.
// Framework: Next.js -15.3.2 

import { DashboardCampaigns } from "@/app/admin/_components/dashboard/dashboard-campaigns";
import { DashboardCards } from "@/app/admin/_components/dashboard/dashboard-cards";
import { DashboardCharts } from "@/app/admin/_components/dashboard/dashboard-charts";
import { DashboardSales } from "@/app/admin/_components/dashboard/dashboard-sales";
import { DashboardStats } from "@/app/admin/_components/dashboard/dashboard-stats";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardCards />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStats />
        <DashboardCharts className="lg:col-span-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardSales />
        <DashboardCampaigns />
      </div>
    </div>
  )
}
