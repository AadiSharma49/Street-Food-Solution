import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Vendor {
  id: string
  business_name: string
  owner_name: string
  phone: string
  email?: string
  address: string
  city: string
  state: string
  pincode: string
  business_type: string
  years_in_business: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  company_name: string
  owner_name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  business_type: string
  years_in_business: string
  gst_number?: string
  fssai_license?: string
  description: string
  categories: string[]
  min_order_value: number
  delivery_radius: number
  verified: boolean
  rating: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  supplier_id: string
  name: string
  category: string
  price: number
  unit: string
  stock_quantity: number
  min_order_quantity: number
  description?: string
  image_url?: string
  status: "active" | "inactive" | "out_of_stock"
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  vendor_id: string
  supplier_id: string
  items: OrderItem[]
  total_amount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  delivery_address: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  quantity: number
  price: number
  total: number
}

export interface GroupOrder {
  id: string
  product_id: string
  target_quantity: number
  current_quantity: number
  price_per_unit: number
  normal_price: number
  end_date: string
  status: "active" | "completed" | "cancelled"
  participants: string[]
  created_at: string
  updated_at: string
}
