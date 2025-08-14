"use client"

import { useIsActive } from "@/lib/useActive"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence, Transition } from "framer-motion"
import { Home, CreditCard, LayoutDashboard, Users, Shield, Sparkles, Brain, Menu, X } from "lucide-react"



type Props = {
  isAuthenticated: boolean
  isAdmin: boolean
  subscription: string
}

const NavLinks: React.FC<Props> = ({ isAuthenticated, isAdmin, subscription }) => {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const isActive = (path: string) => pathname === path
  const [open, setOpen] = useState(false)

  // Listen for toggle events dispatched from MobileMenuToggle
  useEffect(() => {
    const handler = (e: Event) => {
      // CustomEvent was used, so typecast
      const ce = e as CustomEvent<{ open?: boolean }>
      if (typeof ce.detail?.open === "boolean") {
        setOpen(ce.detail.open)
      } else {
        // toggle if no explicit state provided
        setOpen((v) => !v)
      }
    }
    window.addEventListener("toggle-mobile-nav", handler as EventListener)
    return () => window.removeEventListener("toggle-mobile-nav", handler as EventListener)
  }, [])

  // close on escape & overlay click (optional addition)
  useEffect(() => {
    if (!open) return
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const adminPaths = [
    "/admin/dashboard",
    "/admin/dashboard/profiles",
    "/admin/dashboard/invoices",
    "/admin/dashboard/analytics",
    "/admin/dashboard/logs",
    "/admin/dashboard/settings",
  ]

  const orgPaths = ["/organisation/dashboard"]

  const isAdminActive = useIsActive(adminPaths)
  const isOrgActive = useIsActive(orgPaths)

  const navItems = [
    {
      href: "/",
      label: "Home",
      description: "Plans & Feedback",
      icon: Home,
      show: true,
    },
    {
      href: "/pricing",
      label: "Pricing",
      description: "Subscription Plans",
      icon: CreditCard,
      show: true,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      description: "Upload PDF & Images",
      icon: LayoutDashboard,
      show: isAuthenticated,
    },
    {
      href: "/extractions",
      label: "AI Results",
      description: "View & Modify Data",
      icon: Brain,
      show: isAuthenticated,
    },
    {
      href: "/teams/dashboard",
      label: "Teams",
      description: "Team Plan Options",
      icon: Users,
      show: subscription === "Teams",
    },
    {
      href: "/admin/dashboard",
      label: "Admin",
      description: "Manage Users",
      icon: Shield,
      show: isAdmin,
    },
  ]

  const hoverTransition: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 17,
  };

  const tapTransition: Transition = {
    type: "spring",
    stiffness: 600,
    damping: 20,
  };

  const iconVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      pathLength: 1,
      opacity: 1,
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      pathLength: 1,
      opacity: 1,
      transition: hoverTransition,
    },
    tap: {
      scale: 0.95,
      transition: tapTransition,
    },
  }

  // const drawVariants = {
  //   hidden: { pathLength: 0, opacity: 0 },
  //   visible: {
  //     pathLength: 1,
  //     opacity: 1,
  //     transition: {
  //       pathLength: { type: "spring", duration: 1.5, bounce: 0 },
  //       opacity: { duration: 0.01 },
  //     },
  //   },
  // }

  const getActiveState = (href: string) => {
    if (href === "/admin/dashboard") return isAdminActive
    if (href === "/teams/dashboard") return isOrgActive
    return isActive(href)
  }


  
  const itemEntrance = (index: number) => ({
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0, transition: { delay: index * 0.06, duration: 0.36, ease: "easeOut" } },
    exit: { opacity: 0, x: 12, transition: { duration: 0.2 } },
  })
  
  // in component body:
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPrefersReducedMotion(mq.matches)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  

  return (
    <>
    <nav className="hidden md:flex items-center space-x-2">
      {navItems
        .filter((item) => item.show)
        .map((item, index) => {
          const IconComponent = item.icon
          const isItemActive = getActiveState(item.href)

          return (
            <motion.div
              key={item.href}
              className="relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link href={item.href} className="relative block px-4 py-2 rounded-xl transition-all duration-300 group">
                {/* Background glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId={`bg-${item.href}`}
                />

                {/* Active state background */}
                {isItemActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center space-x-2">
                  <motion.div
                    variants={iconVariants}
                    initial="idle"
                    animate={hoveredItem === item.href ? "hover" : "idle"}
                    whileTap="tap"
                    className="relative"
                  >
                    <IconComponent
                      size={18}
                      className={`transition-colors duration-300 ${
                        isItemActive ? "text-blue-400" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />

                    {isItemActive && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <Sparkles size={8} className="text-blue-400" />
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isItemActive ? "text-blue-400" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                    animate={{
                      x: hoveredItem === item.href ? 2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {item.label}
                  </motion.span>
                </div>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredItem === item.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg border border-white/10 whitespace-nowrap z-50"
                    >
                      <div className="flex items-center space-x-2">
                        <motion.span
                          className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        />
                        <span>{item.description}</span>
                      </div>
                      {/* Arrow */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/10 rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hoveredItem === item.href && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        initial={{
                          x: "50%",
                          y: "50%",
                          scale: 0,
                        }}
                        animate={{
                          x: ["50%", `${20 + Math.random() * 60}%`, `${10 + Math.random() * 80}%`],
                          y: ["50%", `${20 + Math.random() * 60}%`, `${10 + Math.random() * 80}%`],
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </Link>
            </motion.div>
          )
        })}

      {/* Ambient glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </nav>

     {/* mobile slide-over controlled by `open` */}
     <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-background p-4 shadow-lg"
              role="dialog"
              aria-modal="true"
            >
              {/* close button inside the panel */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold">Menu</div>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md focus:outline-none focus:ring"
                >
                  <X size={18} />
                </button>
              </div>

              {/* mobile items */}
              <nav>
  <ul className="space-y-2 bg-white overflow-auto">
  {navItems.filter(i => i.show).map((item, index) => {
  const isActive = pathname === item.href
  const Icon = item.icon

  return (
    <motion.li
      key={item.href}
      className="relative"
      variants={iconVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
    >
      <Link
        href={item.href}
        onClick={() => setOpen(false)}
        className={`block px-3 py-2 rounded-md ${pathname === item.href ? "font-semibold" : "text-base"}`}
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="relative"
            variants={{
              idle: iconVariants.idle,
              hover: { ...iconVariants.hover, transition: hoverTransition },
              tap: { ...iconVariants.tap, transition: tapTransition },
            }}
            initial="idle"
            animate={isActive ? "hover" : "idle"}
            whileTap="tap"
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <Icon size={18} className={isActive ? "text-blue-500" : "text-muted-foreground"} />
          </motion.span>

          <div className="flex-1 min-w-0">
            <div className={`leading-tight ${isActive ? "font-semibold text-slate-900" : "text-base text-slate-700"}`}>
              {item.label}
            </div>
            <div className="text-xs text-muted-foreground truncate">{item.description}</div>
          </div>

          {isActive && (
            <motion.span
              className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-400"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              aria-hidden
            />
          )}
        </div>
      </Link>
    </motion.li>
      )
    })}
  </ul>
</nav>

              
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default NavLinks
