import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚠️ Remplace "TonCompteGitHub" et "nom-du-depot" par ton vrai utilisateur et dépôt
export default defineConfig({
  plugins: [react()],
  base: '/boursedutemps/', 
});

