-- Execute no Supabase: SQL Editor > New query > Run
-- Corrige produtos de exemplo que ficaram sem categoria

UPDATE "Product"
SET "categoryId" = (SELECT id FROM "Category" WHERE slug = 'saias' LIMIT 1),
    "updatedAt" = NOW()
WHERE slug = 'saia-midi-plissada' AND "categoryId" IS NULL;

UPDATE "Product"
SET "categoryId" = (SELECT id FROM "Category" WHERE slug = 'calcas' LIMIT 1),
    "updatedAt" = NOW()
WHERE slug = 'calca-wide-leg-alfaiataria' AND "categoryId" IS NULL;

-- Conferir resultado:
-- SELECT p.title, c.name AS categoria FROM "Product" p
-- LEFT JOIN "Category" c ON c.id = p."categoryId" ORDER BY p.title;