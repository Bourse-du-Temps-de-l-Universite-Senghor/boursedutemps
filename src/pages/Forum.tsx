
import React, { useState } from 'react';
import { User, ForumTopic } from '../types';

interface ForumProps {
  user: User | null;
  topics: ForumTopic[];
  onAdd: (t: ForumTopic) => void;
}

const Forum: React.FC<ForumProps> = ({ user, topics, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMsg, setNewMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const t: ForumTopic = {
      id: Date.now().toString(),
      authorName: `${user.firstName} ${user.lastName}`,
      title: newTitle,
      message: newMsg,
      createdAt: new Date().toISOString()
    };
    onAdd(t);
    setShowAdd(false);
    setNewTitle('');
    setNewMsg('');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-heading text-4xl font-bold text-slate-900">Forum des échanges</h1>
        <button 
          onClick={() => user ? setShowAdd(true) : alert('Connectez-vous pour participer')}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition"
        >
          Nouveau Sujet
        </button>
      </div>

      {showAdd && (
        <div className="mb-12 bg-white p-8 rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-50">
          <h2 className="font-heading text-xl font-bold mb-6">Lancer une discussion</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Titre du sujet" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <textarea required placeholder="Votre message..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[150px]" value={newMsg} onChange={e => setNewMsg(e.target.value)} />
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Publier</button>
              <button type="button" onClick={() => setShowAdd(false)} className="bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {topics.length > 0 ? topics.map(topic => (
          <div key={topic.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition">
                {topic.authorName[0]}
              </div>
              <div className="flex-grow">
                <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">{topic.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{topic.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Par {topic.authorName}</span>
                  <span className="text-[10px] text-slate-300">{new Date(topic.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <span className="text-5xl mb-4 block">💬</span>
            <p className="text-slate-400 font-medium">Aucune discussion en cours. Soyez le premier !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
