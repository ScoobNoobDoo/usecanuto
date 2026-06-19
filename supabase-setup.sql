-- Cole e execute no Supabase: SQL Editor > New query > Run
-- Libera leitura publica das tabelas da loja.
--
-- NOTA: Este SQL e suficiente para o Supabase. Nao precisa de politica
-- extra para o admin — as APIs usam SUPABASE_SERVICE_ROLE_KEY, que ignora RLS.
-- As categorias (Vestidos, Blusas, etc.) ja devem existir na tabela Category.
-- Se algum produto nao aparece na categoria certa, rode supabase-fix-categories.sql

ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON "Product";
CREATE POLICY "public_read_products" ON "Product"
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "public_read_categories" ON "Category";
CREATE POLICY "public_read_categories" ON "Category"
  FOR SELECT USING (true);