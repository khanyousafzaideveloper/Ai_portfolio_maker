import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json()

    if (!text || !text.trim()) {
      return Response.json({ error: "Text is required" }, { status: 400 })
    }

    let prompt = ""
    if (type === "experience") {
      prompt = `Enhance and improve the following work experience description to make it more professional, impactful, and compelling. Add action verbs and quantifiable achievements where possible. Keep it concise but detailed:\n\n"${text}"\n\nProvide only the enhanced version without any additional explanation.`
    } else if (type === "achievements") {
      prompt = `Enhance and improve the following achievements/awards description to make it sound more impressive and professional. Use strong language and highlight the impact. Keep it clear and concise:\n\n"${text}"\n\nProvide only the enhanced version without any additional explanation.`
    } else if (type === "events") {
      prompt = `Enhance and improve the following conferences/seminars/trainings description to make it more impactful and professional. Add context about what was learned or how it contributed to professional growth:\n\n"${text}"\n\nProvide only the enhanced version without any additional explanation.`
    }

    const { text: enhancedText } = await generateText({
      model: "groq/llama-3.3-70b-versatile",
      prompt,
    })

    return Response.json({ enhancedText })
  } catch (error) {
    console.error("Text enhancement error:", error)
    return Response.json({ error: "Failed to enhance text" }, { status: 500 })
  }
}
