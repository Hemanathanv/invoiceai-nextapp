// Name: V.Hemanathan
// Describe: Sidebar component for the dashboard. It will display the navigation links for the dashboard.
// Framework: Next.js -15.3.2 


"use client";

import Link from "next/link";
import React from "react";
import { Home, Activity, UploadCloud, Settings, Table } from "lucide-react";

interface SidebarProps {
  currentSection: "overview" | "usage" | "process" | "extractions" | "Field settings";
}

export default function Sidebar({ currentSection }: SidebarProps) {
  const items: {
    id: SidebarProps["currentSection"];
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "overview", label: "Overview", href: "#overview", icon: Home },
    { id: "usage", label: "Usage", href: "#usage", icon: Activity },
    { id: "process", label: "Document Processing", href: "#process", icon: UploadCloud },
    { id: "extractions", label: "Invoice Extractions", href: "/extractions", icon: Table },
    { id: "Field settings", label: "Field Settings", href: "#Field settings", icon: Settings },
  ];

  return (
    <aside className="w-60 bg-gray-50 border-r border-gray-200 min-h-screen py-6 px-4">
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <Link key={item.id} href={item.href}
              
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                  isActive
                    ? "bg-gray-100 font-semibold text-gray-900"
                    : "text-gray-700"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-gray-900" : "text-gray-500"}`}
                />
                <span>{item.label}</span>

            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
