import { NextRequest, NextResponse } from "next/server";
import { getPaper } from "@/lib/openalex";
import { getPaperSummary, getCitationGraph } from "@/lib/semanticscholar";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const paper = await getPaper(id);

    const [summary, citationGraph] = await Promise.all([
      paper.doi ? getPaperSummary(paper.doi) : null,
      paper.doi ? getCitationGraph(paper.doi) : null,
    ]);

    return NextResponse.json({
      ...paper,
      tldr: summary?.tldr,
      citationGraph,
    });
  } catch (error) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }
}
