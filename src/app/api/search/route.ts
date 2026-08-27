import { NextRequest, NextResponse } from "next/server";
import { searchPapers } from "@/lib/openalex";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const year = searchParams.get("year")
    ? parseInt(searchParams.get("year")!)
    : undefined;
  const openAccess = searchParams.get("oa") === "true";
  const sort = searchParams.get("sort") || undefined;

  if (!q) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  try {
    const result = await searchPapers(q, page, 20, {
      year,
      openAccess,
      sort,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Search API error:", error);
    const is429 = String(error).includes("429");
    return NextResponse.json(
      { error: "Search failed", details: String(error) },
      { status: is429 ? 429 : 500 },
    );
  }
}
