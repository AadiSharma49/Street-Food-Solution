"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface MobileOTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function MobileOTPInput({ length = 6, value, onChange, disabled = false, className }: MobileOTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    if (value.length < length && inputRefs.current[value.length]) {
      inputRefs.current[value.length]?.focus()
      setActiveIndex(value.length)
    }
  }, [value, length])

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow single digits
    if (digit.length > 1) {
      digit = digit.slice(-1)
    }

    // Only allow numbers
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split("")
    newValue[index] = digit
    const updatedValue = newValue.join("").slice(0, length)

    onChange(updatedValue)

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === "Backspace") {
      e.preventDefault()
      const newValue = value.split("")

      if (newValue[index]) {
        // Clear current input
        newValue[index] = ""
      } else if (index > 0) {
        // Move to previous input and clear it
        newValue[index - 1] = ""
        inputRefs.current[index - 1]?.focus()
        setActiveIndex(index - 1)
      }

      onChange(newValue.join(""))
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setActiveIndex(index - 1)
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length)
    onChange(pastedData)
  }

  const handleFocus = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold",
            "border-2 rounded-lg",
            activeIndex === index && "border-orange-500 ring-2 ring-orange-200",
            value[index] && "border-green-500 bg-green-50",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
