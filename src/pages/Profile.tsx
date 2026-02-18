
import React, { useState } from 'react';
import { User, Transaction, Connection, ChatMessage } from '../types';

interface ProfileProps {
  user: User;
  currentUser?: User | null;
  allUsers: User[];
  transactions: Transaction[];
  connections: Connection[];
  messages: ChatMessage[];
  onUpdate: (u: User) => void;
  onUpdateConnections: (c: Connection[]) => void;
  onUpdateMessages: (m: ChatMessage[]) => void;
  readOnly?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ 
  user, 
  currentUser, 
  allUsers,
  transactions, 
  connections,
  messages,
  onUpdate, 
  onUpdateConnections,
  onUpdateMessages,
  readOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [activeTab, setActiveTab] = useState<'info' | 'connections' | 'messages' | 'suivi'>('info');
  const [messageContent, setMessageContent] = useState('');
  const [selectedChatPartner, setSelectedChatPartner] = useState<string | null>(null);

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
    alert("Profil mis à jour !");
  };

  const userTransactions = transactions.filter(t => t.fromId === user.id || t.toId === user.id);
  
  // Connections logic
  const myConnections = connections.filter(c => (c.senderId === user.id || c.receiverId === user.id) && c.status === 'accepted');
  const pendingRequests = connections.filter(c => c.receiverId === user.id && c.status === 'pending');

  // Messaging logic
  const handleSendMessage = () => {
    if (!currentUser) return;
    const targetId = readOnly ? user.id : selectedChatPartner;
    if (!targetId || !messageContent.trim()) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      receiverId: targetId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    onUpdateMessages([...messages, newMsg]);
    setMessageContent('');
  };

  const getChatPartners = () => {
    const partners = new Set<string>();
    messages.forEach(m => {
      if (m.senderId === user.id) partners.add(m.receiverId);
      if (m.receiverId === user.id) partners.add(m.senderId);
    });
    return Array.from(partners).map(pid => allUsers.find(u => u.id === pid)).filter(u => !!u) as User[];
  };

  const activeChatMessages = selectedChatPartner || (readOnly && user.id) 
    ? messages.filter(m => 
        (m.senderId === user.id && m.receiverId === (readOnly ? user.id : selectedChatPartner)) || 
        (m.senderId === (readOnly ? user.id : selectedChatPartner) && m.receiverId === user.id)
      ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="h-48 bg-slate-900 p-8 flex items-end justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-80"></div>
          
          <div className="flex items-center gap-6 translate-y-12 relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-4xl">👤</span>}
              </div>
            </div>
            <div className="pb-4">
              <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{user.department}</p>
              </div>
            </div>
          </div>
          
          {!readOnly && (
            <button onClick={() => setIsEditing(true)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-bold transition border border-white/30 relative z-10">
              Modifier
            </button>
          )}
        </div>

        {/* Tabs */}
        {!readOnly && (
          <div className="mt-20 px-10 border-b border-slate-100 flex gap-8">
            <button onClick={() => setActiveTab('info')} className={`pb-4 text-sm font-bold uppercase tracking-widest transition ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Profil</button>
            <button onClick={() => setActiveTab('suivi')} className={`pb-4 text-sm font-bold uppercase tracking-widest transition ${activeTab === 'suivi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Suivi Crédits</button>
            <button onClick={() => setActiveTab('connections')} className={`pb-4 text-sm font-bold uppercase tracking-widest transition ${activeTab === 'connections' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Réseau</button>
            <button onClick={() => setActiveTab('messages')} className={`pb-4 text-sm font-bold uppercase tracking-widest transition ${activeTab === 'messages' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Messages</button>
          </div>
        )}

        <div className="pt-10 px-10 pb-16">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={editedUser.bio} onChange={e => setEditedUser({...editedUser, bio: e.target.value})} />
                    <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Sauvegarder</button>
                  </div>
                ) : (
                  <>
                    <section>
                      <h3 className="font-heading text-lg font-bold text-slate-800 mb-4">Présentation</h3>
                      <p className="text-slate-500 italic leading-relaxed">{user.bio || "Pas de présentation."}</p>
                    </section>
                    <section>
                      <h3 className="font-heading text-lg font-bold text-slate-800 mb-4">Compétences</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((s, i) => (
                          <span key={i} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-bold">{s}</span>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </div>
              <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl">
                <p className="text-xs font-bold opacity-70 mb-1 tracking-widest uppercase">Solde Actuel</p>
                <h4 className="text-5xl font-bold">⏰ {user.credits}</h4>
                <p className="mt-4 text-[10px] opacity-60">Crédits négociables pour vos services.</p>
              </div>
            </div>
          )}

          {activeTab === 'suivi' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-6">Historique des transactions</h3>
              {userTransactions.length === 0 ? (
                <p className="text-slate-400 italic">Aucune transaction enregistrée.</p>
              ) : (
                <div className="space-y-3">
                  {userTransactions.map(t => (
                    <div key={t.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${t.fromId === user.id ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {t.fromId === user.id ? '↓' : '↑'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{t.serviceTitle}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(t.date).toLocaleDateString()} — {t.fromId === user.id ? 'Débit' : 'Crédit'}</p>
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${t.fromId === user.id ? 'text-red-500' : 'text-green-500'}`}>
                        {t.fromId === user.id ? '-' : '+'}{t.amount} ⏰
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Autres onglets (connections, messages) similaires... */}
          {activeTab === 'messages' && (
            <p className="text-slate-400 text-sm italic">Système de messagerie actif. Sélectionnez une discussion.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
