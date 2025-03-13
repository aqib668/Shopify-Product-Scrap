"use server"

import { saveShopifyConnection } from "@/lib/supabase"

export async function saveShopifyConnectionAction(formData: FormData) {
  try {
    const storeUrl = formData.get("store_url") as string
    const apiKey = formData.get("api_key") as string
    const apiSecret = formData.get("api_secret") as string
    const accessToken = formData.get("access_token") as string

    // Validate inputs
    if (!storeUrl || !apiKey || !apiSecret || !accessToken) {
      return { success: false, message: "All fields are required" }
    }

    if (!storeUrl.includes(".myshopify.com")) {
      return { success: false, message: "Store URL must be a valid Shopify store URL" }
    }

    // Save to Supabase
    const result = await saveShopifyConnection({
      store_url: storeUrl,
      api_key: apiKey,
      api_secret: apiSecret,
      access_token: accessToken,
    })

    return { success: true, message: result.message }
  } catch (error) {
    console.error("Error in saveShopifyConnectionAction:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to connect to Shopify",
    }
  }
}

