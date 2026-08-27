const BASE_URL = "http://export.arxiv.org/api/query";

export async function searchArxiv(query: string, maxResults = 10) {
  const params = new URLSearchParams({
    search_query: `all:${query}`,
    sortBy: "submittedDate",
    sortOrder: "descending",
    max_results: maxResults.toString(),
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  const text = await res.text();
  
  // Parse XML (use a lightweight parser or regex)
  const papers = [];
  const entries = text.split("<entry>").slice(1);
  
  for (const entry of entries) {
    const id = entry.match(/<id>(.*?)<\/id>/)?.[1]?.split("/abs/")[1];
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim();
    
    if (id && title) {
      papers.push({ id, title, abstract: summary });
    }
  }
  
  return papers;
}
