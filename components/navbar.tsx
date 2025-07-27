"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useVendor } from "@/hooks/useVendor"
import { useSupplier } from "@/hooks/useSupplier"
import { supabase } from "@/lib/supabase"
import { User, Settings, LogOut, Bell, MessageCircle, Package, BarChart3, Menu, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const { user, logout } = useAuth()
  const { vendor } = useVendor()
  const { supplier } = useSupplier()
  const router = useRouter()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(0)
  const [messages, setMessages] = useState(0)

  const currentUser = vendor || supplier
  const userType = vendor ? "vendor" : supplier ? "supplier" : null

  useEffect(() => {
    if (user && userType) {
      fetchNotificationCounts()
    }
  }, [user, userType])

  const fetchNotificationCounts = async () => {
    try {
      // Fetch unread notifications count
      const { count: notificationCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .eq("user_type", userType)
        .eq("read", false)

      // Fetch unread messages count
      const { count: messageCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user?.id)
        .eq("read", false)

      setNotifications(notificationCount || 0)
      setMessages(messageCount || 0)
    } catch (error) {
      console.error("Error fetching notification counts:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserDisplayName = () => {
    if (vendor) return vendor.business_name || vendor.owner_name
    if (supplier) return supplier.company_name || supplier.owner_name
    return "User"
  }

  const getDashboardLink = () => {
    return userType === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard"
  }

  const getProductsLink = () => {
    return userType === "vendor" ? "/vendor/products" : "/supplier/products"
  }

  const getProfileLink = () => {
    return userType === "vendor" ? "/vendor/profile" : "/supplier/profile"
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">VendorConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && currentUser ? (
              <>
                {/* Navigation Links */}
                <Link href={getDashboardLink()} className="text-gray-700 hover:text-orange-500 font-medium">
                  Dashboard
                </Link>
                <Link href={getProductsLink()} className="text-gray-700 hover:text-orange-500 font-medium">
                  Products
                </Link>

                {/* Notifications */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Bell className="w-5 h-5 text-gray-600 hover:text-orange-500 cursor-pointer" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                        {notifications > 99 ? "99+" : notifications}
                      </Badge>
                    )}
                  </div>
                  <div className="relative">
                    <MessageCircle className="w-5 h-5 text-gray-600 hover:text-orange-500 cursor-pointer" />
                    {messages > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                        {messages > 99 ? "99+" : messages}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser.profile_image || "/placeholder.svg"} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                          {getInitials(getUserDisplayName())}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                            <Badge variant="secondary" className="text-xs">
                              {userType === "vendor" ? "Vendor" : "Supplier"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getProfileLink()} className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={getProductsLink()} className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Products
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/vendor/login">
                  <Button variant="ghost">Vendor Login</Button>
                </Link>
                <Link href="/supplier/login">
                  <Button variant="ghost">Supplier Login</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && currentUser ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 border-b">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentUser.profile_image || "/placeholder.svg"} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {getInitials(getUserDisplayName())}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                      <Badge variant="secondary" className="text-xs">
                        {userType === "vendor" ? "Vendor" : "Supplier"}
                      </Badge>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={getProductsLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href={getProfileLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/vendor/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vendor Login
                  </Link>
                  <Link
                    href="/supplier/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Supplier Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
