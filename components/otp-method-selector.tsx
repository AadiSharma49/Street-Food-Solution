"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Smartphone, Clock, Shield, CheckCircle } from "lucide-react"

interface OtpMethodSelectorProps {
  phoneNumber: string
  onMethodSelect: (method: "sms" | "whatsapp") => void
  onBack: () => void
}

export function OtpMethodSelector({ phoneNumber, onMethodSelect, onBack }: OtpMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "whatsapp" | null>(null)

  const methods = [
    {
      id: "whatsapp" as const,
      name: "WhatsApp",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Get OTP via WhatsApp message",
      features: ["Instant delivery", "Works with WiFi", "More reliable"],
      deliveryTime: "Usually instant",
      recommended: true,
    },
    {
      id: "sms" as const,
      name: "SMS",
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Get OTP via text message",
      features: ["Works everywhere", "No internet needed", "Traditional method"],
      deliveryTime: "Within 30 seconds",
      recommended: false,
    },
  ]

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3")
  }

  const handleMethodSelect = (method: "sms" | "whatsapp") => {
    setSelectedMethod(method)
    // Small delay for visual feedback
    setTimeout(() => {
      onMethodSelect(method)
    }, 300)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Choose Verification Method</CardTitle>
        <CardDescription>
          We'll send a verification code to
          <br />
          <span className="font-semibold text-gray-900">{formatPhoneNumber(phoneNumber)}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id ? "scale-105" : "hover:scale-102"
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <Card
              className={`border-2 transition-all duration-200 ${
                selectedMethod === method.id
                  ? `${method.borderColor} shadow-lg`
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${method.bgColor} rounded-full flex items-center justify-center`}>
                    <method.icon className={`w-6 h-6 ${method.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{method.name}</h3>
                      {method.recommended && <Badge className="bg-orange-500 text-white text-xs">Recommended</Badge>}
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{method.description}</p>

                    {/* Features */}
                    <div className="space-y-2">
                      {method.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Time */}
                    <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{method.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedMethod === method.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Security Note */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Secure & Private</span>
          </div>
          <p className="text-xs text-gray-600">
            Your phone number is encrypted and will only be used for verification. We never share your personal
            information.
          </p>
        </div>

        {/* Back Button */}
        <Button variant="outline" onClick={onBack} className="w-full mt-4 bg-transparent">
          Change Phone Number
        </Button>
      </CardContent>
    </Card>
  )
}

// Named export for compatibility
export { OtpMethodSelector as default }
