// Select.js
import React, { useState, useRef, useEffect } from "react"

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleDocClick(e) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleDocClick)
    return () => document.removeEventListener("mousedown", handleDocClick)
  }, [])

  return (
    <div className="relative" ref={rootRef}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        // Pass props to top-level children (SelectTrigger, SelectContent)
        return React.cloneElement(child, { value, onValueChange, open, setOpen })
      })}
    </div>
  )
}

export function SelectTrigger({ children, setOpen, open, value, onValueChange }) {
  // Clone nested children so SelectValue (or any inner elements) get value/onValueChange/open
  const triggerChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, { value, onValueChange, open, setOpen })
  })

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {triggerChildren}
      <span className="ml-2 text-gray-500">▼</span>
    </button>
  )
}

export function SelectValue({ value, placeholder = "Select an option" }) {
  return <span>{value || placeholder}</span>
}

export function SelectContent({ open, children, onValueChange, setOpen }) {
  if (!open) return null

  // Clone items so they receive onValueChange and setOpen
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, { onValueChange, setOpen })
  })

  return (
    <div className="absolute mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg z-10">
      <ul className="max-h-60 overflow-auto">{items}</ul>
    </div>
  )
}

export function SelectItem({ value: itemValue, children, onValueChange, setOpen }) {
  // Defensive: if handler missing, still close dropdown
  const handleClick = () => {
    onValueChange?.(itemValue)
    setOpen?.(false)
  }

  return (
    <li
      onClick={handleClick}
      className="cursor-pointer px-3 py-2 text-sm hover:bg-indigo-50"
      role="option"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {children}
    </li>
  )
}
