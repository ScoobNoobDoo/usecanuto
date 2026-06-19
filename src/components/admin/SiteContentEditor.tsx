"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

const inputClass =
  "w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground transition-colors";
const labelClass = "text-xs tracking-wider uppercase text-muted";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border p-6 sm:p-8 space-y-4">
      <h2 className="font-serif text-xl tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

export default function SiteContentEditor({
  initial,
}: {
  initial: SiteContent;
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    const res = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erro ao salvar.");
    }
  };

  const updateMarquee = (index: number, value: string) => {
    const next = [...content.headerMarquee];
    next[index] = value;
    setContent({ ...content, headerMarquee: next });
  };

  const updatePromo = (index: number, key: "title" | "desc", value: string) => {
    const next = [...content.promoBar];
    next[index] = { ...next[index], [key]: value };
    setContent({ ...content, promoBar: next });
  };

  const updateCategory = (
    index: number,
    key: "name" | "image" | "slug",
    value: string
  ) => {
    const next = [...content.categories];
    next[index] = { ...next[index], [key]: value };
    setContent({ ...content, categories: next });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-8"
      >
        <ArrowLeft size={16} />
        Voltar ao painel
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl tracking-wide">Editar Site</h1>
          <p className="text-sm text-muted mt-1">
            Textos e imagens da página inicial e faixa superior
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm tracking-wider uppercase hover:bg-accent transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar tudo
        </button>
      </div>

      {error && <p className="text-sm text-sale mb-4">{error}</p>}
      {success && (
        <p className="text-sm text-accent mb-4 bg-cream px-4 py-2">
          Salvo! Atualize a loja para ver as mudanças.
        </p>
      )}

      <div className="space-y-6">
        <Section title="Faixa superior (texto que rola no topo)">
          <p className="text-xs text-muted">
            As mensagens que passam no cabeçalho — frete, PIX, cupom, etc.
          </p>
          {content.headerMarquee.map((line, i) => (
            <div key={i}>
              <label className={labelClass}>Mensagem {i + 1}</label>
              <input
                type="text"
                value={line}
                onChange={(e) => updateMarquee(i, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setContent({
                  ...content,
                  headerMarquee: [...content.headerMarquee, ""],
                })
              }
              className="flex items-center gap-1 text-xs tracking-wider uppercase border border-border px-3 py-2 hover:bg-cream"
            >
              <Plus size={14} /> Adicionar mensagem
            </button>
            {content.headerMarquee.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setContent({
                    ...content,
                    headerMarquee: content.headerMarquee.slice(0, -1),
                  })
                }
                className="flex items-center gap-1 text-xs text-sale border border-border px-3 py-2 hover:bg-cream"
              >
                <Trash2 size={14} /> Remover última
              </button>
            )}
          </div>
        </Section>

        <Section title="Marca e animação de entrada">
          <div>
            <label className={labelClass}>Nome da marca</label>
            <input
              type="text"
              value={content.brandName}
              onChange={(e) =>
                setContent({ ...content, brandName: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Texto da animação (título)</label>
            <input
              type="text"
              value={content.welcome.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  welcome: { ...content.welcome, title: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Texto da animação (subtítulo)</label>
            <input
              type="text"
              value={content.welcome.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  welcome: { ...content.welcome, subtitle: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
        </Section>

        <Section title="Banner principal (hero)">
          <div>
            <label className={labelClass}>URL da imagem de fundo</label>
            <input
              type="url"
              value={content.hero.image}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, image: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Texto pequeno acima do título</label>
            <input
              type="text"
              value={content.hero.eyebrow}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, eyebrow: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título — linha 1</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Título — linha 2 (itálico)</label>
              <input
                type="text"
                value={content.hero.titleAccent}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, titleAccent: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              value={content.hero.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, description: e.target.value },
                })
              }
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Botão principal — texto</label>
              <input
                type="text"
                value={content.hero.primaryCta.text}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      primaryCta: { ...content.hero.primaryCta, text: e.target.value },
                    },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Botão principal — link</label>
              <input
                type="text"
                value={content.hero.primaryCta.href}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      primaryCta: { ...content.hero.primaryCta, href: e.target.value },
                    },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Botão secundário — texto</label>
              <input
                type="text"
                value={content.hero.secondaryCta.text}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      secondaryCta: { ...content.hero.secondaryCta, text: e.target.value },
                    },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Botão secundário — link</label>
              <input
                type="text"
                value={content.hero.secondaryCta.href}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      secondaryCta: { ...content.hero.secondaryCta, href: e.target.value },
                    },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
        </Section>

        <Section title="Barra de benefícios (ícones)">
          {content.promoBar.map((item, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border last:border-0">
              <div>
                <label className={labelClass}>Título {i + 1}</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updatePromo(i, "title", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Descrição {i + 1}</label>
                <input
                  type="text"
                  value={item.desc}
                  onChange={(e) => updatePromo(i, "desc", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </Section>

        <Section title="Seção de categorias">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Texto pequeno</label>
              <input
                type="text"
                value={content.categorySection.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    categorySection: {
                      ...content.categorySection,
                      eyebrow: e.target.value,
                    },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Título</label>
              <input
                type="text"
                value={content.categorySection.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    categorySection: {
                      ...content.categorySection,
                      title: e.target.value,
                    },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
          {content.categories.map((cat, i) => (
            <div key={cat.slug} className="pt-4 border-t border-border space-y-3">
              <p className="text-sm font-medium">{cat.name}</p>
              <div>
                <label className={labelClass}>Nome exibido</label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategory(i, "name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>URL da imagem</label>
                <input
                  type="url"
                  value={cat.image}
                  onChange={(e) => updateCategory(i, "image", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </Section>

        <Section title="Seção destaques">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título</label>
              <input
                type="text"
                value={content.featuredSection.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    featuredSection: {
                      ...content.featuredSection,
                      title: e.target.value,
                    },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Subtítulo</label>
              <input
                type="text"
                value={content.featuredSection.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    featuredSection: {
                      ...content.featuredSection,
                      subtitle: e.target.value,
                    },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
        </Section>

        <Section title="Newsletter">
          <div>
            <label className={labelClass}>Texto pequeno</label>
            <input
              type="text"
              value={content.newsletter.eyebrow}
              onChange={(e) =>
                setContent({
                  ...content,
                  newsletter: { ...content.newsletter, eyebrow: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Título</label>
            <input
              type="text"
              value={content.newsletter.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  newsletter: { ...content.newsletter, title: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              value={content.newsletter.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  newsletter: { ...content.newsletter, description: e.target.value },
                })
              }
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Mensagem após inscrição</label>
            <input
              type="text"
              value={content.newsletter.successMessage}
              onChange={(e) =>
                setContent({
                  ...content,
                  newsletter: {
                    ...content.newsletter,
                    successMessage: e.target.value,
                  },
                })
              }
              className={inputClass}
            />
          </div>
        </Section>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full mt-8 flex items-center justify-center gap-2 bg-foreground text-background py-4 text-sm tracking-wider uppercase hover:bg-accent transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Salvar alterações do site
      </button>
    </div>
  );
}