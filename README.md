# Portfolio ZANAPARIEN Tohavina Princy (avec back)

- `index.html` : le site public (les projets viennent de l’admin)
- `admin/index.html` : l’espace admin (adresse : votresite.vercel.app/admin)
- `api/` : le back (projets, connexion, envoi de vidéos, formulaire de contact)
- `lib/auth.js` : la connexion admin

## Mettre le site en ligne (gratuit)

### 1. Mettre les fichiers sur GitHub
1. Crée un compte sur https://github.com puis un nouveau dépôt (bouton « New »).
2. Dézippe ce dossier. Dans le dépôt : « Add file » > « Upload files », glisse **tout le contenu** (les dossiers `api`, `admin`, `lib` et les fichiers) puis « Commit changes ».

### 2. Créer le site sur Vercel
1. Va sur https://vercel.com, connecte-toi avec GitHub.
2. « Add New… » > « Project », choisis ton dépôt, puis « Deploy ». Ton site est en ligne en 1 minute (adresse en .vercel.app).

### 3. Activer le stockage des vidéos (Blob)
Dans ton projet Vercel : onglet **Storage** > « Create Database » > **Blob** > crée-le et connecte-le au projet. Vercel ajoute seul la variable `BLOB_READ_WRITE_TOKEN`.

### 4. Ajouter les mots de passe
Projet > **Settings** > **Environment Variables**, ajoute :
- `ADMIN_PASSWORD` : le mot de passe de ton admin (long et unique)
- `RESEND_API_KEY` : clé de https://resend.com (compte créé avec zanatohaprincy@gmail.com), pour recevoir les messages du formulaire

Puis **Deployments** > les trois points du dernier déploiement > **Redeploy**.

### 5. Utiliser l’admin
Va sur `https://ton-site.vercel.app/admin`, entre ton mot de passe, puis ajoute, modifie, réordonne ou supprime tes projets. Les vidéos envoyées sont hébergées sur ton site. Un changement apparaît sur le site en moins d’une minute.

### Nom de domaine perso (optionnel)
Projet > Settings > Domains : ajoute ton domaine et suis les instructions.

## Limites à connaître
- Vercel Blob gratuit : environ 1 Go de stockage. Garde des vidéos courtes (mp4 H.264, 1080×1920 max).
- Resend sans domaine vérifié envoie seulement à l’adresse du compte (c’est suffisant ici).
