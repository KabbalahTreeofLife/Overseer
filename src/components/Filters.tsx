"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Filters</h3>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Sort by</label>
        <Select
          onValueChange={(v) => updateFilter("sort", v === "relevance" ? "" : v)}
          defaultValue={searchParams.get("sort") || "relevance"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="cited_by_count:desc">Most Cited</SelectItem>
            <SelectItem value="publication_date:desc">Newest</SelectItem>
            <SelectItem value="publication_date:asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Year</label>
        <Select
          onValueChange={(v) => updateFilter("year", v === "all" ? "" : v)}
          defaultValue={searchParams.get("year") || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any year</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2020">2020+</SelectItem>
            <SelectItem value="2015">2015+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="oa"
          checked={searchParams.get("oa") === "true"}
          onCheckedChange={(c) => updateFilter("oa", c ? "true" : "")}
        />
        <label htmlFor="oa" className="text-sm cursor-pointer">
          Open Access Only
        </label>
      </div>
    </div>
  );
}
