"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Search, Filter, Star, MapPin, Phone, Mail, ArrowRight, Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  image_url?: string
  created_at?: string
  supplier_id: string
  suppliers?: {
    id: string
    company_name?: string
    business_name?: string
    owner_name: string
    city?: string
    state?: string
    location?: string
    phone: string
    email: string
    rating?: number
    verified?: boolean
  }
}

export default function HomePage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Spices & Condiments", label: "Spices & Condiments" },
    { value: "Grains & Cereals", label: "Grains & Cereals" },
    { value: "Dairy Products", label: "Dairy Products" },
    { value: "Meat & Poultry", label: "Meat & Poultry" },
    { value: "Oils & Fats", label: "Oils & Fats" },
    { value: "Fruits", label: "Fruits" },
    { value: "Pulses & Legumes", label: "Pulses & Legumes" },
    { value: "Seafood", label: "Seafood" },
    { value: "Beverages", label: "Beverages" },
  ]

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build a safer query that handles missing columns
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          unit,
          category,
          supplier_id,
          suppliers (
            id,
            company_name,
            owner_name,
            city,
            state,
            phone,
            email,
            verified
          )
        `)
        .eq("status", "active")
        .limit(12)
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again later.")
        return
      }

      // Process the data to handle missing fields
      const processedProducts = (data || []).map((product) => ({
        ...product,
        image_url: getDefaultImage(product.category),
        suppliers: product.suppliers
          ? {
              ...product.suppliers,
              business_name: product.suppliers.company_name || product.suppliers.owner_name,
              location:
                product.suppliers.city && product.suppliers.state
                  ? `${product.suppliers.city}, ${product.suppliers.state}`
                  : product.suppliers.city || "Location not specified",
              rating: 4.2, // Default rating
            }
          : undefined,
      }))

      setProducts(processedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const getDefaultImage = (category: string) => {
    const imageMap: Record<string, string> = {
      Vegetables: "/placeholder.svg?height=200&width=200&text=Fresh+Vegetables",
      "Spices & Condiments": "/placeholder.svg?height=200&width=200&text=Premium+Spices",
      "Grains & Cereals": "/placeholder.svg?height=200&width=200&text=Quality+Grains",
      "Dairy Products": "/placeholder.svg?height=200&width=200&text=Fresh+Dairy",
      "Meat & Poultry": "/placeholder.svg?height=200&width=200&text=Fresh+Meat",
      "Oils & Fats": "/placeholder.svg?height=200&width=200&text=Pure+Oils",
      Fruits: "/placeholder.svg?height=200&width=200&text=Fresh+Fruits",
      "Pulses & Legumes": "/placeholder.svg?height=200&width=200&text=Quality+Pulses",
      Seafood: "/placeholder.svg?height=200&width=200&text=Fresh+Seafood",
      Beverages: "/placeholder.svg?height=200&width=200&text=Quality+Beverages",
    }
    return imageMap[category] || "/placeholder.svg?height=200&width=200&text=Food+Product"
  }

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.suppliers?.business_name &&
        product.suppliers.business_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect. Trade. Grow.</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              India's premier B2B marketplace connecting street food vendors with trusted suppliers
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vendor/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                    Join as Vendor
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/supplier/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
                  >
                    Join as Supplier
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover quality ingredients from verified suppliers across India
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchFeaturedProducts} className="bg-orange-500 hover:bg-orange-600">
                <Loader2 className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0016 7.414V9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image_url || getDefaultImage(product.category)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-orange-500">{product.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description || "Quality product from verified supplier"}
                    </p>

                    {user ? (
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                        <span className="text-sm text-gray-500">per {product.unit}</span>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <div className="bg-gray-100 rounded p-2 text-center">
                          <p className="text-sm text-gray-600">Login to view prices</p>
                        </div>
                      </div>
                    )}

                    {product.suppliers && (
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{product.suppliers.business_name}</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{product.suppliers.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {product.suppliers.location}
                        </div>
                      </div>
                    )}

                    {user ? (
                      <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600">Contact Supplier</Button>
                    ) : (
                      <Link href="/vendor/login">
                        <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600">Login to Contact</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of vendors and suppliers already trading on VendorConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vendor/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Start as Vendor
                </Button>
              </Link>
              <Link href="/supplier/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
                >
                  Start as Supplier
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VC</span>
                </div>
                <span className="text-xl font-bold">VendorConnect</span>
              </div>
              <p className="text-gray-600">Connecting street food vendors with trusted suppliers across India.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/vendor/register" className="hover:text-orange-500">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/login" className="hover:text-orange-500">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Find Suppliers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/supplier/register" className="hover:text-orange-500">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/supplier/login" className="hover:text-orange-500">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    List Products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@vendorconnect.in</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 VendorConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
