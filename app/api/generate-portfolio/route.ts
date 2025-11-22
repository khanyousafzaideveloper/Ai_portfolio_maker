import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

interface Project {
  name: string
  description: string
  image?: string
}

interface RequestBody {
  name: string
  email: string
  phone?: string
  linkedin?: string
  github?: string
  twitter?: string
  website?: string
  tagline: string
  aboutHint: string
  skills: string
  experience: string
  researchProfile?: string
  achievements?: string
  events?: string
  languages?: string
  useAI: boolean
  template: string
  projects: Project[]
  profilePic?: string
}

async function generateAIContent(
  name: string,
  skills: string,
  projects: Project[],
  aboutHint: string,
  experience: string,
  researchProfile = "",
) {
  try {
    const projectNames = projects
      .map((p) => p.name)
      .filter((n) => n)
      .join(", ")

    const prompt = `You are a professional portfolio writer. Create professional portfolio content for:

Name: ${name}
Skills: ${skills}
Projects: ${projectNames}
Experience: ${experience ? experience.substring(0, 200) : "Not specified"}
Research Profile: ${researchProfile || "Not specified"}
Personal Note: ${aboutHint || "Not specified"}

Generate a JSON response with exactly this structure (no markdown, just JSON):
{
  "about": "A compelling 2-3 sentence professional bio that highlights key strengths and experience"
}`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      temperature: 0.7,
      maxTokens: 400,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error("Could not parse AI response")
  } catch (error) {
    console.error("AI generation error:", error)
    return {
      about: `${name} is a talented professional with expertise in ${skills.split(",")[0]?.trim() || "technology"}. Passionate about creating impactful solutions and continuous learning.`,
    }
  }
}

