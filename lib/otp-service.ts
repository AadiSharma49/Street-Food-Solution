import { supabase } from "./supabase"

export interface OTPResponse {
  success: boolean
  message: string
  data?: any
}

export class OTPService {
  private static instance: OTPService
  private otpStore = new Map<string, { otp: string; expires: number; attempts: number }>()

  static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService()
    }
    return OTPService.instance
  }

  // Generate 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Send OTP via SMS (using Supabase Auth)
  async sendSMSOTP(phone: string): Promise<OTPResponse> {
    try {
      // Clean phone number format
      const cleanPhone = this.formatPhoneNumber(phone)

      const { error } = await supabase.auth.signInWithOtp({
        phone: cleanPhone,
        options: {
          channel: "sms",
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
        }
      }

      return {
        success: true,
        message: "OTP sent successfully to your mobile number",
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to send OTP. Please try again.",
      }
    }
  }

  // Send OTP via WhatsApp (simulated - would integrate with WhatsApp Business API)
  async sendWhatsAppOTP(phone: string): Promise<OTPResponse> {
    try {
      const cleanPhone = this.formatPhoneNumber(phone)
      const otp = this.generateOTP()

      // Store OTP temporarily (5 minutes expiry)
      this.otpStore.set(cleanPhone, {
        otp,
        expires: Date.now() + 5 * 60 * 1000,
        attempts: 0,
      })

      // In production, integrate with WhatsApp Business API
      console.log(`WhatsApp OTP for ${cleanPhone}: ${otp}`)

      return {
        success: true,
        message: "OTP sent successfully via WhatsApp",
        data: { method: "whatsapp" },
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to send WhatsApp OTP. Please try again.",
      }
    }
  }

  // Verify OTP
  async verifyOTP(phone: string, otp: string, method: "sms" | "whatsapp" = "sms"): Promise<OTPResponse> {
    try {
      const cleanPhone = this.formatPhoneNumber(phone)

      if (method === "sms") {
        // Verify using Supabase Auth
        const { error } = await supabase.auth.verifyOtp({
          phone: cleanPhone,
          token: otp,
          type: "sms",
        })

        if (error) {
          return {
            success: false,
            message: error.message,
          }
        }

        return {
          success: true,
          message: "OTP verified successfully",
        }
      } else {
        // Verify WhatsApp OTP from local store
        const storedData = this.otpStore.get(cleanPhone)

        if (!storedData) {
          return {
            success: false,
            message: "OTP not found or expired. Please request a new one.",
          }
        }

        if (Date.now() > storedData.expires) {
          this.otpStore.delete(cleanPhone)
          return {
            success: false,
            message: "OTP has expired. Please request a new one.",
          }
        }

        if (storedData.attempts >= 3) {
          this.otpStore.delete(cleanPhone)
          return {
            success: false,
            message: "Too many failed attempts. Please request a new OTP.",
          }
        }

        if (storedData.otp !== otp) {
          storedData.attempts++
          return {
            success: false,
            message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`,
          }
        }

        // OTP verified successfully
        this.otpStore.delete(cleanPhone)

        // Create a session manually for WhatsApp verification
        // In production, you'd want to create a proper auth session
        return {
          success: true,
          message: "OTP verified successfully",
          data: { method: "whatsapp", phone: cleanPhone },
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify OTP. Please try again.",
      }
    }
  }

  // Resend OTP
  async resendOTP(phone: string, method: "sms" | "whatsapp" = "sms"): Promise<OTPResponse> {
    if (method === "sms") {
      return this.sendSMSOTP(phone)
    } else {
      return this.sendWhatsAppOTP(phone)
    }
  }

  // Format phone number to international format
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "")

    // Add country code if not present
    if (cleaned.length === 10 && !cleaned.startsWith("91")) {
      cleaned = "91" + cleaned
    }

    // Add + prefix
    if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned
    }

    return cleaned
  }

  // Validate phone number format
  validatePhoneNumber(phone: string): { valid: boolean; message: string } {
    const cleaned = phone.replace(/\D/g, "")

    if (cleaned.length < 10) {
      return {
        valid: false,
        message: "Phone number must be at least 10 digits",
      }
    }

    if (cleaned.length > 13) {
      return {
        valid: false,
        message: "Phone number is too long",
      }
    }

    // Indian mobile number validation
    const indianMobileRegex = /^(\+91|91)?[6-9]\d{9}$/
    if (!indianMobileRegex.test(cleaned)) {
      return {
        valid: false,
        message: "Please enter a valid Indian mobile number",
      }
    }

    return {
      valid: true,
      message: "Valid phone number",
    }
  }
}

export const otpService = OTPService.getInstance()
