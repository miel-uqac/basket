# Basket UQAC

Site web pour une borne de basketball connectée, développé dans le cadre d'un projet à l'UQAC. La borne détecte automatiquement les paniers marqués et met à jour un classement en temps réel, accessible depuis le téléphone des joueurs via QR code. Le site est accessible sur [miel-uqac.github.io/basket](https://miel-uqac.github.io/basket).

## Comment ça marche

Un écran affiché sur la borne (Raspberry Pi) génère un QR code. Le joueur le scanne avec son téléphone, ce qui l'identifie et le connecte à la partie en cours. Chaque panier détecté par la caméra incrémente son score, visible en temps réel sur son téléphone et sur l'écran de la borne.

Le site est une application [Next.js](https://nextjs.org) entièrement statique, hébergée sur GitHub Pages. Il n'y a aucun serveur sur mesure — tout le backend passe par [Supabase](https://supabase.com) (base de données PostgreSQL, authentification, temps réel via WebSocket).

## Démarrage rapide

```bash
git clone https://github.com/miel-uqac/basket.git
cd basket
git checkout web
npm install
npm run dev
```

Le site sera accessible à l'adresse affichée dans le terminal. Un fichier `.env` valide est nécessaire pour se connecter à Supabase — voir le wiki pour les détails.

## Documentation

Toute la documentation technique est disponible dans le **[wiki du dépôt](https://github.com/miel-uqac/basket/wiki)**. C'est le bon point de départ pour comprendre l'architecture, travailler sur le code, ou configurer l'environnement.

Quelques pages utiles pour commencer :

- **[Setup](https://github.com/miel-uqac/basket/wiki/Setup)** — installation, lancer le serveur de développement, structure des fichiers
- **[Architecture](https://github.com/miel-uqac/basket/wiki/Architecture)** — vue d'ensemble technique, variables d'environnement, schéma de base de données
- **[Backend](https://github.com/miel-uqac/basket/wiki/Backend)** — pourquoi Supabase, configuration des tables, gestion des emails UQAC
- **[Fonctionnement des parties](https://github.com/miel-uqac/basket/wiki/Fonctionnement-des-parties)** — cycle de vie d'une partie, système de tokens, temps réel

## État du projet

Le site est fonctionnel mais certaines limitations existent, notamment l'absence de sécurité côté base de données (pas de Row Level Security). Ces points sont documentés dans la page [Misc](https://github.com/miel-uqac/basket/wiki/Misc) du wiki.
