import React from "react"
import clsx from "clsx"

export function Card({ children, className }) {
  return (
    <div className={clsx("rounded-2xl border bg-background shadow-sm", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx("p-6 border-b border-border/40", className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx("text-xl font-semibold text-foreground", className)}>{children}</h3>
  )
}

export function CardDescription({ children, className }) {
  return (
    <p className={clsx("text-sm text-muted-foreground mt-1", className)}>{children}</p>
  )
}

export function CardContent({ children, className }) {
  return (
    <div className={clsx("p-6", className)}>{children}</div>
  )
}
