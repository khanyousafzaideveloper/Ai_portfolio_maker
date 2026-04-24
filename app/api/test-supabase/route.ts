import { supabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Test Supabase connection by trying to select from portfolios table
    const { data, error } = await supabaseServer
      .from("portfolios")
      .select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase test error:", error)
      return NextResponse.json(
        { error: "Database connection failed", details: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      tableExists: true
    }, { status: 200 })
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json(
      { error: "Connection test failed", details: error.message },
      { status: 500 },
    )
  }
}