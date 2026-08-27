export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  year: number;
  citationCount: number;
  openAccess: boolean;
  pdfUrl?: string;
  doi?: string;
  venue?: string;
  tldr?: string;
}

export interface Author {
  id: string;
  name: string;
  affiliation?: string;
  hIndex?: number;
  citationCount?: number;
}

export interface SearchResult {
  papers: Paper[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CitationNode {
  id: string;
  title: string;
  year: number;
  citationCount: number;
}

export interface CitationEdge {
  source: string;
  target: string;
}
