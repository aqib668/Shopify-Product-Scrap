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

// Initialize the database by creating necessary tables
export async function initializeDatabase() {
  try {
    const supabase = supabaseClient()

    // Check if store_connections table exists
    const { error: checkError } = await supabase.from("store_connections").select("id").limit(1)

    // If we get a "relation does not exist" error, create the table
    if (checkError && checkError.message.includes('relation "store_connections" does not exist')) {
      console.log("Creating store_connections table...")

      // Create the table using SQL
      const { error: createError } = await supabase.rpc("create_store_connections_table")

      if (createError) {
        console.error("Error creating table via RPC:", createError)

        // Fallback: Try creating the table directly with SQL
        const { error: sqlError } = await supabase.sql`
          CREATE TABLE IF NOT EXISTS store_connections (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            store_url TEXT NOT NULL,
            api_key TEXT NOT NULL,
            api_secret TEXT NOT NULL,
            access_token TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `

        if (sqlError) {
          console.error("Error creating table with SQL:", sqlError)
          throw new Error("Failed to create database tables")
        }
      }

      console.log("store_connections table created successfully")
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
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

    // Ensure the table exists
    await initializeDatabase()

    // First check if we already have a connection
    const { data: existingConnection, error: fetchError } = await supabase
      .from("store_connections")
      .select("id")
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking for existing connection:", fetchError)
      throw new Error("Failed to check for existing connection")
    }

    if (existingConnection) {
      // Update existing connection
      const { error } = await supabase.from("store_connections").update(connectionData).eq("id", existingConnection.id)

      if (error) {
        console.error("Error updating connection:", error)
        throw new Error("Failed to update connection")
      }
      return { success: true, message: "Connection updated successfully" }
    } else {
      // Create new connection
      const { error } = await supabase.from("store_connections").insert(connectionData)

      if (error) {
        console.error("Error creating connection:", error)
        throw new Error("Failed to create connection")
      }
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

    // Try to initialize the database first
    await initializeDatabase()

    const { data, error } = await supabase.from("store_connections").select("*").limit(1).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No connection found
        return null
      }

      // If the table doesn't exist, return null instead of throwing an error
      if (error.message.includes('relation "store_connections" does not exist')) {
        console.warn("store_connections table does not exist yet")
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

export { supabaseClient }

