# Les Restos du Dev 🍽️👩‍💻

Une application web culinaire décalée où les développeurs peuvent partager leurs "recettes" de composants électroniques à déguster ! Un croisement improbable entre Marmiton et le monde de la tech.

## 🌟 Fonctionnalités

- 🔐 Authentification utilisateur avec Firebase
- 📝 Création, modification et suppression de recettes
- 👥 Profils utilisateurs personnalisés
- 📱 Interface responsive et moderne
- 🎨 Design élégant avec Tailwind CSS et shadcn/ui
- 🧪 Tests unitaires avec Jest

## 🛠️ Technologies Utilisées

- **React** - Framework frontend
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **Firebase** - Backend et authentification
- **Jest** - Framework de test
- **Vercel** - Déploiement et hébergement

## 🚀 Installation et Développement

```bash
# Cloner le projet
git clone [url-du-repo]

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Lancer les tests
pnpm test
```

## 🧪 Tests

Les tests sont écrits avec Jest. Pour exécuter la suite de tests :

```bash
# Lancer tous les tests
pnpm test

# Lancer les tests en mode watch
pnpm test:watch

# Voir la couverture des tests
pnpm test:coverage
```

## 📤 Déploiement

Le projet est déployé automatiquement sur Vercel à chaque push sur la branche main.

### Configuration Vercel

Le fichier `vercel.json` est configuré pour gérer le routage SPA :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 🔑 Configuration Firebase

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```bash
# filepath: .env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

## 🎯 Objectifs du Projet

- Créer une plateforme humoristique de recettes tech
- Implémenter des tests unitaires complets
- Maintenir un déploiement continu
- Assurer une excellente couverture de tests

## 💡 Exemples de Recettes

- "RAM à la sauce RGB"
- "Processeur grillé aux watts"
- "Salade de câbles USB"
- "Carte mère en croûte"

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité
3. Assurez-vous que tous les tests passent
4. Soumettez une Pull Request
