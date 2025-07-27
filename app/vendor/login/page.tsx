"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/phone-input"
import { MobileOtpVerification } from "@/components/mobile-otp-verification"
import { OtpMethodSelector } from "@/components/otp-method-selector"
import { useAuth } from "@/hooks/useAuth"
import { useVendor } from "@/hooks/useVendor"
import { supabase } from "@/lib/supabase"
import { otpService } from "@/lib/otp-service"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function VendorLoginPage() {
  const router = useRouter()
  const { user, login } = useAuth()
  const { vendor, loading: vendorLoading } = useVendor()
  const { toast } = useToast()

  const [step, setStep] = useState<"phone" | "method" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otpMethod, setOtpMethod] = useState<"sms" | "whatsapp">("sms")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already logged in as vendor
  useEffect(() => {
    if (user && vendor && !vendorLoading) {
      router.push("/vendor/dashboard")
    }
  }, [user, vendor, vendorLoading, router])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Check if vendor exists with this phone number
      const { data: existingVendor, error: vendorError } = await supabase
        .from("vendors")
        .select("id, phone")
        .eq("phone", phone)
        .single()

      if (vendorError && vendorError.code !== "PGRST116") {
        throw vendorError
      }

      if (!existingVendor) {
        setError("No vendor account found with this phone number. Please register first.")
        return
      }

      setStep("method")
    } catch (error) {
      console.error("Error checking vendor:", error)
      setError("Failed to verify phone number. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMethodSelect = async (method: "sms" | "whatsapp") => {
    setOtpMethod(method)
    setLoading(true)
    setError("")

    try {
      const success = await otpService.sendOTP(phone, method)
      if (success) {
        setStep("otp")
        toast({
          title: "OTP Sent",
          description: `Verification code sent via ${method.toUpperCase()}`,
        })
      } else {
        setError(`Failed to send OTP via ${method.toUpperCase()}. Please try again.`)
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      setError(`Failed to send OTP via ${method.toUpperCase()}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (otp: string) => {
    setLoading(true)
    setError("")

    try {
      const isValid = await otpService.verifyOTP(phone, otp)
      if (!isValid) {
        setError("Invalid OTP. Please try again.")
        return
      }

      // Get vendor data
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("phone", phone)
        .single()

      if (vendorError) {
        throw vendorError
      }

      // Create or get auth user
      const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
        options: {
          shouldCreateUser: false,
        },
      })

      if (authError) {
        // Fallback: create a session manually
        await login(vendorData.id, "vendor")
      }

      toast({
        title: "Login Successful",
        description: "Welcome back to VendorConnect!",
      })

      router.push("/vendor/dashboard")
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setError("Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    try {
      const success = await otpService.sendOTP(phone, otpMethod)
      if (success) {
        toast({
          title: "OTP Resent",
          description: `New verification code sent via ${otpMethod.toUpperCase()}`,
        })
      } else {
        setError(`Failed to resend OTP. Please try again.`)
      }
    } catch (error) {
      setError(`Failed to resend OTP. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  if (vendorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">VC</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Vendor Login</CardTitle>
          <CardDescription>
            {step === "phone" && "Enter your phone number to continue"}
            {step === "method" && "Choose how you'd like to receive your OTP"}
            {step === "otp" && `Enter the OTP sent to +91 ${phone}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput value={phone} onChange={setPhone} placeholder="Enter your phone number" required />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          )}

          {step === "method" && (
            <div className="space-y-4">
              <OtpMethodSelector onSelect={handleMethodSelect} loading={loading} phone={phone} />

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button variant="outline" onClick={() => setStep("phone")} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <MobileOtpVerification
                phone={phone}
                onVerify={handleOtpVerify}
                onResend={handleResendOtp}
                loading={loading}
                method={otpMethod}
              />

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button variant="outline" onClick={() => setStep("method")} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/vendor/register" className="text-orange-500 hover:underline">
              Register here
            </Link>
          </div>

          <div className="text-center text-sm text-gray-600">
            Are you a supplier?{" "}
            <Link href="/supplier/login" className="text-orange-500 hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
