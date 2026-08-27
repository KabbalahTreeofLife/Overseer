const BASE_URL = "https://api.openalex.org";

const EMAILS = (process.env.OPENALEX_EMAILS || "overseer@example.com").split(",");

let emailIndex = 0;

function getEmail(): string {
  const email = EMAILS[emailIndex % EMAILS.length];
  return email;
}

function rotateEmail(): string {
  emailIndex = (emailIndex + 1) % EMAILS.length;
  return getEmail();
}

interface OpenAlexWork {
  id: string;
  title: string;
  abstract_inverted_index: Record<string, string | number[]> | null;
  authorships: {
    author: { id: string | null; display_name: string };
    institutions: { display_name: string }[];
  }[];
  publication_year: number;
  cited_by_count: number;
  open_access: { is_oa: boolean };
  primary_location?: { pdf_url?: string; source?: { display_name?: string } };
  doi?: string;
}

function reconstructAbstract(
  invertedIndex: Record<string, string | number[]> | null,
): string {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";
  const wordPositions: [string, number][] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    if (positions == null) continue;
    const posArray =
      typeof positions === "string"
        ? positions
            .split(" ")
            .map(Number)
            .filter((n) => !Number.isNaN(n))
        : Array.isArray(positions)
          ? positions
          : [];
    for (const pos of posArray) {
      wordPositions.push([word, pos]);
    }
  }
  return wordPositions
    .sort((a, b) => a[1] - b[1])
    .map(([word]) => word)
    .join(" ");
}

function extractId(url: string | null | undefined): string {
  if (!url) return "";
  return url.split("/").pop() || "";
}

async function fetchWithRetry(
  url: string,
  retries = EMAILS.length,
): Promise<Response> {
  const res = await fetch(url);
  if (res.status === 429 && retries > 0) {
    const nextEmail = rotateEmail();
    console.log(`OpenAlex budget exhausted, rotating to: ${nextEmail}`);
    const newUrl = url.replace(/mailto=[^&]+/, `mailto=${nextEmail}`);
    return fetchWithRetry(newUrl, retries - 1);
  }
  return res;
}

export async function searchPapers(
  query: string,
  page = 1,
  perPage = 20,
  filters?: {
    year?: number;
    openAccess?: boolean;
    sort?: string;
  },
) {
  const params = new URLSearchParams({
    search: query,
    page: page.toString(),
    per_page: perPage.toString(),
    mailto: getEmail(),
  });

  if (filters?.sort) params.set("sort", filters.sort);

  const filterParts: string[] = [];
  if (filters?.year) filterParts.push(`publication_year:${filters.year}`);
  if (filters?.openAccess) filterParts.push("open_access.is_oa:true");
  if (filterParts.length) params.set("filter", filterParts.join(","));

  const url = `${BASE_URL}/works?${params}`;
  const res = await fetchWithRetry(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAlex search failed (${res.status}): ${body}`);
  }
  const data = await res.json();

  return {
    papers: data.results.map((w: OpenAlexWork) => ({
      id: extractId(w.id),
      title: w.title || "",
      abstract: reconstructAbstract(w.abstract_inverted_index),
      authors: (w.authorships || []).map((a) => ({
        id: extractId(a.author?.id),
        name: a.author?.display_name || "Unknown",
        affiliation: a.institutions?.[0]?.display_name,
      })),
      year: w.publication_year,
      citationCount: w.cited_by_count,
      openAccess: w.open_access?.is_oa || false,
      pdfUrl: w.primary_location?.pdf_url,
      doi: w.doi,
      venue: w.primary_location?.source?.display_name,
    })),
    totalCount: data.meta.count,
    page,
    pageSize: perPage,
  };
}

export async function getPaper(id: string) {
  const url = `${BASE_URL}/works/${id}?mailto=${getEmail()}`;
  const res = await fetchWithRetry(url);
  if (!res.ok) throw new Error("OpenAlex paper fetch failed");
  const w: OpenAlexWork = await res.json();
  return {
    id: extractId(w.id),
    title: w.title || "",
    abstract: reconstructAbstract(w.abstract_inverted_index),
    authors: (w.authorships || []).map((a) => ({
      id: extractId(a.author?.id),
      name: a.author?.display_name || "Unknown",
      affiliation: a.institutions?.[0]?.display_name,
    })),
    year: w.publication_year,
    citationCount: w.cited_by_count,
    openAccess: w.open_access?.is_oa || false,
    pdfUrl: w.primary_location?.pdf_url,
    doi: w.doi,
    venue: w.primary_location?.source?.display_name,
  };
}
