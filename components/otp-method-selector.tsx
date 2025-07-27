"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, MessageCircle, Shield, Clock, Zap } from "lucide-react"

interface OTPMethodSelectorProps {
  onMethodSelect: (method: "sms" | "whatsapp") => void
  phone: string
}

export function OTPMethodSelector({ onMethodSelect, phone }: OTPMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "whatsapp" | null>(null)

  const methods = [
    {
      id: "sms" as const,
      name: "SMS",
      icon: Smartphone,
      description: "Receive OTP via text message",
      features: ["Instant delivery", "Works on all phones", "Reliable"],
      color: "blue",
      time: "~30 seconds",
    },
    {
      id: "whatsapp" as const,
      name: "WhatsApp",
      icon: MessageCircle,
      description: "Receive OTP via WhatsApp message",
      features: ["Free messaging", "Rich formatting", "Read receipts"],
      color: "green",
      time: "~1 minute",
    },
  ]

  const handleMethodSelect = (method: "sms" | "whatsapp") => {
    setSelectedMethod(method)
    setTimeout(() => {
      onMethodSelect(method)
    }, 300)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Shield className="w-5 h-5 text-orange-500" />
          <span>Choose Verification Method</span>
        </CardTitle>
        <CardDescription>
          How would you like to receive your verification code for <span className="font-medium">{phone}</span>?
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {methods.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id

            return (
              <Button
                key={method.id}
                variant="outline"
                className={`h-auto p-6 justify-start transition-all duration-200 ${
                  isSelected
                    ? `border-${method.color}-500 bg-${method.color}-50 ring-2 ring-${method.color}-200`
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className="flex items-start space-x-4 w-full">
                  <div className={`p-3 rounded-lg ${method.color === "blue" ? "bg-blue-100" : "bg-green-100"}`}>
                    <Icon className={`w-6 h-6 ${method.color === "blue" ? "text-blue-600" : "text-green-600"}`} />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{method.name}</h3>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{method.time}</span>
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">{method.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {method.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Button>
            )
          })}
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>Both methods are secure and encrypted</p>
          <p>You can change your preference anytime in settings</p>
        </div>
      </CardContent>
    </Card>
  )
}
