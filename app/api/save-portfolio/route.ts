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
  const filename = `${sanitizeStorageKey(path)}.${extension}`
  const buffer = Buffer.from(base64, "base64")

  const { error } = await supabaseServer.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
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
  const filename = `${sanitizeStorageKey(path)}.${extension}`
  const buffer = Buffer.from(await response.arrayBuffer())

  const { error } = await supabaseServer.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
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

    const userId = portfolioData.email.replace(/[^a-zA-Z0-9_-]/g, "_")
    const timestamp = Date.now()

    let profilePicUrl = null
    if (portfolioData.profilePic) {
      profilePicUrl = await uploadImage(
        `profiles/${userId}/profile-${timestamp}`,
        portfolioData.profilePic,
      )
    }

    const projects = Array.isArray(portfolioData.projects)
      ? await Promise.all(
          (portfolioData.projects as Project[]).map(
            async (project: Project, index: number) => {
              if (!project || typeof project !== "object") return project

              const imageUrl = project.image
              const uploadedImageUrl = imageUrl
                ? await uploadImage(
                    `projects/${userId}/${timestamp}-${index}`,
                    imageUrl,
                  )
                : null

              return {
                ...project,
                image: uploadedImageUrl || imageUrl || null,
              }
            },
          ),
        )
      : []

    const { data: insertedData, error } = await supabaseServer
      .from("portfolios")
      .insert([
        {
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
          profile_pic: profilePicUrl,
          projects,
          portfolio_html: portfolioData.portfolioHtml,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .maybeSingle()

    if (error) {
      console.error("Save error:", error)
      return NextResponse.json(
        {
          error: "Save failed",
          details: error.message || JSON.stringify(error),
        },
        { status: 500 },
      )
    }

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
