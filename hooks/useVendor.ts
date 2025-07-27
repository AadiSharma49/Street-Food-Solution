"use client"

import { useEffect, useState } from "react"
import { supabase, type Vendor } from "@/lib/supabase"
import { useAuth } from "./useAuth"

export function useVendor() {
  const { user } = useAuth()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchVendor()
    } else {
      setVendor(null)
      setLoading(false)
    }
  }, [user])

  const fetchVendor = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("vendors").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching vendor:", error)
      } else {
        setVendor(data)
      }
    } catch (error) {
      console.error("Error fetching vendor:", error)
    } finally {
      setLoading(false)
    }
  }

  const createVendor = async (vendorData: Omit<Vendor, "id" | "created_at" | "updated_at">) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from("vendors")
        .insert([{ ...vendorData, id: user.id }])
        .select()
        .single()

      if (error) {
        console.error("Error creating vendor:", error)
        return null
      }

      setVendor(data)
      return data
    } catch (error) {
      console.error("Error creating vendor:", error)
      return null
    }
  }

  return {
    vendor,
    loading,
    createVendor,
    refetch: fetchVendor,
  }
}
