import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_SITE_CONTENT } from "../src/lib/site-content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);
const PATH = "config/site-content.json";

async function main() {
  const { data: existing } = await supabase.storage
    .from("product-images")
    .download(PATH);

  if (existing) {
    console.log("Conteudo do site ja existe no Storage.");
    return;
  }

  const buffer = Buffer.from(JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf-8");
  const { error } = await supabase.storage
    .from("product-images")
    .upload(PATH, buffer, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  }

  console.log("Conteudo inicial salvo em product-images/config/site-content.json");
}

main();