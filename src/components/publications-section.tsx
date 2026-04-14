import { ExternalLink, BookOpen, FileText, GraduationCap, Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PublicationService } from "@/lib/publication-service";
import { PublicationData, publicationTypes } from "@/types/publication";

function PublicationIcon({ type }: { type: string }) {
  switch (type) {
    case "journal":
      return <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />;
    case "conference":
      return <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />;
    case "book":
      return <Book className="h-4 w-4 text-primary shrink-0 mt-0.5" />;
    case "thesis":
      return <GraduationCap className="h-4 w-4 text-primary shrink-0 mt-0.5" />;
    default:
      return <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />;
  }
}

function PublicationCard({ pub }: { pub: PublicationData }) {
  const typeLabel =
    publicationTypes.find((t) => t.value === pub.type)?.label ?? pub.type;

  return (
    <div className="flex gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow duration-200">
      <PublicationIcon type={pub.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-medium text-sm leading-snug flex-1">
            {pub.url ? (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors hover:underline"
              >
                {pub.title}
              </a>
            ) : (
              pub.title
            )}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="outline" className="text-xs">
              {typeLabel}
            </Badge>
            <Badge variant="secondary" className="text-xs font-semibold">
              {pub.year}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {pub.authors.join(", ")}
        </p>
        {pub.venue && (
          <p className="text-xs text-muted-foreground italic mt-0.5">
            {pub.venue}
          </p>
        )}
        {pub.abstract && (
          <details className="mt-2">
            <summary className="text-xs text-primary cursor-pointer hover:underline select-none">
              Abstract
            </summary>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {pub.abstract}
            </p>
          </details>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {pub.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {pub.url && (
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1 ml-auto"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export async function PublicationsSection() {
  const pubService = new PublicationService();

  let publications: PublicationData[] = [];
  try {
    publications = await pubService.getPublications();
  } catch {
    return null;
  }

  // Hide section entirely when no publications
  if (publications.length === 0) return null;

  return (
    <section
      className="section-padding bg-background text-foreground"
      id="publications"
    >
      <div className="container-custom content-constrained">
        <div className="text-center mb-10">
          <span className="text-sm text-muted-foreground uppercase tracking-widest">
            Research
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Publications
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Research papers, articles, and academic publications.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {publications.map((pub) => (
            <PublicationCard key={pub._id} pub={pub} />
          ))}
        </div>
      </div>
    </section>
  );
}
