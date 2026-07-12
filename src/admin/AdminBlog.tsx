import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../lib/types';
import { formatShortDate, cn } from '../lib/utils';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setPosts(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await supabase.from('blog_posts').delete().eq('id', id);
    await load();
    setDeleting(null);
  }

  const slots = Array.from({ length: 10 }, (_, i) => posts[i] ?? null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Tax Tips</h1>
          <p className="text-sm text-brand-slate mt-1">Manage your published articles. Up to 10 posts shown.</p>
        </div>
        <Link to="/admin/blog/new" className="btn-purple btn-sm">
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="card card-pad animate-pulse text-brand-slate">Loading posts...</div>
      ) : (
        <div className="space-y-3">
          {slots.map((post, i) => (
            <div key={post?.id ?? `slot-${i}`} className={cn('card flex items-center gap-4 p-4', !post && 'border-dashed bg-gray-50/50')}>
              {/* Cover thumbnail */}
              <div className="h-14 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {post?.cover_image_url ? (
                  <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <FileText className={cn('h-5 w-5', post ? 'text-gray-300' : 'text-gray-200')} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {post ? (
                  <>
                    <p className="font-semibold text-brand-dark truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn(
                        'badge text-[10px]',
                        post.status === 'published' ? 'badge-success' : 'badge-slate',
                      )}>
                        {post.status}
                      </span>
                      {post.published_at && (
                        <span className="text-xs text-brand-slate">{formatShortDate(post.published_at)}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic">Empty slot {i + 1} — create a new post to fill it</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {post ? (
                  <>
                    {post.status === 'published' && (
                      <a
                        href={`/tax-tips/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-brand-slate hover:bg-brand-purple-light hover:text-brand-purple transition-colors"
                        title="View on site"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    )}
                    <Link
                      to={`/admin/blog/${post.id}`}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-brand-slate hover:bg-brand-purple-light hover:text-brand-purple transition-colors"
                      title="Edit post"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleting === post.id}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-brand-slate hover:bg-red-50 hover:text-brand-error transition-colors disabled:opacity-40"
                      title="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <Link to="/admin/blog/new" className="btn-outline btn-sm text-xs py-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Create
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
