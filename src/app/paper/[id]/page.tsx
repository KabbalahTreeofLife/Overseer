"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CitationGraph } from "@/components/CitationGraph";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExternalLink, BookOpen, ArrowLeft } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PaperPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: paper, isLoading } = useSWR(`/api/papers/${id}`, fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!paper || paper.error) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Paper not found</h1>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to results
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to results
        </Button>
        <ThemeToggle />
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">{paper.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge>{paper.year}</Badge>
          <Badge variant="outline">
            {paper.citationCount.toLocaleString()} citations
          </Badge>
          {paper.openAccess && (
            <Badge className="bg-green-600 hover:bg-green-700">
              Open Access
            </Badge>
          )}
          {paper.venue && <Badge variant="outline">{paper.venue}</Badge>}
        </div>
        <p className="text-muted-foreground">
          {paper.authors
            .map(
              (a: any) =>
                `${a.name}${a.affiliation ? ` (${a.affiliation})` : ""}`,
            )
            .join(" · ")}
        </p>
      </div>

      {paper.tldr && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide">
            AI Summary
          </h3>
          <p className="text-sm leading-relaxed">{paper.tldr}</p>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Abstract</h2>
        <p className="text-muted-foreground leading-relaxed">{paper.abstract}</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        {paper.pdfUrl && (
          <Button asChild>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="mr-2 h-4 w-4" /> View PDF
            </a>
          </Button>
        )}
        {paper.doi && (
          <Button variant="outline" asChild>
            <a
              href={paper.doi}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" /> DOI
            </a>
          </Button>
        )}
      </div>

      <Separator />

      {paper.citationGraph &&
        paper.citationGraph.nodes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Citation Graph</h2>
            <p className="text-sm text-muted-foreground">
              {paper.citationGraph.nodes.length} related papers &middot;{" "}
              {paper.citationGraph.edges.length} citation links
            </p>
            <CitationGraph
              nodes={paper.citationGraph.nodes}
              edges={paper.citationGraph.edges}
            />
          </div>
        )}
    </div>
  );
}
