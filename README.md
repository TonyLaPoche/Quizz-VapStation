# 🧪 Vap'Station Quiz

Une application mobile-first pour réviser les e-liquides des gammes Vap'Station.

## 📱 Fonctionnalités

### 🎯 **Modes de quiz**
- **Quiz par gamme** : Révisez spécifiquement Savage, Inca, Pupille ou Elfes
- **Quiz mélangé** : 10 questions équilibrées de toutes les gammes
- **Quiz complet** : Tous les 25 produits pour un test exhaustif

### 📊 **Suivi avancé**
- **Historique détaillé** : 50 derniers quiz avec dates et scores
- **Statistiques par gamme** : Identifiez vos points forts et faibles
- **Progression globale** : Moyenne générale et meilleur score

### 🎮 **Expérience utilisateur**
- **Quiz à choix multiples** : Sélectionnez tous les arômes corrects
- **Feedback immédiat** : Corrections détaillées avec explications
- **Interface intuitive** : Navigation fluide et responsive

### 📋 **Informations complètes**
- **Catalogue des produits** : Liste détaillée par gamme avec arômes
- **Section À propos** : Explication du projet et guide d'utilisation
- **RGPD compliant** : Données 100% locales, aucune transmission

### 🔧 **Technique**
- **PWA** : Installable sur mobile, fonctionne hors ligne
- **Mobile-first** : Interface optimisée pour smartphones
- **Données réelles** : Basé sur les vrais produits du site vapstation.com

## 🎮 Comment jouer

1. **Choisissez votre mode** : Par gamme, mélangé ou complet
2. **Lisez la question** : "Quels arômes sont dans [Produit] ?"
3. **Sélectionnez tous les arômes corrects** avec les cases à cocher
4. **Validez vos réponses** et consultez les corrections
5. **Suivez votre progression** dans l'historique

## 🏆 Système de scoring

- **90%+ :** 🏆 Excellent ! Vous maîtrisez parfaitement cette gamme
- **70-89% :** 👍 Très bien ! Bonne connaissance
- **50-69% :** 📚 Pas mal ! Il y a encore quelques arômes à réviser
- **<50% :** 💪 À améliorer - Prenez le temps de réviser cette gamme

## 🗂️ Gammes disponibles

### 🔥 Savage (7 produits)
E-liquides intenses et puissants : Rhino, King, Aquila, Baghera, Zephyros, Gazelia, Mangabey, Venom.

### 🌿 Inca (8 produits)  
E-liquides premium aux saveurs complexes : Saca, Maya, Amaru, Supay, Manco, Cuzco, Pacha, Killa.

### 👁️ Pupille (4 produits)
E-liquides surprenants et innovants : Dulce, Unico, Napoli, Hazel.

### 🧝‍♀️ Elfes (4 produits)
E-liquides magiques et envoûtants : Lyra, Nayla, Ragnar, Sylas.

## 🔒 Confidentialité et RGPD

### ✅ **100% Conforme RGPD**
- **Stockage local uniquement** : Toutes vos données restent sur votre appareil
- **Aucune transmission** : Rien n'est envoyé vers des serveurs externes
- **Pas de cookies** : Aucun traceur ou cookie publicitaire
- **Anonymat total** : Aucune information personnelle collectée
- **Contrôle total** : Effacez vos données à tout moment

### 📦 **Données stockées localement**
- Résultats de vos quiz (scores, dates, modes)
- Statistiques de performance par gamme
- Préférences d'affichage

*Ces données sont dans le localStorage de votre navigateur et ne quittent jamais votre appareil.*

## 🚀 Installation

### Utilisation directe
Ouvrez simplement `index.html` dans votre navigateur.

### Installation comme PWA
1. Visitez l'application dans votre navigateur mobile
2. Ajoutez à l'écran d'accueil quand proposé
3. Utilisez comme une app native !

### Déploiement GitHub Pages
1. Forkez ce repository
2. Activez GitHub Pages dans les paramètres
3. Votre quiz sera accessible à `https://votre-username.github.io/Quizz-VapStation`

## 🛠️ Structure technique

```
Quizz-VapStation/
├── index.html          # Page principale avec toutes les sections
├── manifest.json       # Configuration PWA
├── sw.js              # Service Worker (cache hors ligne)
├── styles/
│   └── main.css       # Styles responsive et animations
└── js/
    ├── app.js         # Application principale et navigation
    ├── quiz.js        # Moteur de quiz et gestion des écrans
    ├── data.js        # Base de données des 25 produits
    └── storage.js     # Gestion du stockage local et RGPD
```

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique et accessibilité
- **CSS3** : Design responsive, animations et thèmes
- **JavaScript ES6+** : Logique applicative moderne
- **PWA** : Service Worker et manifest pour l'installation
- **LocalStorage** : Persistance des données côté client

## 📊 Données des produits

Les données des e-liquides sont stockées dans `js/data.js` avec :
- **25 produits réels** de Vap'Station
- **4 gammes complètes** : Savage, Inca, Pupille, Elfes
- **Arômes détaillés** pour chaque produit
- **Métadonnées** : couleurs, icônes, descriptions

## 🎯 Cas d'usage

### 👨‍💼 **Professionnels de la vape**
- Maîtriser le catalogue pour conseiller les clients
- Identifier rapidement les produits adaptés
- Développer son expertise produit

### 🎓 **Formation et apprentissage**
- Réviser avant les examens ou certifications
- S'entraîner de manière ludique et interactive
- Suivre sa progression avec des statistiques détaillées

### 📱 **Utilisation mobile**
- Réviser pendant les pauses
- Accès hors ligne partout
- Interface optimisée pour smartphone

## 🤝 Contribution

Pour ajouter des produits ou corriger des informations :
1. Éditez `js/data.js`
2. Respectez la structure existante
3. Testez localement
4. Soumettez une pull request

## 📄 Licence

Ce projet est libre d'utilisation pour l'apprentissage et la révision des produits Vap'Station.

---

**© 2025 [Antoine Terrade](https://antoineterrade.com) - Développé avec ❤️ pour la communauté vape**