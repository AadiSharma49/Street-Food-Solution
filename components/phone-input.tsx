"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { otpService } from "@/lib/otp-service"
import { useToast } from "@/hooks/use-toast"
import { Smartphone, Loader2 } from "lucide-react"

interface PhoneInputProps {
  onOTPSent: (phone: string, method: "sms" | "whatsapp") => void
  defaultMethod?: "sms" | "whatsapp"
}

export function PhoneInput({ onOTPSent, defaultMethod = "sms" }: PhoneInputProps) {
  const { toast } = useToast()
  const [phone, setPhone] = useState("")
  const [method, setMethod] = useState<"sms" | "whatsapp">(defaultMethod)
  const [loading, setLoading] = useState(false)

  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
  ]

  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0])

  const handleSendOTP = async () => {
    const fullPhone = selectedCountry.code + phone

    // Validate phone number
    const validation = otpService.validatePhoneNumber(fullPhone)
    if (!validation.valid) {
      toast({
        title: "Invalid Phone Number",
        description: validation.message,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result =
        method === "sms" ? await otpService.sendSMSOTP(fullPhone) : await otpService.sendWhatsAppOTP(fullPhone)

      if (result.success) {
        toast({
          title: "OTP Sent",
          description: result.message,
        })
        onOTPSent(fullPhone, method)
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.message,
          variant: "destructive",
        })
      }
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

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, "")
    setPhone(cleaned)
  }

  const formatPhoneDisplay = (value: string) => {
    // Format Indian mobile numbers as XXX XXX XXXX
    if (selectedCountry.code === "+91" && value.length >= 6) {
      return value.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
    }
    return value
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Mobile Number *</Label>
        <div className="flex gap-2">
          <Select
            value={selectedCountry.code}
            onValueChange={(value) => {
              const country = countryCodes.find((c) => c.code === value)
              if (country) setSelectedCountry(country)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                <div className="flex items-center space-x-2">
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center space-x-2">
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                    <span className="text-sm text-gray-500">{country.country}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            id="phone"
            type="tel"
            placeholder={selectedCountry.code === "+91" ? "98765 43210" : "Phone number"}
            value={formatPhoneDisplay(phone)}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="flex-1"
            maxLength={selectedCountry.code === "+91" ? 13 : 15} // Formatted length
          />
        </div>

        {phone && (
          <p className="text-sm text-gray-600">
            Full number: {selectedCountry.code} {phone}
          </p>
        )}
      </div>

      {/* Method Selection */}
      <div className="space-y-2">
        <Label>Verification Method</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={method === "sms" ? "default" : "outline"}
            onClick={() => setMethod("sms")}
            className="flex-1 flex items-center space-x-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>SMS</span>
          </Button>
          <Button
            type="button"
            variant={method === "whatsapp" ? "default" : "outline"}
            onClick={() => setMethod("whatsapp")}
            className="flex-1 flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span>WhatsApp</span>
          </Button>
        </div>
      </div>

      <Button
        onClick={handleSendOTP}
        disabled={phone.length < 10 || loading}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Send OTP via {method === "sms" ? "SMS" : "WhatsApp"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>We'll send you a 6-digit verification code</p>
        <p>Standard messaging rates may apply</p>
      </div>
    </div>
  )
}
