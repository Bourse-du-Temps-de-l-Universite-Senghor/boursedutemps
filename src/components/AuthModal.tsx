
import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onAuth: (u: User) => void;
  onSwitch: (m: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onAuth, onSwitch }) => {
  const [step, setStep] = useState(1);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('Management');
  const [gender, setGender] = useState<'Homme' | 'Femme'>('Homme');
  const [country, setCountry] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [avatar, setAvatar] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Verification State (Simulated)
  const [emailCode, setEmailCode] = useState('');
  const [whatsappCode, setWhatsappCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  
  // Codes de simulation fixes pour vos tests
  const SIMULATED_EMAIL_CODE = '1234';
  const SIMULATED_WHATSAPP_CODE = '5678';

  const handleSendEmailCode = () => {
    alert(`SIMULATION : Le code de vérification pour ${email} est : ${SIMULATED_EMAIL_CODE}`);
  };

  const handleSendWhatsappCode = () => {
    alert(`SIMULATION : Le code de vérification pour ${whatsapp} est : ${SIMULATED_WHATSAPP_CODE}`);
  };

  const verifyEmail = () => {
    if (emailCode === SIMULATED_EMAIL_CODE) {
      setIsEmailVerified(true);
      alert('Email vérifié avec succès !');
    } else {
      alert('Code incorrect. Utilisez 1234 pour le test.');
    }
  };

  const verifyWhatsapp = () => {
    if (whatsappCode === SIMULATED_WHATSAPP_CODE) {
      setIsWhatsappVerified(true);
      alert('Numéro WhatsApp vérifié !');
    } else {
      alert('Code incorrect. Utilisez 5678 pour le test.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (!avatar) {
        alert('Une photo de profil est obligatoire pour accéder à la plateforme.');
        return;
      }
      if (!termsAccepted) {
        alert('Vous devez accepter les conditions pour que votre profil soit visible.');
        return;
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        department,
        gender,
        country,
        whatsapp,
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        languages: languages.split(',').map(l => l.trim()).filter(l => l),
        hobbies: [],
        credits: 5,
        createdAt: new Date().toISOString(),
        avatar: avatar,
        role: 'user',
        termsAccepted: true
      };
      onAuth(newUser);
    } else {
      // Mock Login
      onAuth({
        id: 'user-' + Date.now(),
        firstName: 'Utilisateur',
        lastName: 'Test',
        email,
        department: 'Management',
        gender: 'Homme',
        country: 'Sénégal',
        whatsapp: '+221 0000000',
        skills: ['Test'],
        languages: ['Français'],
        hobbies: [],
        credits: 10,
        createdAt: new Date().toISOString(),
        avatar: 'https://via.placeholder.com/150',
        role: email === 'jean.pierre-louis.2025@etu-usenghor.org' ? 'admin' : 'user',
        termsAccepted: true
      });
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold text-slate-800 uppercase tracking-tight">
            {mode === 'login' ? 'Connexion' : 'Bourse du Temps - Inscription'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === 'login' ? 'Entrez vos identifiants' : `Étape ${step} sur 3`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'login' ? (
            <div className="space-y-4">
              <input required type="email" placeholder="Email institutionnel" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} />
              <input required type="password" placeholder="Mot de passe" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200">
                Se Connecter
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Prénom" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input required placeholder="Nom" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={gender} onChange={e => setGender(e.target.value as any)}>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                    <input required placeholder="Pays d'origine" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={country} onChange={e => setCountry(e.target.value)} />
                  </div>
                  <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={department} onChange={e => setDepartment(e.target.value)}>
                    <option>Management</option>
                    <option>Culture</option>
                    <option>Environnement</option>
                    <option>Santé</option>
                  </select>
                  <input required type="password" placeholder="Mot de passe" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={nextStep} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">Suivant</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
                    <p className="text-xs text-blue-700 font-bold">💡 Pour tester : Code Email = 1234 | Code WhatsApp = 5678</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Institutionnel</label>
                    <div className="flex gap-2">
                      <input required type="email" placeholder="votre-email@etu-usenghor.org" className="flex-grow px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={email} onChange={e => setEmail(e.target.value)} disabled={isEmailVerified} />
                      {!isEmailVerified && <button type="button" onClick={handleSendEmailCode} className="bg-slate-800 text-white px-4 rounded-xl text-xs font-bold">Recevoir Code</button>}
                    </div>
                    {!isEmailVerified && email.length > 5 && (
                      <div className="flex gap-2 animate-in slide-in-from-top-2">
                        <input placeholder="Code reçu (1234)" className="flex-grow px-5 py-4 rounded-2xl bg-slate-100 border border-slate-200 outline-none font-mono" value={emailCode} onChange={e => setEmailCode(e.target.value)} />
                        <button type="button" onClick={verifyEmail} className="bg-blue-600 text-white px-6 rounded-xl text-xs font-bold">Vérifier</button>
                      </div>
                    )}
                    {isEmailVerified && <p className="text-xs text-green-600 font-bold flex items-center gap-1">✅ Email vérifié</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Numéro WhatsApp</label>
                    <div className="flex gap-2">
                      <input required placeholder="Ex: +221 77..." className="flex-grow px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} disabled={isWhatsappVerified} />
                      {!isWhatsappVerified && <button type="button" onClick={handleSendWhatsappCode} className="bg-slate-800 text-white px-4 rounded-xl text-xs font-bold">Recevoir Code</button>}
                    </div>
                    {!isWhatsappVerified && whatsapp.length > 5 && (
                      <div className="flex gap-2 animate-in slide-in-from-top-2">
                        <input placeholder="Code WhatsApp (5678)" className="flex-grow px-5 py-4 rounded-2xl bg-slate-100 border border-slate-200 outline-none font-mono" value={whatsappCode} onChange={e => setWhatsappCode(e.target.value)} />
                        <button type="button" onClick={verifyWhatsapp} className="bg-blue-600 text-white px-6 rounded-xl text-xs font-bold">Vérifier</button>
                      </div>
                    )}
                    {isWhatsappVerified && <p className="text-xs text-green-600 font-bold flex items-center gap-1">✅ WhatsApp vérifié</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200">Retour</button>
                    <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50" disabled={!isEmailVerified || !isWhatsappVerified}>Suivant</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Photo de Profil (OBLIGATOIRE)</label>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border-4 border-blue-50 shadow-inner">
                        {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : <span className="text-3xl grayscale">👤</span>}
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-slate-500 cursor-pointer" required />
                      {!avatar && <p className="text-[10px] text-red-500 font-bold uppercase">La photo est requise pour continuer</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Compétences</label>
                      <input required placeholder="Excel, Marketing, Musique..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={skills} onChange={e => setSkills(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Langues</label>
                      <input required placeholder="Français, Wolof, Anglais..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={languages} onChange={e => setLanguages(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        J'accepte les <strong>conditions d'utilisation</strong>. Je confirme que mon profil sera <strong>visible par tous les membres</strong> de la Bourse du Temps pour faciliter les échanges de talents.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Retour</button>
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 disabled:opacity-50" disabled={!avatar || !termsAccepted}>S'inscrire</button>
                  </div>
                </div>
              )}
            </>
          )}
        </form>

        <p className="text-center mt-8 text-sm font-medium text-slate-400">
          {mode === 'login' ? "Nouveau membre ?" : "Déjà inscrit ?"} 
          <button 
            onClick={() => { onSwitch(mode === 'login' ? 'signup' : 'login'); setStep(1); }}
            className="text-blue-600 font-bold ml-1 hover:underline"
          >
            {mode === 'login' ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
