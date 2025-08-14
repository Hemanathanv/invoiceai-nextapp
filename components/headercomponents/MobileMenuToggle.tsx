// app/components/headercomponents/MobileMenuToggle.tsx
"use client"

import React from "react"
import { Menu, X } from "lucide-react"

export default function MobileMenuToggle() {
  const [open, setOpen] = React.useState(false)

  const toggle = () => {
    const newState = !open
    setOpen(newState)
    // dispatch a CustomEvent that NavLinks listens to
    window.dispatchEvent(new CustomEvent("toggle-mobile-nav", { detail: { open: newState } }))
  }

  return (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={toggle}
      className="md:hidden p-2 rounded-md focus:outline-none focus:ring"
      // keep visual placement small so you can place it next to avatar
    >
      <Menu size={18} />
    </button>
  )
}
