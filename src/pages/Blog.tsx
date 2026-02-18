
import React, { useState, useRef } from 'react';
import { BlogPost, User, MediaItem, BlogComment } from '../types';

interface BlogProps {
  blogs: BlogPost[];
  user: User | null;
  onUpdate: (b: BlogPost[]) => void;
  onAuthClick: () => void;
}

const Blog: React.FC<BlogProps> = ({ blogs, user, onUpdate, onAuthClick }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Expérience');
  const [mediaData, setMediaData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaData(reader.result as string);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    };
    reader.readAsDataURL(file);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const media: MediaItem[] = mediaData ? [{ type: mediaType, url: mediaData }] : [];
    
    const newPost: BlogPost = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatar,
      title: newTitle,
      content: newContent,
      category: newCategory,
      media: media,
      likes: [],
      dislikes: [],
      reposts: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    onUpdate([newPost, ...blogs]);
    setShowAdd(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle('');
    setNewContent('');
    setMediaData(null);
    setCommentText('');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-2">Feed Communautaire</h1>
          <p className="text-slate-500">Partagez vos succès directement en photos et vidéos.</p>
        </div>
        <button 
          onClick={() => user ? setShowAdd(true) : onAuthClick()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 transition whitespace-nowrap"
        >
          + Nouvelle publication
        </button>
      </div>

      {showAdd && (
        <div className="mb-12 bg-white rounded-[2.5rem] p-8 shadow-xl border border-blue-50 animate-in zoom-in duration-300">
          <h2 className="font-heading text-xl font-bold mb-6">Partager mon expérience</h2>
          <form onSubmit={handlePost} className="space-y-6">
            <input required placeholder="Titre accrocheur" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <textarea required placeholder="Racontez votre histoire..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none min-h-[120px] focus:ring-2 focus:ring-blue-500" value={newContent} onChange={e => setNewContent(e.target.value)} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                <option>Expérience</option>
                <option>Succès</option>
                <option>Tutoriel</option>
                <option>Actualité</option>
              </select>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-200 transition flex items-center justify-center gap-2"
                >
                  {mediaData ? "✅ Fichier prêt" : "📁 Importer Photo/Vidéo"}
                </button>
              </div>
            </div>

            {mediaData && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 p-2">
                {mediaType === 'image' ? (
                  <img src={mediaData} className="w-full h-40 object-cover rounded-xl" alt="Preview" />
                ) : (
                  <video src={mediaData} className="w-full h-40 object-cover rounded-xl" />
                )}
                <button type="button" onClick={() => setMediaData(null)} className="text-xs text-red-500 font-bold p-2 hover:underline">Supprimer le fichier</button>
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">Publier maintenant</button>
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-10">
        {blogs.map(blog => (
          <article key={blog.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                  {blog.authorAvatar ? <img src={blog.authorAvatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">{blog.authorName[0]}</div>}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{blog.authorName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
                </div>
              </div>
              
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">{blog.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{blog.content}</p>
              
              {blog.media.length > 0 && (
                <div className="rounded-3xl overflow-hidden mb-6 bg-slate-50 border border-slate-100">
                  {blog.media[0].type === 'image' ? (
                    <img src={blog.media[0].url} className="w-full h-auto max-h-[500px] object-cover" alt="Media" />
                  ) : (
                    <video src={blog.media[0].url} controls className="w-full h-auto max-h-[500px]" />
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
