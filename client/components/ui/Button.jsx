// Button.jsx
import React from "react"
import clsx from "clsx"

export function Button({ children, variant = "default", size = "md", className, ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800", // black solid button
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
    ghost: "hover:bg-gray-100 text-gray-800",
  }

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  }

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
