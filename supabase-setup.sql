-- Cole e execute no Supabase: SQL Editor > New query > Run
-- Libera leitura publica das tabelas da loja

ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON "Product";
CREATE POLICY "public_read_products" ON "Product"
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "public_read_categories" ON "Category";
CREATE POLICY "public_read_categories" ON "Category"
  FOR SELECT USING (true);