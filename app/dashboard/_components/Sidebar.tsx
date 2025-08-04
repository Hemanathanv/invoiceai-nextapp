// Name: V.Hemanathan
// Describe: app-sidebar component. Refactored using shadcn/ui components.
// Framework: Next.js -15.3.2

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, UploadCloud,  Settings,  Brain } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function AppMainSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const menuItems = [
    {
      label: "Overview",
      href: "#overview",
      icon: Home,
    },
    {
      label: "Usage",
      href: "#usage",
      icon: Activity,
    },
    {
      label: "Document Processing",
      href: "#process",
      icon: UploadCloud,
    },
    {
      label: "AI Results",
      href: "/extractions",
      icon: Brain ,
    },
    {
      label: "Field Settings",
      href: "#Field settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#overview">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Dashboard</span>
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ label, href, icon: Icon }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton asChild isActive={isActive(href)}>
                <Link href={href}>
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
