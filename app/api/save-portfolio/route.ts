import { supabaseServer } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

const BUCKET_NAME = "portfolio-images"

type Project = {
  name?: string
  description?: string
  image?: string | null
  [key: string]: unknown
}

type PortfolioData = {
  name: string
  email: string
  phone?: string
  linkedin?: string
  github?: string
  twitter?: string
  website?: string
  tagline?: string
  aboutHint?: string
  skills?: string
  experience?: string
  researchProfile?: string
  achievements?: string
  events?: string
  languages?: string
  template?: string
  profilePic?: string | null
  projects?: Project[]
  portfolioHtml?: string
}

function isDataUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:")
}

function sanitizeStorageKey(key: string) {
  return key
    .replace(/^\/+/, "")
    .replace(/\.\./g, "_")
    .replace(/[^a-zA-Z0-9_\-./]/g, "_")
    .replace(/\/+/g, "/")
    .toLowerCase()
}

function normalizeExtension(extension: string) {
  return extension.toLowerCase().split("+")[0].replace(/[^a-z0-9]/g, "") || "png"
}

async function uploadDataUrl(path: string, dataUrl: string) {
  const [meta, base64] = dataUrl.split(",")
  if (!base64) {
    throw new Error("Invalid image data")
  }

  const mimeMatch = meta.match(/data:(.*?);base64/)
  const contentType = mimeMatch?.[1]?.split(";")?.[0] || "image/png"
  const extension = normalizeExtension(contentType.split("/")[1] || "png")
  const filename = `${sanitizeStorageKey(path)}.${extension}`.substring(0, 200)
  
  if (!filename || filename.startsWith(".")) {
    throw new Error(`Invalid filename generated: ${filename}`)
  }

  const buffer = Buffer.from(base64, "base64")

  const { error } = await supabaseServer.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error("Upload error details:", { error, filename, path, contentType })
    throw error
  }

  const { data } = supabaseServer.storage.from(BUCKET_NAME).getPublicUrl(filename)
  return data.publicUrl
}

async function uploadRemoteImage(path: string, imageUrl: string) {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error("Failed to download remote image")
  }

  const contentType = (response.headers.get("content-type") || "image/png").split(";")?.[0]
  const extension = normalizeExtension(contentType.split("/")[1] || "png")
  const filename = `${sanitizeStorageKey(path)}.${extension}`.substring(0, 200)
  
  if (!filename || filename.startsWith(".")) {
    throw new Error(`Invalid filename generated: ${filename}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())

  const { error } = await supabaseServer.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error("Upload error details:", { error, filename, path, contentType })
    throw error
  }

  const { data } = supabaseServer.storage.from(BUCKET_NAME).getPublicUrl(filename)
  return data.publicUrl
}

async function uploadImage(path: string, image: string | null | undefined) {
  if (!image) {
    return null
  }

  if (isDataUrl(image)) {
    return await uploadDataUrl(path, image)
  }

  const imageString = image as string
  if (typeof imageString === "string" && imageString.startsWith("http")) {
    return await uploadRemoteImage(path, imageString)
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const portfolioData = await request.json()

    if (!portfolioData.name || !portfolioData.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase URL or service role key")
      return NextResponse.json(
        {
          error: "Save failed",
          details: "Supabase environment variables are not configured",
        },
        { status: 500 },
      )
    }

    const body = {
      name: portfolioData.name,
      email: portfolioData.email,
      phone: portfolioData.phone,
      linkedin: portfolioData.linkedin,
      github: portfolioData.github,
      twitter: portfolioData.twitter,
      website: portfolioData.website,
      tagline: portfolioData.tagline,
      about_hint: portfolioData.aboutHint,
      skills: portfolioData.skills,
      experience: portfolioData.experience,
      research_profile: portfolioData.researchProfile,
      achievements: portfolioData.achievements,
      events: portfolioData.events,
      languages: portfolioData.languages,
      template: portfolioData.template,
      profile_pic: null,
      projects: Array.isArray(portfolioData.projects) ? portfolioData.projects : [],
      portfolio_html: portfolioData.portfolioHtml,
      created_at: new Date().toISOString(),
    }

    try {
      const restUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/portfolios`
      const response = await fetch(restUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify([body]),
      })

      const result = await response.json()
      if (!response.ok) {
        console.error("Supabase REST save failed:", response.status, result)
        return NextResponse.json(
          {
            error: "Save failed",
            details: result?.message || JSON.stringify(result),
            fullError: JSON.stringify(result),
          },
          { status: 500 },
        )
      }

      const insertedData = Array.isArray(result) ? result[0] : result
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json(
        {
          error: "Save failed",
          details: `Fetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
        },
        { status: 500 },
      )
    }

    const insertedData = null

    return NextResponse.json(
      { success: true, data: insertedData },
      { status: 201 },
    )
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json(
      {
        error: "Save failed",
        details:
          error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 },
      )
    }

    const { data, error } = await supabaseServer
      .from("portfolios")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Fetch error:", error)
      return NextResponse.json(
        { error: "Fetch failed" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json(
      { error: "Fetch failed" },
      { status: 500 },
    )
  }
}
