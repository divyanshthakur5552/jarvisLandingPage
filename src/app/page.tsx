import NavbarDemo from "@/components/resizable-navbar-demo";
import { Hero } from "@/components/ui/hero-1";
import { AboutSection } from "@/components/about-section";
import { CollaborationSection } from "@/components/collaboration-section";
import { FooterSection } from "@/components/footer-section";
import { Highlighter } from "@/components/ui/highlighter";
import { JarvisMultiPlaneExecution } from "@/components/JarvisMultiPlaneExecution";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <NavbarDemo />
      <Hero
        title={
          <>
            Your{" "}
            <Highlighter action="highlight" color="#404040" isView>
              AI Computer
            </Highlighter>{" "}
            <Highlighter action="underline" color="#18181b" isView>
              Automation Assistant
            </Highlighter>
          </>
        }
        subtitle="Control your computer with natural language. Just say what you want, and JARVIS handles the clicks, keystrokes, and navigation for you."
        eyebrow="AI-Powered Automation"
        ctaLabel="Download"
        ctaHref="/download"
      />
      <AboutSection />
      
      {/* How It Works Section */}
      <section className="py-24 bg-black relative z-10 w-full overflow-hidden flex flex-col items-center">
        <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
            Experience the multi-plane execution graph powering Jarvis. 
            Watch how user commands are orchestrated through sub-agents and executed in real-time.
          </p>
        </div>
        <div className="w-full max-w-[1400px] mx-auto border border-border rounded-xl overflow-hidden shadow-2xl bg-black h-[800px]">
          <JarvisMultiPlaneExecution className="rounded-xl !bg-black" />
        </div>
      </section>

      <CollaborationSection />
      <FooterSection />
    </main>
  );
}
