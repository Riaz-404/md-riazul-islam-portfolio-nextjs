import {
  ExternalLink,
  BookOpen,
  FileText,
  GraduationCap,
  Book,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PublicationService } from "@/lib/publication-service";
import { PublicationData, publicationTypes } from "@/types/publication";
import { MotionDiv } from "@/components/motion/motion-html-element";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function PublicationIcon({ type }: { type: string }) {
  const cls = "h-4 w-4 text-primary shrink-0 mt-0.5";
  switch (type) {
    case "journal":
      return <BookOpen className={cls} />;
    case "conference":
      return <FileText className={cls} />;
    case "book":
      return <Book className={cls} />;
    case "thesis":
      return <GraduationCap className={cls} />;
    default:
      return <FileText className={cls} />;
  }
}

function PublicationCard({ pub, index }: { pub: PublicationData; index: number }) {
  const typeLabel =
    publicationTypes.find((t) => t.value === pub.type)?.label ?? pub.type;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.07, ease }}
      className="flex gap-4 p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/30 transition-all duration-200 group"
    >
      <div className="mt-0.5 shrink-0">
        <PublicationIcon type={pub.type} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Title + badges */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="font-semibold text-sm leading-snug flex-1 text-foreground group-hover:text-primary transition-colors">
            {pub.url ? (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-2"
              >
                {pub.title}
              </a>
            ) : (
              pub.title
            )}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge
              variant="outline"
              className="text-[10px] font-semibold px-2 py-0.5"
            >
              {typeLabel}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] font-bold px-2 py-0.5"
            >
              {pub.year}
            </Badge>
          </div>
        </div>

        {/* Authors */}
        <p className="text-xs text-muted-foreground">
          {pub.authors.join(", ")}
        </p>

        {/* Venue */}
        {pub.venue && (
          <p className="text-xs text-muted-foreground/70 italic">{pub.venue}</p>
        )}

        {/* Abstract */}
        {pub.abstract && (
          <details className="mt-2 group/details">
            <summary className="text-xs font-medium text-primary cursor-pointer hover:underline select-none list-none flex items-center gap-1">
              <span className="transition-transform group-open/details:rotate-90">›</span>
              Abstract
            </summary>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed pl-3 border-l border-primary/30">
              {pub.abstract}
            </p>
          </details>
        )}

        {/* Tags + link */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {pub.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
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
              Read paper
            </a>
          )}
        </div>
      </div>
    </MotionDiv>
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
    <section className="py-24 lg:py-32 bg-background" id="publications">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-3">
            Research
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Publications
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md text-base">
            Papers, articles, and academic work across computer science and
            web technologies.
          </p>
        </MotionDiv>

        <div className="space-y-3 max-w-3xl">
          {publications.map((pub, i) => (
            <PublicationCard key={pub._id} pub={pub} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
