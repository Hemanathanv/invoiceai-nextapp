"use client"

import type React from "react"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { User, Brain, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, Transition } from "framer-motion"
import { useState } from "react"
import Logout from "@/components/user/Logout"

interface Props {
  name?: string
  email: string
}

const UserAvatarDropdown: React.FC<Props> = ({ name, email }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const initial = name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      onClick: () => router.push("/profile"),
    },
    {
      id: "ai-results",
      label: "AI Results",
      icon: Brain,
      onClick: () => router.push("/extractions"),
    },
  ]

  const hoverTransition: Transition = {
    type: "spring" as "spring",
    stiffness: 400,
    damping: 17,
  };

  const tapTransition: Transition = {
    type: "spring" as "spring",
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

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
          className="relative h-9 w-9 rounded-full bg-gradient-to-r from-blue-200 to-purple-400 text-balck flex items-center justify-center text-sm font-semibold overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 70%, rgba(59, 130, 246, 0.8), transparent 100%)",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
              background: [
                "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 rounded-full border-2"
            animate={{
              borderColor: [
                "rgba(59, 130, 246, 0.5)",
                "rgba(147, 51, 234, 0.8)",
                "rgba(236, 72, 153, 0.5)",
                "rgba(59, 130, 246, 0.5)",
              ],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                animate={{
                  x: [
                    "50%",
                    `${30 + Math.cos((i * Math.PI) / 2) * 20}%`,
                    `${70 + Math.sin((i * Math.PI) / 2) * 20}%`,
                    "50%",
                  ],
                  y: [
                    "50%",
                    `${30 + Math.sin((i * Math.PI) / 2) * 20}%`,
                    `${70 + Math.cos((i * Math.PI) / 2) * 20}%`,
                    "50%",
                  ],
                  scale: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Sparkle indicator when open */}
          {isOpen && (
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
              <Sparkles size={8} className="text-blue-300" />
            </motion.div>
          )}

          <span className="relative z-10">{initial}</span>

          {/* Particle effects on hover */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"
                    initial={{
                      x: "50%",
                      y: "50%",
                      scale: 0,
                    }}
                    animate={{
                      x: ["50%", `${20 + Math.random() * 60}%`],
                      y: ["50%", `${20 + Math.random() * 60}%`],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <AnimatePresence>
          {isOpen && (
            <DropdownMenu.Content
              className="z-50 min-w-[180px] rounded-xl border border-black/10 bg-white/90 backdrop-blur-xl p-2 text-sm shadow-2xl"
              sideOffset={8}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Background glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

                <DropdownMenu.Label className="relative px-3 py-2 font-medium text-blue-800 text-xs uppercase tracking-wider">
                  My Account
                </DropdownMenu.Label>

                {menuItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <DropdownMenu.Item
                      key={item.id}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer outline-none group"
                      onClick={item.onClick}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      asChild
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Hover background */}
                        {hoveredItem === item.id && (
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                            layoutId="menuHover"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}

                        <motion.div
                          variants={iconVariants}
                          initial="idle"
                          animate={hoveredItem === item.id ? "hover" : "idle"}
                          className="relative"
                        >
                          <IconComponent
                            size={16}
                            className={`transition-colors duration-300 ${
                              hoveredItem === item.id ? "text-blue-800" : "text-black"
                            }`}
                          />
                        </motion.div>

                        <motion.span
                          className={`text-sm font-medium transition-colors duration-300 ${
                            hoveredItem === item.id ? "text-blue-800" : "text-black"
                          }`}
                          animate={{
                            x: hoveredItem === item.id ? 2 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {item.label}
                        </motion.span>
                      </motion.div>
                    </DropdownMenu.Item>
                  )
                })}

                <motion.div
                  className="my-2 border-t border-white/10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                />

<DropdownMenu.Item
                  asChild
                  onMouseEnter={() => setHoveredItem("logout")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {hoveredItem === "logout" && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30"
                        layoutId="logoutHover"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Logout />
                  </motion.div>
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          )}
        </AnimatePresence>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default UserAvatarDropdown
