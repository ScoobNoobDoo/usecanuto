/** Categorias da loja — slugs devem coincidir com o banco (seed Supabase). */
export const STORE_CATEGORIES = [
  {
    name: "Vestidos",
    slug: "vestidos",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  },
  {
    name: "Blusas",
    slug: "blusas",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
  },
  {
    name: "Calças",
    slug: "calcas",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
  },
  {
    name: "Saias",
    slug: "saias",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
  },
] as const;

export type CategorySlug = (typeof STORE_CATEGORIES)[number]["slug"];