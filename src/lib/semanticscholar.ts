const BASE_URL = "https://api.semanticscholar.org/graph/v1";

export async function getPaperSummary(paperId: string) {
  const res = await fetch(
    `${BASE_URL}/paper/DOI:${paperId}?fields=tldr,citationCount,influentialCitationCount`,
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    tldr: data.tldr?.text,
    influentialCitations: data.influentialCitationCount,
  };
}

export async function getCitationGraph(paperId: string) {
  const res = await fetch(
    `${BASE_URL}/paper/DOI:${paperId}?fields=citations,references,citations.title,citations.year,citations.citationCount,references.title,references.year,references.citationCount`,
  );
  if (!res.ok) return { nodes: [], edges: [] };
  const data = await res.json();

  const nodes = [
    {
      id: paperId,
      title: data.title,
      year: data.year,
      citationCount: data.citationCount,
    },
    ...data.citations.map((c: any) => ({
      id: c.paperId,
      title: c.title,
      year: c.year,
      citationCount: c.citationCount,
    })),
    ...data.references.map((r: any) => ({
      id: r.paperId,
      title: r.title,
      year: r.year,
      citationCount: r.citationCount,
    })),
  ];

  const edges = [
    ...data.citations.map((c: any) => ({ source: c.paperId, target: paperId })),
    ...data.references.map((r: any) => ({
      source: paperId,
      target: r.paperId,
    })),
  ];

  return { nodes, edges };
}
