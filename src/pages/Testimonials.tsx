
import React, { useState } from 'react';
import { Testimonial, User } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  user: User | null;
  onUpdate: (t: Testimonial[]) => void;
  onAuthClick: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, user, onUpdate, onAuthClick }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return onAuthClick();
    
    const nt: Testimonial = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatar,
      title: newTitle,
      content: newContent,
      rating: newRating,
      votes: [],
      createdAt: new Date().toISOString(),
    };
    onUpdate([nt, ...testimonials]);
    setShowAdd(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleVote = (id: string) => {
    if (!user) return onAuthClick();
    const updated = testimonials.map(t => {
      if (t.id === id) {
        const hasVoted = t.votes.includes(user.id);
        const newVotes = hasVoted ? t.votes.filter(uid => uid !== user.id) : [...t.votes, user.id];
        return { ...t, votes: newVotes };
      }
      return t;
    });
    onUpdate(updated);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">Paroles de Membres</h1>
        <p className="text-slate-500 mb-10">Partagez votre expérience et votez pour les meilleures histoires d'entraide.</p>
        <button 
          onClick={() => user ? setShowAdd(true) : onAuthClick()}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-xl"
        >
          Contribuer au mur
        </button>
      </div>

      {showAdd && (
        <div className="mb-16 bg-white p-10 rounded-[2.5rem] border border-blue-100 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
          <h2 className="font-heading text-2xl font-bold mb-8">Votre Témoignage</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input required placeholder="Titre de votre histoire" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <textarea required placeholder="Détaillez votre expérience..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none min-h-[150px]" value={newContent} onChange={e => setNewContent(e.target.value)} />
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400">Note :</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setNewRating(star)} className={`text-2xl transition ${newRating >= star ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}>★</button>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold">Publier</button>
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold">Plus tard</button>
            </div>
          </form>
        </div>
      )}

      <div className="columns-1 md:columns-2 gap-8 space-y-8">
        {testimonials.sort((a,b) => b.votes.length - a.votes.length).map(t => (
          <div key={t.id} className="break-inside-avoid bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
              <button 
                onClick={() => handleVote(t.id)}
                className={`flex flex-col items-center gap-1 transition-transform group-hover:scale-110 ${t.votes.includes(user?.id || '') ? 'text-blue-600' : 'text-slate-300 hover:text-blue-400'}`}
              >
                <span className="text-2xl">▲</span>
                <span className="text-xs font-bold">{t.votes.length}</span>
              </button>
            </div>
            
            <div className="flex text-yellow-400 mb-6 text-lg">
              {'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-800 mb-4 pr-10">"{t.title}"</h3>
            <p className="text-slate-500 italic leading-relaxed mb-8">
              {t.content}
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
              <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shadow-sm">
                {t.authorAvatar ? <img src={t.authorAvatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-blue-600">{t.authorName[0]}</div>}
              </div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">Par {t.authorName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
