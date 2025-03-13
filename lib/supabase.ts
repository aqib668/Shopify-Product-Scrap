import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
  )
}

// Only create the client if we have the required values
const supabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Cannot initialize Supabase client. Environment variables NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.",
    )
  }
  return createClient(supabaseUrl, supabaseKey)
}

// Safely execute Supabase operations
export async function saveShopifyConnection(connectionData: {
  store_url: string
  api_key: string
  api_secret: string
  access_token: string
}) {
  try {
    const supabase = supabaseClient()

    // First check if we already have a connection
    const { data: existingConnection, error: fetchError } = await supabase
      .from("store_connections")
      .select("id")
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError
    }

    if (existingConnection) {
      // Update existing connection
      const { error } = await supabase.from("store_connections").update(connectionData).eq("id", existingConnection.id)

      if (error) throw error
      return { success: true, message: "Connection updated successfully" }
    } else {
      // Create new connection
      const { error } = await supabase.from("store_connections").insert(connectionData)

      if (error) throw error
      return { success: true, message: "Connection created successfully" }
    }
  } catch (error) {
    console.error("Error saving Shopify connection:", error)
    throw error
  }
}

export async function getShopifyConnection() {
  try {
    const supabase = supabaseClient()

    const { data, error } = await supabase.from("store_connections").select("*").limit(1).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No connection found
        return null
      }
      console.error("Error fetching Shopify connection:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting Shopify connection:", error)
    return null
  }
}

