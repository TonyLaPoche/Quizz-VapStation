// Application principale - Gestion de l'interface utilisateur
class VapQuizApp {
    constructor() {
        this.init();
    }

    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Boutons du menu principal
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.getAttribute('data-mode');
                this.startQuiz(mode);
            });
        });

        // Bouton historique
        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showHistory());
        }

        // Bouton à propos
        const aboutBtn = document.getElementById('about-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => this.showAbout());
        }

        // Bouton liste des produits
        const productsBtn = document.getElementById('products-btn');
        if (productsBtn) {
            productsBtn.addEventListener('click', () => this.showProducts());
        }

        // Bouton d'installation PWA
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installPWA());
        }

        // Boutons de navigation
        const backToHome = document.getElementById('back-to-home');
        if (backToHome) {
            backToHome.addEventListener('click', () => this.showHome());
        }

        const backFromHistory = document.getElementById('back-from-history');
        if (backFromHistory) {
            backFromHistory.addEventListener('click', () => this.showHome());
        }

        const backFromAbout = document.getElementById('back-from-about');
        if (backFromAbout) {
            backFromAbout.addEventListener('click', () => this.showHome());
        }

        const backFromProducts = document.getElementById('back-from-products');
        if (backFromProducts) {
            backFromProducts.addEventListener('click', () => this.showHome());
        }

        // Boutons de résultats
        const restartQuiz = document.getElementById('restart-quiz');
        if (restartQuiz) {
            restartQuiz.addEventListener('click', () => this.restartCurrentQuiz());
        }

        const backToMenu = document.getElementById('back-to-menu');
        if (backToMenu) {
            backToMenu.addEventListener('click', () => this.showHome());
        }

        // Bouton effacer historique
        const clearHistory = document.getElementById('clear-history');
        if (clearHistory) {
            clearHistory.addEventListener('click', () => this.clearHistory());
        }

        // Initialiser l'affichage
        this.showHome();
    }

    // Démarrer un quiz
    startQuiz(mode) {
        try {
            // Nettoyer les animations précédentes
            const scoreCircle = document.querySelector('.score-circle');
            if (scoreCircle) {
                scoreCircle.classList.remove('perfect-score');
            }
            
            // Adapter le nombre de questions selon le mode
            let questionsCount = 10;
            if (mode === 'all') {
                // Pour "Toutes les Gammes", utiliser tous les produits disponibles
                questionsCount = getAllProducts().length;
            } else if (mode === 'mixed') {
                // Pour "Quiz Mélangé", garder 10 questions (2-3 par gamme)
                questionsCount = 10;
            }

            const question = quizEngine.startQuiz(mode, questionsCount);
            screenManager.showScreen('quiz-screen');
            this.displayQuestion(question);
            this.updateQuizProgress();
        } catch (error) {
            console.error('Erreur lors du démarrage du quiz:', error);
            alert('Erreur lors du démarrage du quiz. Veuillez réessayer.');
        }
    }

    // Afficher une question
    displayQuestion(question) {
        if (!question) {
            this.showResults();
            return;
        }

        const questionText = document.getElementById('question-text');
        const productName = document.getElementById('product-name');
        const productRange = document.getElementById('product-range');
        const answersContainer = document.getElementById('answers-container');

        if (questionText) questionText.textContent = question.question;
        
        // Afficher le nom du produit
        if (productName) productName.textContent = question.product.name;
        
        if (productRange) {
            if (question.product.range) {
                const range = vapStationData[question.product.range];
                productRange.textContent = range.name;
                productRange.style.color = range.color;
            } else {
                productRange.textContent = 'Gamme inconnue';
            }
        }

        // Générer les choix de réponse (checkboxes pour choix multiples)
        if (answersContainer) {
            answersContainer.innerHTML = '';
            
            if (question.isMultipleChoice) {
                // Ajouter un bouton de validation
                const validateBtn = document.createElement('button');
                validateBtn.className = 'validate-btn';
                validateBtn.textContent = 'Valider mes réponses';
                validateBtn.disabled = true;
                validateBtn.addEventListener('click', () => this.validateMultipleChoice());
                
                question.choices.forEach((choice, index) => {
                    const choiceContainer = document.createElement('div');
                    choiceContainer.className = 'choice-container';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `choice-${index}`;
                    checkbox.value = choice;
                    checkbox.addEventListener('change', () => this.updateValidateButton(validateBtn));
                    
                    const label = document.createElement('label');
                    label.htmlFor = `choice-${index}`;
                    label.textContent = choice;
                    
                    choiceContainer.appendChild(checkbox);
                    choiceContainer.appendChild(label);
                    answersContainer.appendChild(choiceContainer);
                });
                
                answersContainer.appendChild(validateBtn);
            } else {
                // Boutons simples pour choix unique (si jamais)
                question.choices.forEach((choice, index) => {
                    const button = document.createElement('button');
                    button.className = 'answer-btn';
                    button.textContent = choice;
                    button.addEventListener('click', () => this.selectAnswer([choice], button));
                    answersContainer.appendChild(button);
                });
            }
        }
    }

    // Sélectionner une réponse (pour choix unique - rarement utilisé maintenant)
    selectAnswer(answers, buttonElement) {
        const result = quizEngine.answerQuestion(answers);
        if (!result) return;

        this.showAnswerFeedback(result);
        this.proceedToNextQuestion();
    }

    // Valider les choix multiples
    validateMultipleChoice() {
        const checkboxes = document.querySelectorAll('#answers-container input[type="checkbox"]:checked');
        const selectedAnswers = Array.from(checkboxes).map(cb => cb.value);
        
        if (selectedAnswers.length === 0) {
            alert('Veuillez sélectionner au moins une réponse.');
            return;
        }

        const result = quizEngine.answerQuestion(selectedAnswers);
        if (!result) return;

        this.showAnswerFeedback(result);
        this.proceedToNextQuestion();
    }

    // Mettre à jour le bouton de validation selon les sélections
    updateValidateButton(validateBtn) {
        const checkedBoxes = document.querySelectorAll('#answers-container input[type="checkbox"]:checked');
        validateBtn.disabled = checkedBoxes.length === 0;
    }

    // Afficher le feedback de la réponse
    showAnswerFeedback(result) {
        // Désactiver toutes les interactions
        const checkboxes = document.querySelectorAll('#answers-container input[type="checkbox"]');
        const validateBtn = document.querySelector('.validate-btn');
        
        checkboxes.forEach(cb => cb.disabled = true);
        if (validateBtn) validateBtn.disabled = true;

        // Marquer les réponses correctes et incorrectes
        checkboxes.forEach(cb => {
            const container = cb.parentElement;
            if (result.correctAnswers.includes(cb.value)) {
                container.classList.add('correct');
            }
            if (result.selectedAnswers.includes(cb.value) && !result.correctAnswers.includes(cb.value)) {
                container.classList.add('incorrect');
            }
        });

        // Son de feedback
        if (result.isCorrect) {
            soundManager.playSuccess();
        } else {
            soundManager.playError();
        }

        // Mettre à jour le score
        this.updateQuizProgress();
    }

    // Passer à la question suivante
    proceedToNextQuestion() {
        setTimeout(() => {
            const nextQuestion = quizEngine.nextQuestion();
            this.displayQuestion(nextQuestion);
        }, 2000);
    }

    // Mettre à jour la progression du quiz
    updateQuizProgress() {
        const progress = quizEngine.getProgress();
        
        const currentQuestion = document.getElementById('current-question');
        const totalQuestions = document.getElementById('total-questions');
        const currentScore = document.getElementById('current-score');

        if (currentQuestion) currentQuestion.textContent = progress.currentQuestion;
        if (totalQuestions) totalQuestions.textContent = progress.totalQuestions;
        if (currentScore) currentScore.textContent = progress.score;
    }

    // Afficher les résultats
    showResults() {
        const results = quizEngine.getResults();
        screenManager.showScreen('results-screen');

        const finalScore = document.getElementById('final-score');
        const finalTotal = document.getElementById('final-total');
        const scorePercentage = document.getElementById('score-percentage');
        const scoreMessage = document.getElementById('score-message');

        if (finalScore) finalScore.textContent = results.score;
        if (finalTotal) finalTotal.textContent = results.totalQuestions;
        if (scorePercentage) scorePercentage.textContent = results.percentage + '%';

        // Message personnalisé selon le score
        const tips = quizEngine.getPerformanceTips(results.percentage);
        if (scoreMessage) {
            scoreMessage.textContent = tips.message;
            scoreMessage.style.color = tips.color;
        }

        // Mettre à jour la couleur du cercle de score
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.style.background = `linear-gradient(135deg, ${tips.color}, ${tips.color}dd)`;
            
            // Animation spéciale pour score parfait
            if (results.percentage === 100) {
                scoreCircle.classList.add('perfect-score');
                // Déclencher les confettis et le son après un petit délai
                setTimeout(() => {
                    this.triggerConfetti();
                    this.playSuccessSound();
                }, 500);
            }
        }
    }

    // Redémarrer le quiz actuel
    restartCurrentQuiz() {
        // Nettoyer les animations précédentes
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.classList.remove('perfect-score');
        }
        
        const question = quizEngine.restart();
        if (question) {
            screenManager.showScreen('quiz-screen');
            this.displayQuestion(question);
            this.updateQuizProgress();
        }
    }

    // Afficher l'écran d'accueil
    showHome() {
        screenManager.showScreen('home-screen');
    }

    // Afficher l'historique
    showHistory() {
        screenManager.showScreen('history-screen');
        this.updateHistoryDisplay();
    }

    // Afficher la section À propos
    showAbout() {
        screenManager.showScreen('about-screen');
    }

    // Afficher la liste des produits
    showProducts() {
        screenManager.showScreen('products-screen');
        this.updateProductsList();
    }

    // Mettre à jour l'affichage de l'historique
    updateHistoryDisplay() {
        const stats = storage.getStats();
        const history = storage.getHistory();

        // Statistiques globales
        const totalGames = document.getElementById('total-games');
        const averageScore = document.getElementById('average-score');
        const bestScore = document.getElementById('best-score');

        if (totalGames) totalGames.textContent = stats.totalGames;
        if (averageScore) averageScore.textContent = stats.averageScore + '%';
        if (bestScore) bestScore.textContent = stats.bestScore + '%';

        // Statistiques par gamme
        this.updateRangeStats(stats.rangeStats);

        // Liste de l'historique
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = '';

            if (history.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'history-empty';
                emptyMessage.innerHTML = `
                    <p style="text-align: center; color: #6b7280; padding: 2rem;">
                        📊 Aucun quiz joué pour le moment.<br>
                        Commencez votre premier quiz !
                    </p>
                `;
                historyList.appendChild(emptyMessage);
                return;
            }

            history.forEach(result => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const date = new Date(result.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                historyItem.innerHTML = `
                    <div class="history-date">${date}</div>
                    <div class="history-details">
                        <div class="history-mode">${result.modeName}</div>
                        <div class="history-score">${result.score}/${result.totalQuestions} (${result.percentage}%)</div>
                    </div>
                `;

                historyList.appendChild(historyItem);
            });
        }
    }

    // Mettre à jour l'affichage des statistiques par gamme
    updateRangeStats(rangeStats) {
        const rangeStatsGrid = document.getElementById('range-stats-grid');
        const rangeStatsSection = document.getElementById('range-stats');
        
        if (!rangeStatsGrid) return;

        // Masquer la section si aucune donnée
        if (!rangeStats || Object.keys(rangeStats).length === 0) {
            if (rangeStatsSection) rangeStatsSection.style.display = 'none';
            return;
        }

        // Afficher la section
        if (rangeStatsSection) rangeStatsSection.style.display = 'block';

        // Vider le contenu existant
        rangeStatsGrid.innerHTML = '';

        // Créer les statistiques pour chaque gamme
        Object.keys(rangeStats).forEach(rangeKey => {
            const rangeData = rangeStats[rangeKey];
            
            const rangeStatItem = document.createElement('div');
            rangeStatItem.className = 'range-stat-item';
            rangeStatItem.style.borderLeftColor = rangeData.color;

            rangeStatItem.innerHTML = `
                <div class="range-stat-header">
                    <span class="range-stat-icon">${rangeData.icon}</span>
                    <span>${rangeData.name}</span>
                </div>
                <div class="range-stat-percentage" style="color: ${rangeData.color}">
                    ${rangeData.averageScore}%
                </div>
                <div class="range-stat-games">
                    ${rangeData.games} quiz${rangeData.games > 1 ? 's' : ''}
                </div>
            `;

            rangeStatsGrid.appendChild(rangeStatItem);
        });
    }

    // Mettre à jour l'affichage de la liste des produits
    updateProductsList() {
        const productsList = document.getElementById('products-list');
        if (!productsList) return;

        productsList.innerHTML = '';

        // Parcourir chaque gamme
        Object.keys(vapStationData).forEach(rangeKey => {
            const range = vapStationData[rangeKey];
            
            const rangeSection = document.createElement('div');
            rangeSection.className = 'range-section';

            const rangeHeader = document.createElement('div');
            rangeHeader.className = 'range-header';
            rangeHeader.style.borderLeftColor = range.color;

            rangeHeader.innerHTML = `
                <span class="range-icon">${range.icon}</span>
                <h3 class="range-title">${range.name}</h3>
                <span class="range-count">${range.products.length} produits</span>
            `;

            const productsGrid = document.createElement('div');
            productsGrid.className = 'products-grid';

            range.products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';

                const flavorTags = product.flavors.map(flavor => 
                    `<span class="flavor-tag">${flavor}</span>`
                ).join('');

                productItem.innerHTML = `
                    <div class="product-name">${product.name}</div>
                    <div class="product-flavors">${flavorTags}</div>
                `;

                productsGrid.appendChild(productItem);
            });

            rangeSection.appendChild(rangeHeader);
            rangeSection.appendChild(productsGrid);
            productsList.appendChild(rangeSection);
        });
    }

    // Effacer l'historique
    clearHistory() {
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ? Cette action est irréversible.')) {
            storage.clearHistory();
            this.updateHistoryDisplay();
            alert('Historique effacé avec succès !');
        }
    }

    // Installer la PWA manuellement
    installPWA() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('🎉 Utilisateur a accepté l\'installation');
                } else {
                    console.log('❌ Utilisateur a refusé l\'installation');
                }
                window.deferredPrompt = null;
                this.hideInstallButton();
            });
        } else {
            alert('L\'installation n\'est pas disponible. Utilisez le menu de votre navigateur pour "Ajouter à l\'écran d\'accueil".');
        }
    }

    // Afficher le bouton d'installation
    showInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    }

    // Masquer le bouton d'installation
    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    // Déclencher l'animation de confettis pour un score parfait
    triggerConfetti() {
        // Créer le conteneur de confettis
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);

        const colors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
            '#e67e22', '#1abc9c', '#e91e63', '#ff5722', '#795548',
            '#607d8b', '#ffeb3b', '#4caf50', '#ff9800', '#673ab7',
            '#009688', '#f44336', '#2196f3', '#8bc34a', '#ffc107'
        ];

        const shapes = ['square', 'circle'];
        const animations = ['confetti-1', 'confetti-2', 'confetti-3', 'confetti-4', 'confetti-5'];

        // Créer 100 confettis pour un effet encore plus spectaculaire
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Forme aléatoire
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.classList.add(randomShape);
            
            // Animation aléatoire
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            confetti.classList.add(randomAnimation);
            
            // Couleur aléatoire
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = randomColor;
            
            // Position de départ aléatoire sur toute la largeur
            confetti.style.left = Math.random() * 100 + '%';
            
            // Position initiale complètement hors écran
            confetti.style.top = '-120px';
            
            // Taille légèrement variée
            const size = Math.random() * 4 + 6; // Entre 6px et 10px
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            // Délai aléatoire pour étaler l'animation sur plus de temps
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            confettiContainer.appendChild(confetti);
        }

        // Supprimer le conteneur après l'animation (temps doublé)
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 10000);
    }

    // Jouer le son de succès pour score parfait
    playSuccessSound() {
        try {
            const audio = new Audio('./sound/success-fanfare-trumpets-6185.mp3');
            audio.volume = 0.7; // Volume à 70% pour ne pas être trop fort
            
            // Jouer le son
            const playPromise = audio.play();
            
            // Gérer les navigateurs qui bloquent l'autoplay
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('🔊 Son de succès joué !');
                    })
                    .catch(error => {
                        console.log('⚠️ Impossible de jouer le son (autoplay bloqué):', error);
                        // Le son ne joue pas mais l'animation continue
                    });
            }
        } catch (error) {
            console.log('⚠️ Erreur lors du chargement du son:', error);
            // Continuer sans son en cas d'erreur
        }
    }

    // Gérer les erreurs globales
    handleError(error, context = '') {
        console.error(`Erreur dans ${context}:`, error);
        
        // Afficher un message d'erreur à l'utilisateur
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        errorMessage.textContent = `Erreur: ${error.message || 'Une erreur inattendue s\'est produite'}`;
        
        document.body.appendChild(errorMessage);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            if (document.body.contains(errorMessage)) {
                document.body.removeChild(errorMessage);
            }
        }, 5000);
    }
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur JavaScript:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejetée:', event.reason);
});

