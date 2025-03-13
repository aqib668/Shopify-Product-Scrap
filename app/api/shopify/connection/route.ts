import { NextResponse } from "next/server"
import { getShopifyConnection, initializeDatabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Try to initialize the database first
    await initializeDatabase()

    // Then check for a connection
    const connection = await getShopifyConnection()

    return NextResponse.json({
      success: true,
      connection: connection
        ? {
            store_url: connection.store_url,
            // Don't return sensitive data
            connected: true,
          }
        : null,
    })
  } catch (error) {
    console.error("Error checking Shopify connection:", error)

    // Check if this is a setup issue
    if (error instanceof Error && (error.message.includes("relation") || error.message.includes("does not exist"))) {
      return NextResponse.json(
        {
          success: false,
          message: "Database setup required",
          setupNeeded: true,
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check connection",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

