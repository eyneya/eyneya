import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../lib/types';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import { CtaBanner } from '../components/ui/PricingCard';
import { formatShortDate } from '../lib/utils';

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/tax-tips/${post.slug}`}
      className="group card overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-brand-purple-light">
            <BookOpen className="h-10 w-10 text-brand-purple opacity-40" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        {post.published_at && (
          <div className="flex items-center gap-1.5 text-xs text-brand-slate mb-3">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.published_at}>{formatShortDate(post.published_at)}</time>
          </div>
        )}
        <h3 className="font-serif text-lg font-bold text-brand-dark leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-brand-slate leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-purple">
          Read Article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function TaxTipsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10);
      setPosts(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Seo
        title="Tax Tips | Eyneya Business Solutions"
        description="Practical tax tips, strategies, and insights from Eyneya Business Solutions to help you reduce your tax burden and stay ahead year-round."
        path="/tax-tips"
      />
      <PageHero
        eyebrow="Tax Tips"
        title="Insights to Help You Stay Ahead"
        subtitle="Practical guidance on tax strategy, planning, and compliance — written for individuals, self-employed professionals, and business owners."
      />

      <Section bg="offwhite">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-5 w-full bg-gray-200 rounded" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-200 rounded mt-2" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-brand-purple opacity-30 mx-auto mb-4" />
            <SectionHeader title="Coming Soon" subtitle="We're working on articles to help you navigate your taxes with confidence. Check back soon." center />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Section>

      <Section bg="white">
        <CtaBanner
          title="Have a Tax Question?"
          subtitle="Our team is here to help. Book a consultation or send us a message and we'll get back to you within one business day."
          primary={{ label: 'Book a Consultation', to: '/book' }}
          secondary={{ label: 'Contact Us', to: '/contact' }}
        />
      </Section>
    </>
  );
}
