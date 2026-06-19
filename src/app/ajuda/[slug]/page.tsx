import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { HELP_PAGES } from "@/lib/help-content";

export default async function AjudaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = HELP_PAGES[slug];
  if (!page) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-8"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <h1 className="font-serif text-3xl tracking-wide mb-1">{page.title}</h1>
      <p className="text-sm text-muted mb-10">{page.subtitle}</p>

      <div className="space-y-8">
        {page.sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="text-xs tracking-[0.2em] uppercase text-muted mb-2">
                {section.heading}
              </h2>
            )}
            <p className="text-sm leading-relaxed text-foreground/80">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}