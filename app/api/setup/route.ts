import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/supabase"

export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Database initialized successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize database",
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in setup route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during setup",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

