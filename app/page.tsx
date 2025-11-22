import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
              ✨
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PortfolioAI
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
          </nav>
          <Link href="/generator">
            <Button className="bg-primary hover:bg-primary/90 transition-colors">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto animate-slide-up space-y-6">
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/50 text-primary text-sm font-medium">
              ✨ AI-Powered Portfolio Builder
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight">
            Create Beautiful Portfolios with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Magic</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed text-balance">
            Generate stunning portfolio websites in seconds. Upload your profile picture, let AI enhance your content
            and generate beautiful images, then download your professional portfolio.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/generator">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 transition-all duration-200 hover:shadow-lg hover:shadow-primary/50"
              >
                Create Portfolio Now →
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-border/50 hover:bg-muted/30 text-lg px-8 transition-colors bg-transparent"
              >
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/5 border-y border-border/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-foreground mb-16 text-balance">Powerful Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📸",
                title: "Profile Upload",
                desc: "Add professional profile pictures displayed prominently",
              },
              {
                icon: "✨",
                title: "AI Content",
                desc: "Auto-generate professional about sections and descriptions",
              },
              {
                icon: "🖼️",
                title: "AI Images",
                desc: "Automatically generate beautiful images for your projects",
              },
              {
                icon: "🎨",
                title: "Templates",
                desc: "Choose from modern, minimal, or creative designs",
              },
              {
                icon: "💾",
                title: "Download",
                desc: "Export as HTML or print resume as PDF instantly",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Powered by Groq AI for instant generation",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-card/50 border border-border/50 rounded-lg hover:border-border/80 hover:bg-card/70 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-foreground mb-16 text-balance">How It Works</h3>
          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              { step: 1, title: "Fill Your Info", desc: "Add your name, email, skills, and experience" },
              { step: 2, title: "Upload Profile", desc: "Add a professional profile picture" },
              { step: 3, title: "Add Projects", desc: "List your projects - AI generates descriptions & images" },
              { step: 4, title: "Choose Template", desc: "Select from beautiful portfolio templates" },
              { step: 5, title: "Generate", desc: "Click generate and let AI work its magic" },
              { step: 6, title: "Download", desc: "Export as HTML or resume PDF" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-4xl font-bold text-foreground text-balance">Ready to Create Your Portfolio?</h3>
          <p className="text-lg text-muted-foreground text-balance">
            Start now and have your professional portfolio ready in minutes with AI magic.
          </p>
          <Link href="/generator">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 transition-all duration-200 hover:shadow-lg hover:shadow-primary/50"
            >
              Create Portfolio Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                ✨
              </div>
              <p className="text-muted-foreground text-sm">PortfolioAI © 2025</p>
            </div>
            <p className="text-muted-foreground text-sm">Built with Next.js, Groq AI, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
