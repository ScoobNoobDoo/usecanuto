export type PromoBarItem = { title: string; desc: string };

export type CategoryCard = { slug: string; name: string; image: string };

export type CtaLink = { text: string; href: string };

export type SiteContent = {
  headerMarquee: string[];
  brandName: string;
  welcome: { title: string; subtitle: string };
  hero: {
    image: string;
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  categorySection: { eyebrow: string; title: string };
  categories: CategoryCard[];
  featuredSection: { title: string; subtitle: string };
  promoBar: PromoBarItem[];
  newsletter: {
    eyebrow: string;
    title: string;
    description: string;
    successMessage: string;
  };
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  headerMarquee: [
    "Frete grátis acima de R$ 399",
    "PIX em até 4x sem juros",
    "15% OFF primeira compra — BEMVINDA15",
  ],
  brandName: "USECANUTO",
  welcome: {
    title: "USECANUTO",
    subtitle: "Moda com protagonismo",
  },
  hero: {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
    eyebrow: "Nova Coleção — Verão 26",
    title: "Elegância que",
    titleAccent: "protagoniza",
    description:
      "Descubra peças que traduzem feminilidade, conforto e expressão — feitas para você viver o agora com autenticidade.",
    primaryCta: { text: "Explorar coleção", href: "/loja" },
    secondaryCta: { text: "Sale até 40%", href: "/loja?sale=true" },
  },
  categorySection: {
    eyebrow: "Explore por categoria",
    title: "Navegue",
  },
  categories: [
    {
      slug: "vestidos",
      name: "Vestidos",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    },
    {
      slug: "blusas",
      name: "Blusas",
      image:
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
    },
    {
      slug: "calcas",
      name: "Calças",
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
    },
    {
      slug: "saias",
      name: "Saias",
      image:
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    },
  ],
  featuredSection: {
    title: "Destaques",
    subtitle: "Seleção especial",
  },
  promoBar: [
    { title: "Pagamento", desc: "Cartão em até 6x | PIX em 4x" },
    { title: "Frete Grátis", desc: "Acima de R$ 399" },
    { title: "Entrega Expressa", desc: "Receba em até 1 dia útil" },
    { title: "Primeira compra", desc: "15% OFF — BEMVINDA15" },
  ],
  newsletter: {
    eyebrow: "Newsletter",
    title: "15% OFF na primeira compra",
    description: "Assine e receba novidades exclusivas. Cupom: BEMVINDA15",
    successMessage: "Obrigada por se inscrever! Verifique seu e-mail.",
  },
};

export function mergeSiteContent(partial: Partial<SiteContent> | null): SiteContent {
  if (!partial) return DEFAULT_SITE_CONTENT;

  return {
    headerMarquee: partial.headerMarquee?.length
      ? partial.headerMarquee
      : DEFAULT_SITE_CONTENT.headerMarquee,
    brandName: partial.brandName || DEFAULT_SITE_CONTENT.brandName,
    welcome: { ...DEFAULT_SITE_CONTENT.welcome, ...partial.welcome },
    hero: {
      ...DEFAULT_SITE_CONTENT.hero,
      ...partial.hero,
      primaryCta: {
        ...DEFAULT_SITE_CONTENT.hero.primaryCta,
        ...partial.hero?.primaryCta,
      },
      secondaryCta: {
        ...DEFAULT_SITE_CONTENT.hero.secondaryCta,
        ...partial.hero?.secondaryCta,
      },
    },
    categorySection: {
      ...DEFAULT_SITE_CONTENT.categorySection,
      ...partial.categorySection,
    },
    categories: partial.categories?.length
      ? partial.categories
      : DEFAULT_SITE_CONTENT.categories,
    featuredSection: {
      ...DEFAULT_SITE_CONTENT.featuredSection,
      ...partial.featuredSection,
    },
    promoBar: partial.promoBar?.length
      ? partial.promoBar
      : DEFAULT_SITE_CONTENT.promoBar,
    newsletter: {
      ...DEFAULT_SITE_CONTENT.newsletter,
      ...partial.newsletter,
    },
  };
}