"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Shield,
  Star,
  MapPin,
  Phone,
  Mail,
  Search,
  Eye,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { supabase, type Product, type Supplier } from "@/lib/supabase"

interface ProductWithSupplier extends Product {
  suppliers: Supplier
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithSupplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains & Cereals",
    "Spices & Condiments",
    "Dairy Products",
    "Oils & Fats",
    "Pulses & Legumes",
    "Meat & Poultry",
    "Seafood",
    "Beverages",
  ]

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      // First, let's check what columns exist in the products table
      const { data: tableInfo, error: tableError } = await supabase.from("products").select("*").limit(1)

      if (tableError) {
        console.error("Error checking table structure:", tableError)
        setLoading(false)
        return
      }

      // Build the query based on available columns
      let query = supabase
        .from("products")
        .select(`
          id,
          name,
          category,
          price,
          unit,
          suppliers (
            id,
            company_name,
            city,
            state,
            rating,
            verified
          )
        `)
        .eq("status", "active")
        .limit(12)

      // Only add order by created_at if the column exists
      if (tableInfo && tableInfo.length > 0 && "created_at" in tableInfo[0]) {
        query = query.order("created_at", { ascending: false })
      } else {
        // Fallback to ordering by name if created_at doesn't exist
        query = query.order("name", { ascending: true })
      }

      const { data, error } = await query

      if (error) throw error
      setFeaturedProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      // Set some mock data for demonstration if database fails
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = featuredProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.suppliers.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

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

  const getProductImage = (product: Product) => {
    // Check if product has image_url property
    const imageUrl = (product as any).image_url
    if (imageUrl) {
      return imageUrl
    }

    const categoryImages: Record<string, string> = {
      Vegetables: "/placeholder.svg?height=200&width=200&text=Fresh+Vegetables",
      Fruits: "/placeholder.svg?height=200&width=200&text=Fresh+Fruits",
      "Grains & Cereals": "/placeholder.svg?height=200&width=200&text=Quality+Grains",
      "Spices & Condiments": "/placeholder.svg?height=200&width=200&text=Premium+Spices",
      "Dairy Products": "/placeholder.svg?height=200&width=200&text=Fresh+Dairy",
      "Oils & Fats": "/placeholder.svg?height=200&width=200&text=Pure+Oils",
      "Pulses & Legumes": "/placeholder.svg?height=200&width=200&text=Quality+Pulses",
      "Meat & Poultry": "/placeholder.svg?height=200&width=200&text=Fresh+Meat",
      Seafood: "/placeholder.svg?height=200&width=200&text=Fresh+Seafood",
      Beverages: "/placeholder.svg?height=200&width=200&text=Quality+Beverages",
    }

    return (
      categoryImages[product.category] ||
      `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name)}`
    )
  }

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
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 w-full sm:w-auto">
                Join as Vendor
              </Button>
            </Link>
            <Link href="/supplier/register">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 bg-transparent w-full sm:w-auto"
              >
                Become a Supplier
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
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

      {/* Featured Products Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Quality Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our featured products from verified suppliers. Login to see full details, prices, and place orders.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              <div className="mt-6">
                <Link href="/vendor/login">
                  <Button className="bg-orange-500 hover:bg-orange-600">Login to Browse All Products</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow relative overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={getProductImage(product) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name)}`
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Login to view details</p>
                      </div>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-800">{product.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹***</span>
                        <span className="text-sm text-gray-600">/{product.unit}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Login for price</p>
                      </div>
                    </div>

                    <div className="mb-3 pb-3 border-b">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Supplier:</span>
                        <span className="font-medium">{product.suppliers.company_name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span>{product.suppliers.rating || "New"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{product.suppliers.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href="/vendor/login" className="flex-1">
                        <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/vendor/login">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Login to See All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Street Food Vendors Choose VendorConnect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>

          <Tabs defaultValue="vendor" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vendor">For Vendors</TabsTrigger>
              <TabsTrigger value="supplier">For Suppliers</TabsTrigger>
            </TabsList>

            <TabsContent value="vendor" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
