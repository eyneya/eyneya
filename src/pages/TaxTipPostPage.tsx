import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../lib/types';
import Seo from '../components/Seo';
import { Section } from '../components/ui/Section';
import { CtaBanner } from '../components/ui/PricingCard';
import { formatDate } from '../lib/utils';

export default function TaxTipPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) { setNotFound(true); setLoading(false); return; }
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (!data) { setNotFound(true); } else { setPost(data); }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-wide py-32 animate-pulse space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="aspect-[2/1] bg-gray-200 rounded-xl mt-8" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <Section bg="offwhite">
        <div className="text-center py-20">
          <p className="text-5xl font-bold text-brand-purple mb-4">404</p>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Article Not Found</h1>
          <p className="text-brand-slate mb-8">This article may have been removed or the link is incorrect.</p>
          <Link to="/tax-tips" className="btn-purple">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Tips
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Seo
        title={`${post.title} | Tax Tips | Eyneya Business Solutions`}
        description={post.excerpt ?? `Read ${post.title} on the Eyneya Business Solutions Tax Tips blog.`}
        path={`/tax-tips/${post.slug}`}
      />

      {/* Hero */}
      <div className="bg-brand-dark text-white">
        <div className="container-wide py-16 lg:py-20 max-w-4xl">
          <Link to="/tax-tips" className="inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-dark transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Tips
          </Link>
          <h1 className="text-3xl lg:text-5xl font-serif font-bold text-white leading-tight text-balance">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-brand-gold" />
              {post.author}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-gold" />
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
            )}
          </div>
          {post.excerpt && (
            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-2xl">{post.excerpt}</p>
          )}
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="container-wide max-w-4xl -mt-px">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full aspect-[2/1] object-cover rounded-b-2xl shadow-premium"
          />
        </div>
      )}

      {/* Body */}
      <Section bg="white">
        <div className="max-w-3xl mx-auto">
          {post.body ? (
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-a:text-brand-purple hover:prose-a:text-brand-purple-dark prose-blockquote:border-brand-purple prose-blockquote:text-brand-slate prose-img:rounded-xl prose-img:shadow-card"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p className="text-brand-slate italic">No content yet.</p>
          )}
        </div>
      </Section>

      <Section bg="offwhite">
        <div className="max-w-3xl mx-auto">
          <CtaBanner
            title="Ready to Apply These Strategies?"
            subtitle="Book a consultation and we'll put a personalized tax plan in place for your situation."
            primary={{ label: 'Book a Consultation', to: '/book' }}
            secondary={{ label: 'View All Tax Tips', to: '/tax-tips' }}
          />
        </div>
      </Section>
    </>
  );
}
