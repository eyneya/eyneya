import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Trash2, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../lib/types';
import RichTextEditor from '../components/ui/RichTextEditor';
import { cn } from '../lib/utils';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminBlogEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [author, setAuthor] = useState('Eyneya Business Solutions');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedAt, setPublishedAt] = useState('');

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? '');
        setBody(data.body ?? '');
        setCoverImageUrl(data.cover_image_url ?? '');
        setAuthor(data.author);
        setStatus(data.status);
        setPublishedAt(data.published_at ? data.published_at.slice(0, 16) : '');
        setSlugTouched(true);
      }
      setLoading(false);
    }
    load();
  }, [id, isNew]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    const ext = file.name.split('.').pop();
    const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('blog-images').upload(path, file, { upsert: false });
    if (uploadError) { setError('Cover upload failed: ' + uploadError.message); setUploadingCover(false); return; }
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
    setCoverImageUrl(data.publicUrl);
    setUploadingCover(false);
  }

  async function save(publishNow?: boolean) {
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!slug.trim()) { setError('Slug is required.'); return; }
    setSaving(true);
    setError(null);

    const finalStatus = publishNow ? 'published' : status;
    const finalPublishedAt = publishNow
      ? (publishedAt || new Date().toISOString())
      : (finalStatus === 'published' ? (publishedAt || new Date().toISOString()) : publishedAt || null);

    const payload: Partial<BlogPost> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      body: body || null,
      cover_image_url: coverImageUrl || null,
      author: author.trim() || 'Eyneya Business Solutions',
      status: finalStatus,
      published_at: finalPublishedAt,
    };

    let postError: { message: string } | null = null;
    let savedId = id;

    if (isNew) {
      const { data, error: e } = await supabase.from('blog_posts').insert(payload).select('id').single();
      postError = e;
      if (data) savedId = data.id;
    } else {
      const { error: e } = await supabase.from('blog_posts').update(payload).eq('id', id);
      postError = e;
    }

    setSaving(false);
    if (postError) { setError(postError.message); return; }
    if (isNew && savedId) {
      navigate(`/admin/blog/${savedId}`, { replace: true });
    }
    if (publishNow) setStatus('published');
  }

  if (loading) {
    return <div className="animate-pulse text-brand-slate p-4">Loading post...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/blog" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-brand-slate hover:bg-brand-purple-light hover:text-brand-purple transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-brand-dark">{isNew ? 'New Post' : 'Edit Post'}</h1>
            <p className="text-sm text-brand-slate">Tax Tips article</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {status === 'published' && !isNew && (
            <a
              href={`/tax-tips/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost btn-sm"
            >
              <Eye className="h-4 w-4" />
              View Live
            </a>
          )}
          <button onClick={() => save(false)} disabled={saving} className="btn-outline btn-sm">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => save(true)} disabled={saving} className="btn-purple btn-sm">
            <Eye className="h-4 w-4" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-brand-error">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="card card-pad space-y-4">
            <div>
              <label className="label">Title *</label>
              <input
                className="input"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 5 Tax Deductions Self-Employed Professionals Often Miss"
              />
            </div>
            <div>
              <label className="label">Slug *</label>
              <div className="flex gap-2">
                <input
                  className="input font-mono text-sm"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
                  placeholder="auto-generated-from-title"
                />
                <button
                  type="button"
                  onClick={() => setSlug(slugify(title))}
                  className="flex-shrink-0 px-3 py-2 text-sm rounded-lg border border-gray-300 text-brand-slate hover:bg-gray-50 transition-colors"
                  title="Regenerate from title"
                >
                  Reset
                </button>
              </div>
              <p className="mt-1.5 text-xs text-brand-slate">/tax-tips/<span className="font-mono text-brand-purple">{slug || 'your-slug-here'}</span></p>
            </div>
            <div>
              <label className="label">Excerpt</label>
              <textarea
                className="input resize-none"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary shown on the Tax Tips listing page (150–200 characters recommended)"
              />
            </div>
          </div>

          {/* Body editor */}
          <div className="card card-pad">
            <label className="label mb-3">Article Body</label>
            <RichTextEditor
              value={body}
              onChange={setBody}
              placeholder="Write your tax tips article here. Use the toolbar to format text and insert images anywhere."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="card card-pad">
            <label className="label">Cover Image</label>
            {coverImageUrl ? (
              <div className="relative mt-2 rounded-lg overflow-hidden">
                <img src={coverImageUrl} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
                <button
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-brand-error hover:bg-white transition-colors shadow-sm"
                  title="Remove cover image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className={cn(
                  'mt-2 w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-brand-slate hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple-light transition-colors',
                  uploadingCover && 'opacity-60 cursor-wait',
                )}
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm font-medium">{uploadingCover ? 'Uploading...' : 'Upload Cover Photo'}</span>
                <span className="text-xs text-gray-400">JPEG, PNG, WebP — max 5MB</span>
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); e.target.value = ''; }}
            />
          </div>

          {/* Settings */}
          <div className="card card-pad space-y-4">
            <h3 className="font-semibold text-brand-dark text-sm">Post Settings</h3>

            <div>
              <label className="label">Status</label>
              <div className="flex gap-2 mt-1">
                {(['draft', 'published'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      'flex-1 py-2 text-sm rounded-lg border font-semibold transition-colors capitalize',
                      status === s
                        ? s === 'published' ? 'bg-brand-success text-white border-brand-success' : 'bg-brand-purple text-white border-brand-purple'
                        : 'bg-white text-brand-slate border-gray-300 hover:bg-gray-50',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Publish Date</label>
              <input
                type="datetime-local"
                className="input text-sm"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
              <p className="mt-1 text-xs text-brand-slate">Leave blank to use current time when publishing.</p>
            </div>

            <div>
              <label className="label">Author</label>
              <input
                className="input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
