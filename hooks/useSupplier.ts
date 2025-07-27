"use client"

import { useEffect, useState } from "react"
import { supabase, type Supplier } from "@/lib/supabase"
import { useAuth } from "./useAuth"

export function useSupplier() {
  const { user } = useAuth()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchSupplier()
    } else {
      setSupplier(null)
      setLoading(false)
    }
  }, [user])

  const fetchSupplier = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("suppliers").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching supplier:", error)
      } else {
        setSupplier(data)
      }
    } catch (error) {
      console.error("Error fetching supplier:", error)
    } finally {
      setLoading(false)
    }
  }

  const createSupplier = async (
    supplierData: Omit<Supplier, "id" | "created_at" | "updated_at" | "verified" | "rating">,
  ) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([
          {
            ...supplierData,
            id: user.id,
            verified: false,
            rating: 0,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating supplier:", error)
        return null
      }

      setSupplier(data)
      return data
    } catch (error) {
      console.error("Error creating supplier:", error)
      return null
    }
  }

  return {
    supplier,
    loading,
    createSupplier,
    refetch: fetchSupplier,
  }
}
