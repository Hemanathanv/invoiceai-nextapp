"use client"

import { useIsActive } from "@/lib/useActive"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence, Transition } from "framer-motion"
import { Home, CreditCard, LayoutDashboard, Users, Shield, Sparkles, Brain } from "lucide-react"

type Props = {
  isAuthenticated: boolean
  isAdmin: boolean
  subscription: string
}

const NavLinks: React.FC<Props> = ({ isAuthenticated, isAdmin, subscription }) => {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const isActive = (path: string) => pathname === path

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

  

  return (
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
  )
}

export default NavLinks
