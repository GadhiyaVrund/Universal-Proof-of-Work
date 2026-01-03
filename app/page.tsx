import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Shield, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-foreground">
            UPoW
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold text-balance leading-tight text-foreground">Universal Proof of Work</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {
              "Create verifiable proof of real work. Build your professional identity with validated contributions instead of traditional resumes."
            }
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg">Create Your Profile</Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-4 px-12 md:px-24">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Verified Work</h3>
            <p className="text-muted-foreground leading-relaxed">
              {"Every work entry can be validated by peers, creating a trustworthy record of your contributions."}
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Proof, Not Claims</h3>
            <p className="text-muted-foreground leading-relaxed">
              {"Link directly to your work with repositories, demos, documents, and images as concrete evidence."}
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Public Profile</h3>
            <p className="text-muted-foreground leading-relaxed">
              {"Share your professional identity with a clean, shareable profile showcasing all your verified work."}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">Create Your Profile</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {"Sign up and set up your professional profile with your name, role, and bio."}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">Add Work Entries</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    "Document your projects, tasks, and contributions with descriptions and proof links to repos, demos, or documents."
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">Get Validated</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {"Other users can validate your work entries, adding credibility to your professional record."}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">Share Your Profile</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {"Share your public profile link anywhere to showcase your verified work history."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to showcase your work?</h2>
          <p className="text-lg text-muted-foreground">
            {"Join professionals who are building verifiable proof of their contributions."}
          </p>
          <Link href="/signup">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 Universal Proof of Work. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
