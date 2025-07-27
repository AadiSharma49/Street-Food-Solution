"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Users, TrendingUp, Shield, Star, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [userType, setUserType] = useState<"vendor" | "supplier" | null>(null)

  const stats = [
    { icon: Users, label: "Active Vendors", value: "2,500+" },
    { icon: ShoppingCart, label: "Verified Suppliers", value: "850+" },
    { icon: TrendingUp, label: "Orders Completed", value: "15,000+" },
    { icon: Shield, label: "Quality Assured", value: "98%" },
  ]

  const features = [
    {
      title: "Bulk Ordering Power",
      description: "Join group orders to get wholesale prices and reduce costs by up to 30%",
      icon: "🛒",
    },
    {
      title: "Quality Verification",
      description: "All suppliers are verified with quality certifications and regular audits",
      icon: "✅",
    },
    {
      title: "Trust & Reviews",
      description: "Transparent rating system with real vendor reviews and supplier ratings",
      icon: "⭐",
    },
    {
      title: "Smart Inventory",
      description: "Track your stock levels and get alerts when it's time to reorder",
      icon: "📊",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VendorConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/vendor/login">
                <Button variant="ghost">Vendor Login</Button>
              </Link>
              <Link href="/supplier/login">
                <Button variant="ghost">Supplier Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Street Food Vendors with
            <span className="text-orange-500"> Trusted Suppliers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            End the struggle of finding quality raw materials. Join India's largest B2B marketplace for street food
            vendors and access verified suppliers, bulk pricing, and quality assurance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/vendor/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Join as Vendor
              </Button>
            </Link>
            <Link href="/supplier/register">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 bg-transparent"
              >
                Become a Supplier
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Street Food Vendors Choose VendorConnect
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>

          <Tabs defaultValue="vendor" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vendor">For Vendors</TabsTrigger>
              <TabsTrigger value="supplier">For Suppliers</TabsTrigger>
            </TabsList>

            <TabsContent value="vendor" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-500">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Register & Browse</h3>
                  <p className="text-gray-600">Create your vendor profile and browse verified suppliers in your area</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-500">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Compare & Order</h3>
                  <p className="text-gray-600">
                    Compare prices, join group orders, and place bulk orders for better rates
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-500">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Receive & Review</h3>
                  <p className="text-gray-600">Get quality materials delivered and rate your experience</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="supplier" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-500">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Get Verified</h3>
                  <p className="text-gray-600">Complete verification process with quality certifications</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-500">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">List Products</h3>
                  <p className="text-gray-600">Add your product catalog with competitive bulk pricing</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-500">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Fulfill Orders</h3>
                  <p className="text-gray-600">Receive bulk orders and build long-term vendor relationships</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "VendorConnect helped me reduce my raw material costs by 25%. The group ordering feature is amazing!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-orange-600">RK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Raj Kumar</div>
                    <div className="text-sm text-gray-500">Chaat Vendor, Delhi</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally found reliable suppliers for my dosa stall. Quality is consistent and delivery is on time."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-orange-600">SP</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sunita Patel</div>
                    <div className="text-sm text-gray-500">Dosa Vendor, Mumbai</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "As a supplier, VendorConnect gave me access to hundreds of vendors. My business has grown 3x!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-blue-600">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Amit Singh</div>
                    <div className="text-sm text-gray-500">Wholesale Supplier, Bangalore</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of vendors and suppliers who are already saving money and building trust through
            VendorConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vendor/register">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3">
                Start as Vendor
              </Button>
            </Link>
            <Link href="/supplier/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 bg-transparent"
              >
                Become Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VC</span>
                </div>
                <span className="text-xl font-bold">VendorConnect</span>
              </div>
              <p className="text-gray-400">
                Empowering street food vendors across India with reliable supply chain solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/vendor/register" className="hover:text-white">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/supplier/register" className="hover:text-white">
                    Join as Supplier
                  </Link>
                </li>
                <li>
                  <Link href="/supplier/login" className="hover:text-white">
                    Supplier Login
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white">
                    Verification Process
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@vendorconnect.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VendorConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
