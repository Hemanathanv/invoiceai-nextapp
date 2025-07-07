// Name: V.Hemanathan
// Describe: layout for the Organisation Layout. It will include the sidebar schadcn component.
// Framework: Next.js -15.3.2 


import type React from "react"
import { Toaster } from "sonner"

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="min-h-screen w-full overflow-auto">
            <Toaster />
            {children}
      </div>

  )
}
