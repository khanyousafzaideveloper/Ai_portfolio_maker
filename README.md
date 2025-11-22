# AI Portfolio Generator

A modern web application that generates professional portfolios with AI-powered content and images. Built with Next.js, TypeScript, Tailwind CSS, Groq AI, and Google Gemini.

## Features

- **Profile Picture Upload** - Add and manage your professional profile picture
- **AI Content Generation** - Powered by Groq's advanced models for professional bios and descriptions
- **AI Image Generation** - Automatically generates unique portfolio images for projects using Google Gemini
- **Multiple Templates** - Choose from modern, minimal, or creative portfolio designs
- **Project Showcase** - Add multiple projects with descriptions and screenshots
- **Full-Screen Preview** - Preview your portfolio in embedded or full-screen mode
- **Easy Downloads** - Export portfolio as HTML and resume as printable HTML (print to PDF)
- **GitHub Integration** - Automatically upload your portfolio files to your GitHub repository
- **Fast & Free** - Powered by Groq's fast API with no rate limits

## Getting Started

### Prerequisites

- Node.js 18+ 
- Groq API Key

### Installation

1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd portfolio-generator
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Add your Groq API key to environment variables:
\`\`\`bash
echo "GROQ_API_KEY=your-api-key-here" > .env.local
\`\`\`

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Fill Your Information** - Enter your name, email, skills, and experience
2. **Upload Profile Picture** - Add a professional photo
3. **Add Projects** - List your projects with descriptions and optional screenshots
4. **Enable AI Enhancement** - AI will generate professional descriptions and create unique images
5. **Optional: GitHub Setup** - Add your GitHub credentials to auto-upload files
   - Create a Personal Access Token at [github.com/settings/tokens](https://github.com/settings/tokens)
   - Select 'repo' scope for file access
6. **Generate & Upload** - Click "Generate & Upload Portfolio"
7. **Preview & Download** - Use embedded preview, full-screen preview, or download files

## Download & Export

### Portfolio File
- **File**: `portfolio.html`
- **Type**: Self-contained interactive website
- **Usage**: Open in any browser or share directly

### Resume File
- **File**: `resume.pdf.html`
- **Type**: Print-friendly HTML
- **How to Print as PDF**: Press Ctrl+P (or Cmd+P on Mac) → Select "Save as PDF"

## GitHub Integration

Automatically push your portfolio to GitHub:

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Select "repo" scope
4. Copy and paste the token in the Portfolio Generator
5. Enter your GitHub username and repository name
6. Portfolio files will be automatically uploaded to `portfolio/` folder

## Deployment

### Deploy Generated Portfolio to Vercel

\`\`\`bash
vercel deploy
\`\`\`

### Host Downloaded HTML Anywhere

- Upload to any web hosting service
- Share the file directly
- Host on GitHub Pages

## Environment Variables

Required:
- `GROQ_API_KEY` - Your Groq API key for content generation

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Groq AI** - Content generation with llama-3.3-70b-versatile
- **Google Gemini** - AI image generation
- **AI SDK** - Unified AI integration
- **GitHub API** - Automated file uploads

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
# Ai_portfolio_maker
