# 🍺 Beer Clicker

Un jeu type "Cookie Clicker" sur le thème de la bière, développé en React + Vite.

---

## 🚀 Installation

```bash
# Ouvrir votre navigateur à l'adresse suivante :
https://beer-clicker-three.vercel.app/
```

---

## 🎮 Fonctionnalités

### Système de jeu principal

- **Clic sur la bière** — Cliquez sur la pinte pour gagner des bières. La bière évolue visuellement en 5 étapes selon votre progression (Pinte basique → Ambrée artisanale → IPA premium → Lager dorée XL → Bière légendaire).
- **Production automatique** — 8 types d'améliorations auto-production : Tire-bouchon, Grand-mère brasseuse, Champ de houblon, Micro-brasserie, Méga-brasserie, Pub franchisé, Abbaye brassicole, Portail de bière cosmique.
- **Multiplicateurs de clic** — 4 niveaux : Double pression (+1), Jitter Click (+5), Tireuse turbo (+25), Cascade de houblon (+100).
- **Système de combo** — Les clics rapides génèrent un multiplicateur qui augmente les gains.

### Événements spéciaux

- **Bière dorée** 🌟 — Une bière dorée apparaît aléatoirement (toutes les 30s à 2min). Récompenses possibles : Jackpot, Mini bonus, Frénésie (×7), Doigts magiques (×10).
- **Festivals de bière** 🎪 — 4 événements temporaires qui se déclenchent périodiquement :
  - 🎪 **Oktoberfest** — Production ×3 pendant 30s
  - ☘️ **St. Patrick** — Clics ×5 pendant 20s
  - 🍺 **Fête de la Bière** — Tout ×2 pendant 45s
  - 🕐 **Happy Hour** — Réductions de 50% sur les achats pendant 30s

### Prestige ⭐

- Réinitialisez votre progression après 1M de bières totales pour un bonus permanent de +5% de production par niveau de prestige.

### Succès 🏆

- 20 succès déblocables répartis en catégories :
  - **Clics** — Première gorgée, Habitué du bar, Barman pro, Légende du clic
  - **Bières** — Première pinte, Premier fût, Patron de brasserie, Baron de la bière, Empereur de la bière
  - **Améliorations** — Premier investissement, Collectionneur, Magnat de la bière, Empire brassicole
  - **Spéciaux** — Combos (x5, x10, x20), Bières dorées, Festivals, Prestige

### Système d'utilisateurs 👤

- **Écran de connexion** — Choisissez un nom d'utilisateur pour commencer.
- **Sauvegarde par joueur** — Chaque joueur a sa propre sauvegarde dans le `localStorage`.
- **Chargement de partie** — Retrouvez vos parties sauvegardées sur l'écran de connexion.
- **Gains hors-ligne** — Récupérez les bières produites pendant votre absence.

### Rôles et administration 🛠️

- **Mode Joueur** 🎮 — Accès standard au jeu.
- **Mode Admin** 🛠️ — Protégé par mot de passe, donne accès au panneau d'administration :
  - Ajout rapide de bières (préréglages : +100, +1K, +10K, +100K, +1M)
  - Montant personnalisé
  - Gestion des joueurs : modifier/remettre à zéro/supprimer les sauvegardes des autres joueurs

> **Compte admin par défaut** : Un utilisateur `admin` (rôle Admin) est créé automatiquement au premier lancement. Il apparaît dans les parties sauvegardées. Mot de passe admin : `admin123`.

### Classement 🏆

- Classement de tous les joueurs trié par nombre total de bières.
- Médailles 🥇🥈🥉 pour le top 3.
- Affichage du niveau de prestige.

### Paramètres ⚙️

- **Export/Import** — Exportez votre sauvegarde en texte encodé ou importez-en une.
- **Remise à zéro** — Réinitialisez entièrement votre progression.
- **Statistiques détaillées** — Temps de jeu, bières totales, clics totaux, par seconde, par clic, améliorations, succès, prestige, festivals, bières dorées.
- **Raccourcis clavier** — `Espace` pour cliquer, `A` pour les succès, `S` pour les paramètres, `L` pour le classement.

### Effets visuels 🎨

- **Bulles animées** — Arrière-plan avec des bulles de bière flottantes.
- **Thème brasserie** — Interface sombre avec tons bruns, ambrés et dorés rappelant un pub.
- **Animations** — Effets de clic (+1), combos, bière dorée, transitions fluides.

---

## 🏗️ Architecture du projet

```
src/
├── main.jsx                    # Point d'entrée React
├── layouts/
│   └── App.jsx                 # Composant principal (auth + logique de jeu)
├── components/
│   ├── LoginScreen.jsx         # Écran de connexion
│   ├── CookieButton.jsx        # Bouton bière cliquable + évolution visuelle
│   ├── Stats.jsx               # Panneau statistiques (bières, par clic, par seconde)
│   ├── UpgradeList.jsx         # Liste des améliorations (brassage + tireuses)
│   ├── PrestigePanel.jsx       # Panneau prestige
│   ├── Achievements.jsx        # Modal succès (20 succès)
│   ├── GoldenBeer.jsx          # Bière dorée aléatoire
│   ├── FestivalEvent.jsx       # Événements festivals temporaires
│   ├── BubbleBackground.jsx    # Bulles d'arrière-plan animées
│   ├── AdminPanel.jsx          # Panneau admin (gestion cookies + joueurs)
│   ├── Leaderboard.jsx         # Modal classement
│   └── SettingsPanel.jsx       # Modal paramètres (export, import, stats, reset)
├── data/
│   ├── gameData.js             # Données de jeu (upgrades, multiplicateurs, stages, prestige)
│   └── features.js             # Succès, festivals, bière dorée
└── assets/
    ├── styles/
    │   ├── index.css           # Variables CSS globales (thème brasserie)
    │   └── App.css             # Styles de tous les composants
    └── images/
        └── beer_stage_[1-5].png  # 5 étapes d'évolution de la bière
```

---

## 🛠️ Technologies

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 19.2 | Framework UI |
| **Vite** | 7.3 | Build tool + dev server |
| **JavaScript** | ES2020+ | Logique applicative |
| **CSS** | Vanilla | Styles (glassmorphism, variables CSS) |
| **localStorage** | — | Persistance des données par utilisateur |

---

