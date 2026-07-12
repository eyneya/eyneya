import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Image as ImageIcon, Link2, Minus, Undo, Redo,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        'h-8 w-8 flex items-center justify-center rounded transition-colors text-brand-dark',
        active ? 'bg-brand-purple text-white' : 'hover:bg-brand-purple-light hover:text-brand-purple',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write your article here...' }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  async function handleImageUpload(file: File) {
    const ext = file.name.split('.').pop();
    const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('blog-images').upload(path, file, { upsert: false });
    if (error) { alert('Image upload failed: ' + error.message); return; }
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = '';
  }

  function addLink() {
    const url = window.prompt('Enter URL:');
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-brand-purple focus-within:ring-1 focus-within:ring-brand-purple">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton title="Insert Link" onClick={addLink} active={editor.isActive('link')}>
          <Link2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Insert Image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none min-h-[320px] p-4 text-brand-dark focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:my-4 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  );
}
