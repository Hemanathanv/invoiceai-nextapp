import type React from "react"
import { AppSidebar } from "@/app/admin/_components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { TopNav } from "@/app/admin/_components/top-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex  w-full ">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <TopNav />
        <div className="flex-1 overflow-auto p-2">{children}</div>
      </SidebarInset>
    </div>
  )
}
