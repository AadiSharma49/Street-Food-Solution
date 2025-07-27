"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileOTPInput } from "./mobile-otp-input"
import { otpService } from "@/lib/otp-service"
import { useToast } from "@/hooks/use-toast"
import { Smartphone, MessageCircle, RefreshCw, Clock, Loader2 } from "lucide-react"

interface MobileOTPVerificationProps {
  phone: string
  onVerificationSuccess: (method: "sms" | "whatsapp") => void
  onPhoneChange: () => void
  defaultMethod?: "sms" | "whatsapp"
}

export function MobileOTPVerification({
  phone,
  onVerificationSuccess,
  onPhoneChange,
  defaultMethod = "sms",
}: MobileOTPVerificationProps) {
  const { toast } = useToast()
  const [otp, setOtp] = useState("")
  const [method, setMethod] = useState<"sms" | "whatsapp">(defaultMethod)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await otpService.verifyOTP(phone, otp, method)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onVerificationSuccess(method)
      } else {
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        })
        // Clear OTP on failure
        setOtp("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)

    try {
      const result = await otpService.resendOTP(phone, method)

      if (result.success) {
        toast({
          title: "OTP Resent",
          description: result.message,
        })
        setTimeLeft(60)
        setCanResend(false)
        setOtp("")
      } else {
        toast({
          title: "Failed to Resend",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setResendLoading(false)
    }
  }

  const handleMethodChange = async (newMethod: "sms" | "whatsapp") => {
    if (newMethod === method) return

    setMethod(newMethod)
    setOtp("")
    setLoading(true)

    try {
      const result = newMethod === "sms" ? await otpService.sendSMSOTP(phone) : await otpService.sendWhatsAppOTP(phone)

      if (result.success) {
        toast({
          title: "OTP Sent",
          description: `OTP sent via ${newMethod === "sms" ? "SMS" : "WhatsApp"}`,
        })
        setTimeLeft(60)
        setCanResend(false)
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.message,
          variant: "destructive",
        })
        // Revert method on failure
        setMethod(method)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
      setMethod(method)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          {method === "sms" ? (
            <Smartphone className="w-5 h-5 text-blue-500" />
          ) : (
            <MessageCircle className="w-5 h-5 text-green-500" />
          )}
          <span>Verify Mobile Number</span>
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to <span className="font-medium">{phone}</span>
          {method === "sms" ? " via SMS" : " via WhatsApp"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={method === "sms" ? "default" : "outline"}
            size="sm"
            onClick={() => handleMethodChange("sms")}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>SMS</span>
          </Button>
          <Button
            variant={method === "whatsapp" ? "default" : "outline"}
            size="sm"
            onClick={() => handleMethodChange("whatsapp")}
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </Button>
        </div>

        {/* Method Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="flex items-center space-x-1">
            {method === "sms" ? <Smartphone className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
            <span>Sent via {method === "sms" ? "SMS" : "WhatsApp"}</span>
          </Badge>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <MobileOTPInput value={otp} onChange={setOtp} disabled={loading} />
        </div>

        {/* Timer */}
        {!canResend && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Resend OTP in {formatTime(timeLeft)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || loading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Verify OTP
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={!canResend || resendLoading}
              className="flex-1 bg-transparent"
            >
              {resendLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              Resend OTP
            </Button>

            <Button variant="ghost" onClick={onPhoneChange} className="flex-1">
              Change Number
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>Didn't receive the code?</p>
          <p>Check your {method === "sms" ? "messages" : "WhatsApp"} or try the other method</p>
        </div>
      </CardContent>
    </Card>
  )
}
