import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

const supabase = createClient(url, key);

const FIXES = [
  { slug: "saia-midi-plissada", categorySlug: "saias" },
  { slug: "calca-wide-leg-alfaiataria", categorySlug: "calcas" },
];

async function main() {
  const { data: categories, error: catError } = await supabase
    .from("Category")
    .select("id, slug");

  if (catError || !categories?.length) {
    console.error("Erro ao buscar categorias:", catError?.message);
    process.exit(1);
  }

  const catMap = new Map(categories.map((c) => [c.slug, c.id]));

  for (const fix of FIXES) {
    const categoryId = catMap.get(fix.categorySlug);
    if (!categoryId) {
      console.warn(`Categoria ${fix.categorySlug} nao encontrada`);
      continue;
    }

    const { error } = await supabase
      .from("Product")
      .update({ categoryId, updatedAt: new Date().toISOString() })
      .eq("slug", fix.slug)
      .is("categoryId", null);

    if (error) {
      console.error(`Erro em ${fix.slug}:`, error.message);
    } else {
      console.log(`OK: ${fix.slug} -> ${fix.categorySlug}`);
    }
  }
}

main();