async function generatePortfolioImages(projectName: string, skills: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.pollinations.ai/v1/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Professional portfolio project image for "${projectName}" in the tech field with skills: ${skills}. Modern, clean, suitable for professional portfolio. Tech-focused aesthetic. High quality, professional design.`,
        width: 400,
        height: 250,
        guidance: 7.5,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.images[0] || null
    }
  } catch (error) {
    console.error("Image generation error:", error)
  }
  return null
}

function generateModernGlassTemplate(data: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      line-height: 1.6;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 50px;
      margin-bottom: 30px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    
    .profile-pic {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      margin: 0 auto 25px;
      object-fit: cover;
      border: 5px solid #667eea;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }
    
    h1 {
      color: #333;
      font-size: 3em;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .tagline {
      color: #667eea;
      font-size: 1.4em;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .about {
      color: #666;
      font-size: 1.15em;
      margin-bottom: 25px;
      line-height: 1.9;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .contact-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 25px;
    }
    
    .contact-link {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      text-decoration: none;
      border-radius: 30px;
      transition: all 0.3s ease;
      font-size: 0.95em;
      font-weight: 500;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    .contact-link:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
    }
    
    section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    
    h2 {
      color: #333;
      font-size: 2em;
      margin-bottom: 25px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .skill {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 10px 22px;
      border-radius: 25px;
      font-size: 0.95em;
      font-weight: 600;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
    }
    
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 25px;
    }
    
    .project-card {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 15px;
      padding: 20px;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .project-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }

    .project-image {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 10px;
      margin-bottom: 15px;
    }
    
    .project-card h3 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 1.3em;
    }
    
    .project-card p {
      color: #666;
      font-size: 0.95em;
      line-height: 1.6;
    }
    
    footer {
      text-align: center;
      color: white;
      padding: 20px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${data.profilePic ? `<img src="${data.profilePic}" alt="Profile Picture" class="profile-pic">` : ""}
      <h1>${data.name}</h1>
      ${data.tagline ? `<p class="tagline">${data.tagline}</p>` : ""}
      <p class="about">${data.about}</p>
      <div class="contact-links">
        ${data.email ? `<a href="mailto:${data.email}" class="contact-link">📧 Email</a>` : ""}
        ${data.phone ? `<a href="tel:${data.phone}" class="contact-link">📱 Phone</a>` : ""}
        ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="contact-link">💼 LinkedIn</a>` : ""}
        ${data.github ? `<a href="${data.github}" target="_blank" class="contact-link">🔗 GitHub</a>` : ""}
        ${data.twitter ? `<a href="${data.twitter}" target="_blank" class="contact-link">🐦 Twitter</a>` : ""}
        ${data.website ? `<a href="${data.website}" target="_blank" class="contact-link">🌐 Website</a>` : ""}
      </div>
    </header>
    
    ${
      data.researchProfile
        ? `
      <section>
        <h2>Research Profile</h2>
        <p>${data.researchProfile.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.skills
        ? `
      <section>
        <h2>Skills</h2>
        <div class="skills">
          ${data.skillsHtml}
        </div>
      </section>
    `
        : ""
    }
    
    ${
      data.experience
        ? `
      <section>
        <h2>Experience</h2>
        <p>${data.experience.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.projectsHtml
        ? `
      <section>
        <h2>Projects</h2>
        <div class="projects">
          ${data.projectsHtml}
        </div>
      </section>
    `
        : ""
    }
    
    ${
      data.achievements
        ? `
      <section>
        <h2>Achievements</h2>
        <p>${data.achievements.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.events
        ? `
      <section>
        <h2>Conferences</h2>
        <p>${data.events.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.languages
        ? `
      <section>
        <h2>Languages</h2>
        <p>${data.languages.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    <footer>
      <p>Generated with AI Portfolio Generator</p>
    </footer>
  </div>
</body>
</html>`
}

function generateMinimalDarkTemplate(data: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      line-height: 1.6;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 60px 30px;
    }
    
    header {
      margin-bottom: 60px;
      border-bottom: 1px solid #333;
      padding-bottom: 40px;
    }
    
    .profile-pic {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 25px;
      border: 2px solid #444;
    }
    
    h1 {
      color: #fff;
      font-size: 2.8em;
      margin-bottom: 5px;
      font-weight: 700;
    }
    
    .tagline {
      color: #00d4ff;
      font-size: 1.2em;
      margin-bottom: 20px;
      font-weight: 500;
    }
    
    .about {
      color: #b0b0b0;
      font-size: 1.05em;
      margin-bottom: 20px;
      line-height: 1.8;
    }
    
    .contact-links {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    
    .contact-link {
      color: #00d4ff;
      text-decoration: none;
      border: 1px solid #00d4ff;
      padding: 10px 20px;
      border-radius: 5px;
      transition: all 0.3s ease;
      font-size: 0.9em;
    }
    
    .contact-link:hover {
      background: #00d4ff;
      color: #0a0a0a;
    }
    
    section {
      margin-bottom: 50px;
    }
    
    h2 {
      color: #fff;
      font-size: 1.8em;
      margin-bottom: 25px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 2px solid #00d4ff;
      padding-bottom: 10px;
    }
    
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .skill {
      background: #1a1a1a;
      color: #00d4ff;
      padding: 8px 16px;
      border-radius: 3px;
      font-size: 0.9em;
      border: 1px solid #00d4ff;
    }
    
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .project-card {
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 20px;
      border-radius: 5px;
      transition: all 0.3s ease;
    }
    
    .project-card:hover {
      border-color: #00d4ff;
      background: #222;
    }

    .project-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 3px;
      margin-bottom: 15px;
    }
    
    .project-card h3 {
      color: #00d4ff;
      margin-bottom: 10px;
      font-size: 1.2em;
    }
    
    .project-card p {
      color: #b0b0b0;
      font-size: 0.95em;
    }
    
    footer {
      text-align: center;
      color: #666;
      padding: 20px;
      margin-top: 60px;
      border-top: 1px solid #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${data.profilePic ? `<img src="${data.profilePic}" alt="Profile Picture" class="profile-pic">` : ""}
      <h1>${data.name}</h1>
      ${data.tagline ? `<p class="tagline">${data.tagline}</p>` : ""}
      <p class="about">${data.about}</p>
      <div class="contact-links">
        ${data.email ? `<a href="mailto:${data.email}" class="contact-link">Email</a>` : ""}
        ${data.phone ? `<a href="tel:${data.phone}" class="contact-link">Phone</a>` : ""}
        ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="contact-link">LinkedIn</a>` : ""}
        ${data.github ? `<a href="${data.github}" target="_blank" class="contact-link">GitHub</a>` : ""}
        ${data.twitter ? `<a href="${data.twitter}" target="_blank" class="contact-link">Twitter</a>` : ""}
        ${data.website ? `<a href="${data.website}" target="_blank" class="contact-link">Website</a>` : ""}
      </div>
    </header>
    
    ${
      data.researchProfile
        ? `
      <section>
        <h2>Research Profile</h2>
        <p>${data.researchProfile.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.skills
        ? `
      <section>
        <h2>Skills</h2>
        <div class="skills">
          ${data.skillsHtml}
        </div>
      </section>
    `
        : ""
    }
    
    ${
      data.experience
        ? `
      <section>
        <h2>Experience</h2>
        <p>${data.experience.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.projectsHtml
        ? `
      <section>
        <h2>Projects</h2>
        <div class="projects">
          ${data.projectsHtml}
        </div>
      </section>
    `
        : ""
    }
    
    ${
      data.achievements
        ? `
      <section>
        <h2>Achievements</h2>
        <p>${data.achievements.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.events
        ? `
      <section>
        <h2>Conferences</h2>
        <p>${data.events.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.languages
        ? `
      <section>
        <h2>Languages</h2>
        <p>${data.languages.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    <footer>
      <p>Generated with AI Portfolio Generator</p>
    </footer>
  </div>
</body>
</html>`
}

function generateCreativeGradientTemplate(data: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: #333;
      line-height: 1.6;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    header {
      background: white;
      border-radius: 25px;
      padding: 50px;
      margin-bottom: 40px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
      text-align: center;
    }
    
    .profile-pic {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      margin: 0 auto 25px;
      object-fit: cover;
      border: 6px solid;
      border-image: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) 1;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    }
    
    h1 {
      color: #333;
      font-size: 3.2em;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
    }
    
    .tagline {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 1.5em;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .about {
      color: #555;
      font-size: 1.1em;
      margin-bottom: 25px;
      line-height: 1.9;
    }
    
    .contact-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 25px;
    }
    
    .contact-link {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      transition: all 0.3s ease;
      font-size: 0.95em;
      font-weight: 600;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .contact-link:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(102, 126, 234, 0.5);
    }
    
    section {
      background: white;
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      color: #333;
      font-size: 2.2em;
      margin-bottom: 25px;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
    
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .skill {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 10px 22px;
      border-radius: 25px;
      font-size: 0.95em;
      font-weight: 600;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.25);
    }
    
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
    }
    
    .project-card {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(240, 147, 251, 0.08));
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 18px;
      padding: 22px;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .project-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 50px rgba(102, 126, 234, 0.2);
      border-color: #764ba2;
    }

    .project-image {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 15px;
    }
    
    .project-card h3 {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
      font-size: 1.3em;
      font-weight: 700;
    }
    
    .project-card p {
      color: #666;
      font-size: 0.95em;
      line-height: 1.6;
    }
    
    footer {
      text-align: center;
      color: white;
      padding: 20px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${data.profilePic ? `<img src="${data.profilePic}" alt="Profile Picture" class="profile-pic">` : ""}
      <h1>${data.name}</h1>
      ${data.tagline ? `<p class="tagline">${data.tagline}</p>` : ""}
      <p class="about">${data.about}</p>
      <div class="contact-links">
        ${data.email ? `<a href="mailto:${data.email}" class="contact-link">📧 Email</a>` : ""}
        ${data.phone ? `<a href="tel:${data.phone}" class="contact-link">📱 Phone</a>` : ""}
        ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="contact-link">💼 LinkedIn</a>` : ""}
        ${data.github ? `<a href="${data.github}" target="_blank" class="contact-link">🔗 GitHub</a>` : ""}
        ${data.twitter ? `<a href="${data.twitter}" target="_blank" class="contact-link">🐦 Twitter</a>` : ""}
        ${data.website ? `<a href="${data.website}" target="_blank" class="contact-link">🌐 Website</a>` : ""}
      </div>
    </header>
    
    ${
      data.researchProfile
        ? `
      <section>
        <h2>Research Profile</h2>
        <p>${data.researchProfile.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.skills
        ? `
      <section>
        <h2>Skills</h2>
        <div class="skills">
          ${data.skillsHtml}
        </div>
      </section>
    `
        : ""
    }
    
    ${
      data.experience
        ? `
      <section>
        <h2>Experience</h2>
        <p>${data.experience.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.projectsHtml
        ? `
      <section>
        <h2>Projects</h2>
        <div class="projects">
          ${data.projectsHtml}
        </div>
      </section>
    `
        : ""
    }
    
    ${
      data.achievements
        ? `
      <section>
        <h2>Achievements & Awards</h2>
        <p>${data.achievements.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.events
        ? `
      <section>
        <h2>Conferences & Trainings</h2>
        <p>${data.events.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    ${
      data.languages
        ? `
      <section>
        <h2>Languages</h2>
        <p>${data.languages.replace(/\n/g, "<br>")}</p>
      </section>
    `
        : ""
    }
    
    <footer>
      <p>Generated with AI Portfolio Generator</p>
    </footer>
  </div>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()

    if (!body.name || !body.email || !body.skills) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate AI content if enabled
    let aiContent = null
    if (body.useAI) {
      aiContent = await generateAIContent(
        body.name,
        body.skills,
        body.projects,
        body.aboutHint,
        body.experience,
        body.researchProfile || "",
      )
    }

    // Prepare portfolio data
    const skillsArray = body.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)
    const skillsHtml = skillsArray.map((s) => `<span class="skill">${s}</span>`).join("")

    let projectsHtml = ""
    let projectsHtmlForResume = ""

    for (const project of body.projects) {
      if (project.name) {
        const desc = project.description || "Professional project"
        let imageHtml = ""

        if (project.image) {
          imageHtml = `<img src="${project.image}" alt="${project.name}" class="project-image">`
        } else if (body.useAI) {
          const aiImage = await generatePortfolioImages(project.name, body.skills)
          if (aiImage) {
            imageHtml = `<img src="${aiImage}" alt="${project.name}" class="project-image">`
          }
        }

        // Portfolio version with images
        projectsHtml += `
          <div class="project-card">
            ${imageHtml}
            <h3>${project.name}</h3>
            <p>${desc}</p>
          </div>
        `

        // Resume version without images
        projectsHtmlForResume += `
          <div class="entry">
            <div class="entry-title">${project.name}</div>
            <p>${desc}</p>
          </div>
        `
      }
    }

    const portfolioData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      linkedin: body.linkedin,
      github: body.github,
      twitter: body.twitter,
      website: body.website,
      tagline: body.tagline,
      about:
        aiContent?.about ||
        body.aboutHint ||
        `${body.name} is a passionate professional with expertise in ${skillsArray[0] || "technology"}.`,
      profilePic: body.profilePic,
      skills: body.skills,
      skillsHtml,
      experience: body.experience,
      projectsHtml,
      researchProfile: body.researchProfile,
      achievements: body.achievements,
      events: body.events,
      languages: body.languages,
      template: body.template,
    }

    let portfolioHtml
    switch (body.template) {
      case "Minimal Dark":
        portfolioHtml = generateMinimalDarkTemplate(portfolioData)
        break
      case "Creative Gradient":
        portfolioHtml = generateCreativeGradientTemplate(portfolioData)
        break
      case "Modern Glass":
      default:
        portfolioHtml = generateModernGlassTemplate(portfolioData)
    }

    const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${body.name} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      color: #333;
      line-height: 1.5;
      padding: 40px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    
    h1 {
      font-size: 2em;
      margin-bottom: 5px;
    }
    
    .contact-info {
      font-size: 0.9em;
      color: #666;
    }
    
    section {
      margin-bottom: 25px;
    }
    
    h2 {
      font-size: 1.3em;
      color: #333;
      border-bottom: 2px solid #667eea;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    
    .entry {
      margin-bottom: 15px;
    }
    
    .entry-title {
      font-weight: bold;
      color: #333;
    }
    
    .entry-subtitle {
      color: #666;
      font-style: italic;
    }
    
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .skill-tag {
      background: #f0f0f0;
      padding: 5px 15px;
      border-radius: 15px;
      font-size: 0.9em;
    }
    
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${body.name}</h1>
    <p class="contact-info">${body.tagline ? body.tagline + " | " : ""}${body.email}${body.phone ? " | " + body.phone : ""}</p>
  </div>
  
  ${
    portfolioData.about
      ? `
    <section>
      <h2>Professional Summary</h2>
      <p>${portfolioData.about}</p>
    </section>
  `
      : ""
  }
  
  ${
    body.researchProfile
      ? `
    <section>
      <h2>Research Profile</h2>
      <p>${body.researchProfile.replace(/\n/g, "<br>")}</p>
    </section>
  `
      : ""
  }
  
  ${
    body.skills
      ? `
    <section>
      <h2>Skills</h2>
      <div class="skills">
        ${skillsHtml}
      </div>
    </section>
  `
      : ""
  }
  
  ${
    body.experience
      ? `
    <section>
      <h2>Experience</h2>
      <p>${body.experience.replace(/\n/g, "<br>")}</p>
    </section>
  `
      : ""
  }
  
  ${
    body.achievements
      ? `
    <section>
      <h2>Achievements & Awards</h2>
      <p>${body.achievements.replace(/\n/g, "<br>")}</p>
    </section>
  `
      : ""
  }

  ${
    body.events
      ? `
    <section>
      <h2>Conferences & Trainings</h2>
      <p>${body.events.replace(/\n/g, "<br>")}</p>
    </section>
  `
      : ""
  }

  ${
    body.languages
      ? `
    <section>
      <h2>Languages</h2>
      <p>${body.languages.replace(/\n/g, "<br>")}</p>
    </section>
  `
      : ""
  }
  
  ${
    projectsHtmlForResume
      ? `
    <section>
      <h2>Projects</h2>
      ${projectsHtmlForResume}
    </section>
  `
      : ""
  }
</body>
</html>`

    return NextResponse.json({
      success: true,
      portfolioHtml,
      resumeHtml,
    })
  } catch (error) {
    console.error("Portfolio generation error:", error)
    return NextResponse.json({ error: "Failed to generate portfolio" }, { status: 500 })
  }
}
