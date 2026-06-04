-- Run this in Supabase SQL Editor to allow admin product CRUD from the app.
-- Required because the default schema only allows SELECT on products/variants.

CREATE POLICY "Allow product writes" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow product variant writes" ON product_variants
  FOR ALL USING (true) WITH CHECK (true);
