// Name: V.Hemanathan
// Describe: main admin dashboard page. It will include the sidebar and top nav.
// Framework: Next.js -15.3.2 

// import { DashboardCards } from "@/components/dashboard/dashboard-cards"
// import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
// import { DashboardStats } from "@/components/dashboard/dashboard-stats"
// import { DashboardCampaigns } from "@/components/dashboard/dashboard-campaigns"
// import { DashboardSales } from "@/components/dashboard/dashboard-sales"

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* <DashboardCards />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStats />
        <DashboardCharts className="lg:col-span-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardSales />
        <DashboardCampaigns />
      </div> */}
    </div>
  )
}