// Initialiser l'application
const app = new VapQuizApp();

// Vérifier la compatibilité du navigateur
if (!storage.isAvailable()) {
    alert('Attention: Le stockage local n\'est pas disponible. Vos scores ne seront pas sauvegardés.');
}

// Service Worker pour PWA (si disponible)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Quizz-VapStation/sw.js')
            .then(registration => {
                console.log('✅ Service Worker enregistré avec succès:', registration.scope);
                
                // Écouter les mises à jour
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Nouvelle version du Service Worker disponible');
                });
                
                // Vérifier périodiquement les mises à jour
                setInterval(() => {
                    registration.update();
                }, 60000); // Vérifier toutes les minutes
            })
            .catch(registrationError => {
                console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', registrationError);
            });
    });

    // Écouter les messages du Service Worker
    navigator.serviceWorker.addEventListener('message', event => {
        console.log('📩 Message du Service Worker:', event.data);
        if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('🔄 Cache mis à jour, rechargement de la page...');
            window.location.reload();
        }
    });
    
    // Détecter quand l'app est prête à être installée
    window.deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('📱 Application prête à être installée');
        e.preventDefault();
        window.deferredPrompt = e;
        
        // Afficher le bouton d'installation personnalisé
        app.showInstallButton();
    });
    
    // Détecter quand l'app a été installée
    window.addEventListener('appinstalled', (evt) => {
        console.log('🎉 Application installée avec succès !');
        app.hideInstallButton();
    });
}
