"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneInput } from "@/components/phone-input"
import { MobileOTPVerification } from "@/components/mobile-otp-verification"
import { useAuth } from "@/hooks/useAuth"
import { useVendor } from "@/hooks/useVendor"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function VendorLoginPage() {
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [loading, setLoading] = useState(false)
  const { user, login } = useAuth()
  const { vendor, loading: vendorLoading } = useVendor()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (user && vendor && !vendorLoading) {
      router.push("/vendor/dashboard")
    }
  }, [user, vendor, vendorLoading, router])

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setLoading(true)
    try {
      // Here you would typically send OTP
      // For now, we'll simulate the process
      setPhone(phoneNumber)
      setStep("otp")
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phoneNumber}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerify = async (otp: string) => {
    setLoading(true)
    try {
      // Simulate OTP verification and login
      await login(phone, "vendor")
      toast({
        title: "Login Successful",
        description: "Welcome back to VendorConnect!",
      })
      router.push("/vendor/dashboard")
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (user && vendorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">VC</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">VendorConnect</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Login</h1>
          <p className="text-gray-600 mt-2">Access your vendor dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{step === "phone" ? "Enter Your Phone Number" : "Verify OTP"}</CardTitle>
            <CardDescription>
              {step === "phone" ? "We'll send you a verification code" : `Enter the 6-digit code sent to ${phone}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <PhoneInput onSubmit={handlePhoneSubmit} loading={loading} buttonText="Send OTP" />
            ) : (
              <MobileOTPVerification
                phoneNumber={phone}
                onVerify={handleOTPVerify}
                onResend={() => handlePhoneSubmit(phone)}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/vendor/register" className="text-orange-600 hover:text-orange-700 font-medium">
              Register as Vendor
            </Link>
          </p>
          <p className="text-gray-600 mt-2">
            Are you a supplier?{" "}
            <Link href="/supplier/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
