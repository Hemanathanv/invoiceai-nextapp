"use client"
import { motion } from "framer-motion"
import Link from "next/link"

const AnimatedLogo = () => {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <motion.div
        className="relative h-10 w-10"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Rotating glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-75"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ padding: "2px" }}
        />

        {/* Pulsing outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Logo container */}
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-white to-gray-100 shadow-lg"
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.5)",
              "0 0 30px rgba(147, 51, 234, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <motion.img
            src="/placeholder.svg?height=40&width=40"
            alt="InvoiceExtract Logo"
            className="h-full w-full object-contain p-1"
            animate={{
              scale: [1, 1.05, 1],
              filter: ["brightness(1) saturate(1)", "brightness(1.1) saturate(1.2)", "brightness(1) saturate(1)"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            animate={{
              x: [0, 20, 0, -20, 0],
              y: [0, -20, 0, 20, 0],
              opacity: [0, 1, 0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </motion.div>

      <div className="flex items-center space-x-2">
        <motion.span
          className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
          whileHover={{ scale: 1.05 }}
        >
          InvoiceAI
        </motion.span>

        <motion.span
          className="relative font-bold text-xs px-2 py-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 10px rgba(251, 146, 60, 0.5)",
              "0 0 20px rgba(236, 72, 153, 0.5)",
              "0 0 10px rgba(251, 146, 60, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
        >
          Beta
          {/* Sparkle effect */}
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.span>
      </div>
    </Link>
  )
}

export default AnimatedLogo
