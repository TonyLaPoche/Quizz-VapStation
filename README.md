# 🧪 Vap Station Quiz

Une application mobile-first pour réviser les e-liquides des gammes Vap Station.

## 📱 Fonctionnalités

- **Quiz par gamme** : Révisez spécifiquement Savage, Inca, Pupille ou Elfes
- **Quiz mélangé** : Questions aléatoires de plusieurs gammes
- **Quiz complet** : Toutes les gammes ensemble
- **Historique** : Suivi de vos performances et progression
- **Scores** : Système de points avec pourcentages
- **Hors ligne** : Fonctionne sans connexion internet (PWA)
- **Mobile-first** : Interface optimisée pour smartphones
- **Données réelles** : Basé sur les vrais produits du site vapstation.com

## 🎮 Comment jouer

1. Choisissez votre mode de quiz
2. Lisez le nom du produit et sa gamme
3. Sélectionnez l'arôme principal correspondant
4. Consultez vos résultats et votre progression

## 🏆 Système de scoring

- **90%+ :** 🏆 Excellent ! Vous maîtrisez parfaitement cette gamme
- **70-89% :** 👍 Très bien ! Bonne connaissance
- **50-69% :** 📚 Pas mal ! Il y a encore quelques arômes à réviser
- **<50% :** 💪 À améliorer - Prenez le temps de réviser cette gamme

## 🗂️ Gammes disponibles

### 🔥 Savage (6 produits)
E-liquides intenses et puissants : Aquila, Baguera, Gazelia, King, Mangabey, Venom.

### 🌿 Inca (7 produits)  
E-liquides premium aux saveurs complexes : Amaru, Chacana, Cuzko, Killa, Manco, Maya, Pacha.

### 👁️ Pupille (6 produits)
E-liquides surprenants et innovants : Dulce, Iris, Luna, Nero, Opale, Saphir.

### 🧝‍♀️ Elfes (6 produits)
E-liquides magiques et envoûtants : Lyra, Nayla, Ragnar, Ravena, Sylas, Theron.

## 💾 Stockage local

L'application sauvegarde automatiquement :
- Votre historique de quiz (50 derniers)
- Vos statistiques globales
- Vos préférences utilisateur

Toutes les données restent sur votre appareil (aucun compte requis).

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
3. Votre quiz sera accessible à `https://votre-username.github.io/local-quizz`

## 🛠️ Structure technique

```
quizz-local/
├── index.html          # Page principale
├── manifest.json       # Configuration PWA
├── sw.js              # Service Worker (cache hors ligne)
├── styles/
│   └── main.css       # Styles responsive
└── js/
    ├── app.js         # Application principale
    ├── quiz.js        # Moteur de quiz
    ├── data.js        # Base de données des produits
    └── storage.js     # Gestion du stockage local
```

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design responsive et animations
- **JavaScript ES6+** : Logique applicative
- **PWA** : Service Worker et manifest
- **LocalStorage** : Persistance des données

## 📊 Données des produits

Les données des e-liquides sont stockées dans `js/data.js` et peuvent être facilement étendues pour ajouter :
- Nouveaux produits
- Nouvelles gammes
- Arômes supplémentaires
- Métadonnées produits

## 🤝 Contribution

Pour ajouter des produits ou corriger des informations :
1. Éditez `js/data.js`
2. Respectez la structure existante
3. Testez localement
4. Soumettez une pull request

## 📄 Licence

Ce projet est libre d'utilisation pour l'apprentissage et la révision des produits Vap Station.

---

Développé avec ❤️ pour les vapoteurs qui veulent maîtriser leur catalogue !
