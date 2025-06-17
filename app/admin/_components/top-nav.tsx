// Name: V.Hemanathan
// Describe: top-nav component. It will include the top navigation for the admin dashboard
// Framework: Next.js -15.3.2 


"use client"

import { Bell, Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function TopNav() {
  return (
    <div className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="relative flex-1 md:grow-0 md:basis-1/3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="w-full bg-background pl-8 md:w-[300px]" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">5</Badge>
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
          <span className="sr-only">Cart</span>
        </Button>
      </div>
    </div>
  )
}
