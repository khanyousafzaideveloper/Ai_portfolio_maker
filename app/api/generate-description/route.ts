import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectName, skills } = await request.json()

    if (!projectName) {
      return NextResponse.json({ error: "Project name required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Generate a professional 1-2 sentence description for a project called "${projectName}" built with ${skills || "web technologies"}. Make it concise, impressive, and suitable for a portfolio. Return only the description, no quotes or extra text.`,
      temperature: 0.7,
      maxTokens: 150,
    })

    return NextResponse.json({
      success: true,
      description: text.trim(),
    })
  } catch (error) {
    console.error("Description generation error:", error)
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 })
  }
}
