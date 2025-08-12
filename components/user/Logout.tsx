// Name: V.Hemanathan
// Describe: This component is used to logout the user. It uses the server action declared in the actions/auth.ts file.
// Framework: Next.js -15.3.2 


"use client"

import { LogOut } from "lucide-react"
import { motion, Transition } from "framer-motion"
import { useState } from "react"
import { signOut } from "@/actions/auth"

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Error logging out:", error)
      setIsLoading(false) // Only reset loading on error since redirect happens on success
    }
  }

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
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer outline-none group w-full text-left"
    >
      <motion.div variants={iconVariants} initial="idle" whileHover="hover" className="relative">
        <LogOut
          size={16}
          className={`transition-colors duration-300 ${
            isLoading ? "text-gray-500" : "text-red-400 group-hover:text-red-300"
          }`}
        />
      </motion.div>

      <motion.span
        className={`text-sm font-medium transition-colors duration-300 ${
          isLoading ? "text-gray-500" : "text-red-400 group-hover:text-white"
        }`}
        animate={{
          x: 0,
        }}
        whileHover={{
          x: 2,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {isLoading ? "Signing out..." : "Sign out"}
      </motion.span>

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          className="absolute right-3"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full" />
        </motion.div>
      )}
    </button>
  )
}

export default Logout


