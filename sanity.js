import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'YOUR_PROJECT_ID',   // trouvé dans sanity.io
  dataset: 'production',          // ou ton dataset
  apiVersion: '2025-02-19',       // date du jour pour versionner l’API
  useCdn: true,                   // true = rapide, false = données fraîches
})

