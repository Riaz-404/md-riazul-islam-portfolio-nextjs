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
    <div className="flex gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200">
      <PublicationIcon type={pub.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <h3 className="font-semibold text-sm leading-snug flex-1">
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
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          {pub.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50"
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

  if (publications.length === 0) return null;

  return (
    <section className="section-padding bg-muted/20" id="publications">
      <div className="container-custom content-constrained">
        {/* Section Header */}
        <div className="space-y-3 max-w-xl mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.15em]">
            Research
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Publications
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg">
            Research papers, articles, and academic publications.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl">
          {publications.map((pub) => (
            <PublicationCard key={pub._id} pub={pub} />
          ))}
        </div>
      </div>
    </section>
  );
}
