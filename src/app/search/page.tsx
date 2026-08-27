"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PaperCard } from "@/components/PaperCard";
import { Filters } from "@/components/Filters";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
};

const SWR_CONFIG = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 0,
};

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "";
  const year = searchParams.get("year") || "";
  const oa = searchParams.get("oa") || "";

  const swrKey = q
    ? `/api/search?q=${encodeURIComponent(q)}&page=${page}&sort=${sort}&year=${year}&oa=${oa}`
    : null;

  const { data, isLoading, error } = useSWR(swrKey, fetcher, SWR_CONFIG);

  const totalPages = data ? Math.ceil(data.totalCount / 20) : 0;
  const currentPage = parseInt(page);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <h1 className="text-2xl font-bold">Overseer</h1>
          </Link>
          <ThemeToggle />
        </div>
        <SearchBar defaultValue={q} />

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <Filters />
          </aside>

          <main className="flex-1 space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-48" />
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
              </>
            ) : error?.status === 429 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-lg font-medium">Rate limit exceeded</p>
                <p className="text-sm text-muted-foreground">
                  All search quotas are exhausted. Please try again later.
                </p>
              </div>
            ) : data?.papers?.length ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {data.totalCount.toLocaleString()} results for &quot;{q}&quot;
                </p>
                {data.papers.map((paper: any) => (
                  <PaperCard key={paper.id} paper={paper} />
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Button
                      variant="outline"
                      disabled={currentPage <= 1}
                      asChild={currentPage > 1}
                    >
                      {currentPage > 1 ? (
                        <Link
                          href={`/search?q=${encodeURIComponent(q)}&page=${currentPage - 1}&sort=${sort}&year=${year}&oa=${oa}`}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Link>
                      ) : (
                        <span>
                          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </span>
                      )}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages.toLocaleString()}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage >= totalPages}
                      asChild={currentPage < totalPages}
                    >
                      {currentPage < totalPages ? (
                        <Link
                          href={`/search?q=${encodeURIComponent(q)}&page=${currentPage + 1}&sort=${sort}&year=${year}&oa=${oa}`}
                        >
                          Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      ) : (
                        <span>
                          Next <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : q ? (
              <p className="text-muted-foreground">No results found.</p>
            ) : (
              <p className="text-muted-foreground">
                Enter a query to search research papers.
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-12 w-full max-w-2xl" />
            <div className="flex gap-8">
              <Skeleton className="h-64 w-64" />
              <div className="flex-1 space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
