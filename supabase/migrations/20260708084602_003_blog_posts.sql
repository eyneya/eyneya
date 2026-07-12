-- Blog posts table for Tax Tips section
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  body text,
  cover_image_url text,
  author text NOT NULL DEFAULT 'Eyneya Business Solutions',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts only
DROP POLICY IF EXISTS "public_read_published_posts" ON blog_posts;
CREATE POLICY "public_read_published_posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Admin can read all posts (including drafts)
DROP POLICY IF EXISTS "admin_read_all_posts" ON blog_posts;
CREATE POLICY "admin_read_all_posts" ON blog_posts
  FOR SELECT TO authenticated
  USING (true);

-- Admin insert
DROP POLICY IF EXISTS "admin_insert_posts" ON blog_posts;
CREATE POLICY "admin_insert_posts" ON blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Admin update
DROP POLICY IF EXISTS "admin_update_posts" ON blog_posts;
CREATE POLICY "admin_update_posts" ON blog_posts
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Admin delete
DROP POLICY IF EXISTS "admin_delete_posts" ON blog_posts;
CREATE POLICY "admin_delete_posts" ON blog_posts
  FOR DELETE TO authenticated
  USING (true);

-- updated_at trigger
DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
