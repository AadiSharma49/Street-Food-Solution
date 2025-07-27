"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { PhoneInput } from "@/components/phone-input"
import { MobileOTPVerification } from "@/components/mobile-otp-verification"

export default function VendorLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [verificationMethod, setVerificationMethod] = useState<"sms" | "whatsapp">("sms")

  const handleOTPSent = (phoneNumber: string, method: "sms" | "whatsapp") => {
    setPhone(phoneNumber)
    setVerificationMethod(method)
    setStep("otp")
  }

  const handleVerificationSuccess = async (method: "sms" | "whatsapp") => {
    try {
      if (method === "sms") {
        // Check if vendor profile exists
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data: vendor } = await supabase.from("vendors").select("*").eq("id", user.id).single()

          if (vendor) {
            router.push("/vendor/dashboard")
          } else {
            router.push("/vendor/register")
          }
        }
      } else {
        // For WhatsApp verification, check if vendor exists by phone
        const { data: vendor } = await supabase.from("vendors").select("*").eq("phone", phone).single()

        if (vendor) {
          router.push("/vendor/dashboard")
        } else {
          router.push("/vendor/register")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete login. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePhoneChange = () => {
    setStep("phone")
    setPhone("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VendorConnect</span>
            </Link>
            <Link href="/vendor/register">
              <Button variant="ghost">New vendor?</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Login</h1>
            <p className="text-gray-600">Access your vendor dashboard</p>
          </div>

          {step === "phone" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                  <span>Mobile Login</span>
                </CardTitle>
                <CardDescription>Enter your registered mobile number</CardDescription>
              </CardHeader>
              <CardContent>
                <PhoneInput onOTPSent={handleOTPSent} />
              </CardContent>
            </Card>
          )}

          {step === "otp" && (
            <MobileOTPVerification
              phone={phone}
              onVerificationSuccess={handleVerificationSuccess}
              onPhoneChange={handlePhoneChange}
              defaultMethod={verificationMethod}
            />
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/vendor/register" className="text-orange-500 hover:underline font-medium">
                Register as vendor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
