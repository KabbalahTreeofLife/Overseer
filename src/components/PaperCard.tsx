import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Paper } from "@/lib/types";

export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <Link href={`/paper/${paper.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
          <CardDescription>
            {paper.authors
              .slice(0, 5)
              .map((a) => a.name)
              .join(", ")}
            {paper.authors.length > 5 && ` +${paper.authors.length - 5} more`}
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-4 flex gap-2 flex-wrap">
          <Badge variant="secondary">{paper.year}</Badge>
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
      </Card>
    </Link>
  );
}
