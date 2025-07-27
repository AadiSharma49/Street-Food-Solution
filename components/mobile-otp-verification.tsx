"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft, MessageSquare, Smartphone, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface MobileOtpVerificationProps {
  phoneNumber: string
  method: "sms" | "whatsapp"
  onVerificationSuccess: (sessionData: any) => void
  onBack: () => void
  onMethodChange: () => void
}

export function MobileOtpVerification({
  phoneNumber,
  method,
  onVerificationSuccess,
  onBack,
  onMethodChange,
}: MobileOtpVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerifyOtp(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()

    // Auto-verify if complete
    if (pastedData.length === 6) {
      handleVerifyOtp(pastedData)
    }
  }

  const handleVerifyOtp = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      setError("Please enter a complete 6-digit OTP")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, accept any 6-digit OTP
      if (otpCode.length === 6) {
        const sessionData = {
          phoneNumber,
          method,
          verified: true,
          timestamp: new Date().toISOString(),
        }

        toast({
          title: "Verification Successful!",
          description: `Your ${method.toUpperCase()} has been verified successfully.`,
        })

        onVerificationSuccess(sessionData)
      } else {
        throw new Error("Invalid OTP")
      }
    } catch (error) {
      setAttempts(attempts + 1)
      setError("Invalid OTP. Please try again.")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()

      if (attempts >= 2) {
        setError("Too many failed attempts. Please request a new OTP.")
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    setError("")

    try {
      // Simulate resending OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "OTP Resent",
        description: `A new OTP has been sent to your ${method === "whatsapp" ? "WhatsApp" : "phone"}.`,
      })

      setResendTimer(30)
      setCanResend(false)
      setAttempts(0)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            {method === "whatsapp" ? (
              <MessageSquare className="w-8 h-8 text-green-600" />
            ) : (
              <Smartphone className="w-8 h-8 text-blue-600" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Number</CardTitle>
        <CardDescription className="text-center">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-semibold text-gray-900">{formatPhoneNumber(phoneNumber)}</span>
          <br />
          via {method === "whatsapp" ? "WhatsApp" : "SMS"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold border-2 ${
                  error ? "border-red-300" : "border-gray-300"
                } focus:border-orange-500`}
                disabled={isVerifying}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => handleVerifyOtp(otp.join(""))}
          disabled={otp.some((digit) => digit === "") || isVerifying}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify OTP
            </>
          )}
        </Button>

        {/* Resend Section */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={!canResend || isResending}
              className="w-full bg-transparent"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : canResend ? (
                `Resend ${method.toUpperCase()}`
              ) : (
                `Resend in ${resendTimer}s`
              )}
            </Button>

            <Button variant="ghost" onClick={onMethodChange} className="w-full text-sm">
              Try {method === "whatsapp" ? "SMS" : "WhatsApp"} instead
            </Button>
          </div>
        </div>

        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Change Phone Number
        </Button>

        {/* Security Note */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 text-center">
            🔒 Your phone number is encrypted and secure. We'll never share it with anyone.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { MobileOtpVerification as default }
