"use client"

import { useState } from "react"
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
import { User, Settings, LogOut, Bell, MessageCircle, Package, BarChart3, Menu, X } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const { vendor } = useVendor()
  const { supplier } = useSupplier()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getUserDisplayName = () => {
    if (vendor) return vendor.business_name || vendor.owner_name
    if (supplier) return supplier.company_name || supplier.owner_name
    return user?.phone || "User"
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserType = () => {
    if (vendor) return "Vendor"
    if (supplier) return "Supplier"
    return null
  }

  const getDashboardLink = () => {
    if (vendor) return "/vendor/dashboard"
    if (supplier) return "/supplier/dashboard"
    return "/"
  }

  const getProfileLink = () => {
    if (vendor) return "/vendor/profile"
    if (supplier) return "/supplier/profile"
    return "/"
  }

  const getProductsLink = () => {
    if (vendor) return "/vendor/products"
    if (supplier) return "/supplier/products"
    return "/"
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
            {user ? (
              <>
                {/* Navigation Links */}
                <Link href={getDashboardLink()} className="text-gray-700 hover:text-orange-500 font-medium">
                  Dashboard
                </Link>
                <Link href={getProductsLink()} className="text-gray-700 hover:text-orange-500 font-medium">
                  Products
                </Link>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="sm" className="relative">
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg" alt={getUserDisplayName()} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                        {getUserType() && (
                          <Badge variant="secondary" className="text-xs">
                            {getUserType()}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getProfileLink()} className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={getProductsLink()} className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Products
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/vendor/login">
                  <Button variant="ghost">Vendor Login</Button>
                </Link>
                <Link href="/supplier/login">
                  <Button variant="ghost">Supplier Login</Button>
                </Link>
                <Link href="/vendor/register">
                  <Button className="bg-orange-500 hover:bg-orange-600">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2 border-b">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg" alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                      {getUserType() && (
                        <Badge variant="secondary" className="text-xs">
                          {getUserType()}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link
                    href={getDashboardLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={getProductsLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href={getProfileLink()}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/vendor/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vendor Login
                  </Link>
                  <Link
                    href="/supplier/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Supplier Login
                  </Link>
                  <Link
                    href="/vendor/register"
                    className="block px-3 py-2 text-base font-medium bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
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
