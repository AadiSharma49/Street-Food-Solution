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
import {
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  ShoppingCart,
  Users,
  TrendingUp,
  Shield,
  Eye,
} from "lucide-react"

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

  const stats = [
    { icon: Users, label: "Active Vendors", value: "2,500+" },
    { icon: ShoppingCart, label: "Verified Suppliers", value: "850+" },
    { icon: TrendingUp, label: "Orders Completed", value: "15,000+" },
    { icon: Shield, label: "Quality Assured", value: "98%" },
  ]

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use a safer query that matches the actual database schema
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
        console.error("Database error:", error)
        // Use sample data if database query fails
        setProducts(getSampleProducts())
        return
      }

      if (!data || data.length === 0) {
        setProducts(getSampleProducts())
        return
      }

      // Process the data to handle missing fields
      const processedProducts = data.map((product) => ({
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
      setProducts(getSampleProducts())
    } finally {
      setLoading(false)
    }
  }

  const getSampleProducts = (): Product[] => {
    return [
      {
        id: "1",
        name: "Fresh Tomatoes",
        description: "Premium quality fresh tomatoes, perfect for street food preparations",
        price: 45,
        unit: "kg",
        category: "Vegetables",
        image_url: "/placeholder.svg?height=200&width=200&text=Fresh+Tomatoes",
        supplier_id: "1",
        suppliers: {
          id: "1",
          owner_name: "Mumbai Fresh Mart",
          business_name: "Mumbai Fresh Mart",
          city: "Mumbai",
          state: "Maharashtra",
          location: "Mumbai, Maharashtra",
          phone: "+91 98765 43210",
          email: "contact@mumbaimart.com",
          rating: 4.8,
          verified: true,
        },
      },
      {
        id: "2",
        name: "Basmati Rice",
        description: "Premium long grain basmati rice, ideal for biryanis and pulao",
        price: 120,
        unit: "kg",
        category: "Grains & Cereals",
        image_url: "/placeholder.svg?height=200&width=200&text=Basmati+Rice",
        supplier_id: "2",
        suppliers: {
          id: "2",
          owner_name: "Delhi Grain House",
          business_name: "Delhi Grain House",
          city: "Delhi",
          state: "NCR",
          location: "Delhi, NCR",
          phone: "+91 98765 43211",
          email: "orders@delhigrain.com",
          rating: 4.7,
          verified: true,
        },
      },
      {
        id: "3",
        name: "Red Chili Powder",
        description: "Authentic red chili powder with perfect heat and color",
        price: 180,
        unit: "kg",
        category: "Spices & Condiments",
        image_url: "/placeholder.svg?height=200&width=200&text=Red+Chili+Powder",
        supplier_id: "3",
        suppliers: {
          id: "3",
          owner_name: "Rajasthan Spice Co.",
          business_name: "Rajasthan Spice Co.",
          city: "Jodhpur",
          state: "Rajasthan",
          location: "Jodhpur, Rajasthan",
          phone: "+91 98765 43212",
          email: "spices@rajasthanspice.com",
          rating: 4.9,
          verified: true,
        },
      },
      {
        id: "4",
        name: "Fresh Paneer",
        description: "Daily fresh paneer made from pure milk, perfect for curries",
        price: 280,
        unit: "kg",
        category: "Dairy Products",
        image_url: "/placeholder.svg?height=200&width=200&text=Fresh+Paneer",
        supplier_id: "4",
        suppliers: {
          id: "4",
          owner_name: "Punjab Dairy Farm",
          business_name: "Punjab Dairy Farm",
          city: "Amritsar",
          state: "Punjab",
          location: "Amritsar, Punjab",
          phone: "+91 98765 43213",
          email: "dairy@punjabfarm.com",
          rating: 4.6,
          verified: true,
        },
      },
      {
        id: "5",
        name: "Cooking Oil",
        description: "Premium refined cooking oil for all your frying needs",
        price: 140,
        unit: "liter",
        category: "Oils & Fats",
        image_url: "/placeholder.svg?height=200&width=200&text=Cooking+Oil",
        supplier_id: "5",
        suppliers: {
          id: "5",
          owner_name: "Gujarat Oil Mills",
          business_name: "Gujarat Oil Mills",
          city: "Ahmedabad",
          state: "Gujarat",
          location: "Ahmedabad, Gujarat",
          phone: "+91 98765 43214",
          email: "oil@gujaratmills.com",
          rating: 4.5,
          verified: true,
        },
      },
      {
        id: "6",
        name: "Green Coriander",
        description: "Fresh green coriander leaves for garnishing and flavor",
        price: 25,
        unit: "bunch",
        category: "Vegetables",
        image_url: "/placeholder.svg?height=200&width=200&text=Green+Coriander",
        supplier_id: "1",
        suppliers: {
          id: "1",
          owner_name: "Mumbai Fresh Mart",
          business_name: "Mumbai Fresh Mart",
          city: "Mumbai",
          state: "Maharashtra",
          location: "Mumbai, Maharashtra",
          phone: "+91 98765 43210",
          email: "contact@mumbaimart.com",
          rating: 4.8,
          verified: true,
        },
      },
      {
        id: "7",
        name: "Wheat Flour",
        description: "Fine quality wheat flour for rotis, naans and bread",
        price: 35,
        unit: "kg",
        category: "Grains & Cereals",
        image_url: "/placeholder.svg?height=200&width=200&text=Wheat+Flour",
        supplier_id: "2",
        suppliers: {
          id: "2",
          owner_name: "Delhi Grain House",
          business_name: "Delhi Grain House",
          city: "Delhi",
          state: "NCR",
          location: "Delhi, NCR",
          phone: "+91 98765 43211",
          email: "orders@delhigrain.com",
          rating: 4.7,
          verified: true,
        },
      },
      {
        id: "8",
        name: "Garam Masala",
        description: "Aromatic blend of traditional Indian spices",
        price: 320,
        unit: "kg",
        category: "Spices & Condiments",
        image_url: "/placeholder.svg?height=200&width=200&text=Garam+Masala",
        supplier_id: "3",
        suppliers: {
          id: "3",
          owner_name: "Rajasthan Spice Co.",
          business_name: "Rajasthan Spice Co.",
          city: "Jodhpur",
          state: "Rajasthan",
          location: "Jodhpur, Rajasthan",
          phone: "+91 98765 43212",
          email: "spices@rajasthanspice.com",
          rating: 4.9,
          verified: true,
        },
      },
    ]
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connecting Street Food Vendors with
              <span className="block text-yellow-300">Trusted Suppliers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              End the struggle of finding quality raw materials. Join India's largest B2B marketplace for street food
              vendors and access verified suppliers, bulk pricing, and quality assurance.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vendor/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
                    Join as Vendor
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/supplier/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent px-8 py-3"
                  >
                    Join as Supplier
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-100 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white">
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

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products Available</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the variety of quality ingredients available from our verified suppliers across India
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
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <Link href="/vendor/login">
                <Button className="bg-orange-500 hover:bg-orange-600">Login to Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={product.image_url || getDefaultImage(product.category)}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white">{product.category}</Badge>
                    {!user && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <Eye className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Login to view details</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description || "Quality product from verified supplier"}
                    </p>

                    {/* Product availability indicator */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Available in:</span>
                        <span className="text-sm font-medium text-green-600">{product.unit}</span>
                      </div>
                      {user ? (
                        <div className="mt-1">
                          <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                          <span className="text-sm text-gray-500"> per {product.unit}</span>
                        </div>
                      ) : (
                        <div className="mt-1 bg-gray-100 rounded px-2 py-1">
                          <p className="text-xs text-gray-600 text-center">Login to view pricing</p>
                        </div>
                      )}
                    </div>

                    {product.suppliers && (
                      <div className="border-t pt-3 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{product.suppliers.business_name}</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs">{product.suppliers.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {product.suppliers.location}
                        </div>
                        {product.suppliers.verified && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            ✓ Verified Supplier
                          </Badge>
                        )}
                      </div>
                    )}

                    {user ? (
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Contact Supplier</Button>
                    ) : (
                      <Link href="/vendor/login">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">Login to Contact</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View More Button */}
          <div className="text-center mt-12">
            {user ? (
              <Link href="/vendor/products">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                  Browse All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/vendor/login">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                  Login to Browse All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Street Food Vendors Choose VendorConnect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bulk Ordering Power</h3>
              <p className="text-gray-600">Join group orders to get wholesale prices and reduce costs by up to 30%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Verification</h3>
              <p className="text-gray-600">All suppliers are verified with quality certifications and regular audits</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Trust & Reviews</h3>
              <p className="text-gray-600">Transparent rating system with real vendor reviews and supplier ratings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Inventory</h3>
              <p className="text-gray-600">Track your stock levels and get alerts when it's time to reorder</p>
            </div>
          </div>
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
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                  Start as Vendor
                </Button>
              </Link>
              <Link href="/supplier/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent px-8"
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
