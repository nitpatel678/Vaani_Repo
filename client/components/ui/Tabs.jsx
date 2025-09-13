import React, { useState } from "react"
import clsx from "clsx"

export function Tabs({ defaultValue, children, className }) {
  const [active, setActive] = useState(defaultValue)
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  )
}

export function TabsList({ children, active, setActive, className }) {
  return (
    <div className={clsx("flex border-b border-gray-200", className)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  )
}

export function TabsTrigger({ value, active, setActive, children }) {
  const isActive = active === value
  return (
    <button
      onClick={() => setActive(value)}
      className={clsx(
        "px-4 py-2 text-sm font-medium border-b-2",
        isActive ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, active, children, className }) {
  if (active !== value) return null
  return <div className={clsx("mt-4", className)}>{children}</div>
}
