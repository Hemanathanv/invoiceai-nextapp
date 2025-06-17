// Name: V.Hemanathan
// Describe: layout for the admin dashboard. It will include the sidebar and top nav.
// Framework: Next.js -15.3.2 


import type React from "react"
import { AppSidebar } from "@/app/admin/_components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TopNav } from "@/app/admin/_components/top-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex overflow-auto flex-col">
        <TopNav />
        <div className="flex-1 overflow-auto p-4 md:p-6">
        
          {children}
        
        </div>
        
      </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
