// Name: V.Hemanathan
// Describe: layout for the admin dashboard. It will include the sidebar schadcn component.
// Framework: Next.js -15.3.2 


import { SidebarProvider } from "@/components/ui/sidebar"
import type React from "react"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className=" flex w-full overflow-auto">
            <Toaster />

          <SidebarProvider className="h-full" >
            {children}
            </SidebarProvider>
      </div>

  )
}
