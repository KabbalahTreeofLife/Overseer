import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <AnimatedBackground />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex justify-center">
          <Logo className="h-48 w-auto" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">Overseer</h1>
          <p className="text-xl text-muted-foreground">
            Search 250M+ research papers
          </p>
        </div>

        <SearchBar />

        <div className="grid grid-cols-3 gap-8 pt-12 text-center">
          <div>
            <div className="text-3xl font-bold">250M+</div>
            <div className="text-sm text-muted-foreground">Papers</div>
          </div>
          <div>
            <div className="text-3xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Data Sources</div>
          </div>
          <div>
            <div className="text-3xl font-bold">Free</div>
            <div className="text-sm text-muted-foreground">Open Access</div>
          </div>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          Powered by OpenAlex, Semantic Scholar &amp; arXiv
        </div>
      </div>
    </div>
  );
}
