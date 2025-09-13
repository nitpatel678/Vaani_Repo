// Badge.jsx
import React from "react"
import clsx from "clsx"

export function Badge({ children, variant = "default", className }) {
  const baseStyles =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"

  const variants = {
    default: "bg-indigo-500 text-white", // purple style
    secondary: "bg-gray-200 text-gray-800",
    outline: "border border-gray-300 text-gray-800",
  }

  return (
    <span className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </span>
  )
}
