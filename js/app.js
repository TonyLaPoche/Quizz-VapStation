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

        // Boutons de navigation
        const backToHome = document.getElementById('back-to-home');
        if (backToHome) {
            backToHome.addEventListener('click', () => this.showHome());
        }

        const backFromHistory = document.getElementById('back-from-history');
        if (backFromHistory) {
            backFromHistory.addEventListener('click', () => this.showHome());
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
            const question = quizEngine.startQuiz(mode, 10);
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

        // Générer les boutons de réponse
        if (answersContainer) {
            answersContainer.innerHTML = '';
            question.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = choice;
                button.addEventListener('click', () => this.selectAnswer(choice, button));
                answersContainer.appendChild(button);
            });
        }
    }

    // Sélectionner une réponse
    selectAnswer(answer, buttonElement) {
        if (quizEngine.isAnswering) return;

        const result = quizEngine.answerQuestion(answer);
        if (!result) return;

        // Désactiver tous les boutons
        const allButtons = document.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => {
            btn.classList.add('disabled');
            btn.style.pointerEvents = 'none';
        });

        // Marquer la réponse sélectionnée
        if (result.isCorrect) {
            buttonElement.classList.add('correct');
            soundManager.playSuccess();
        } else {
            buttonElement.classList.add('incorrect');
            // Marquer la bonne réponse
            allButtons.forEach(btn => {
                if (btn.textContent === result.correctAnswer) {
                    btn.classList.add('correct');
                }
            });
            soundManager.playError();
        }

        // Mettre à jour le score
        this.updateQuizProgress();

        // Passer à la question suivante après un délai
        setTimeout(() => {
            const nextQuestion = quizEngine.nextQuestion();
            this.displayQuestion(nextQuestion);
            
            // Réactiver les boutons pour la prochaine question
            setTimeout(() => {
                const newButtons = document.querySelectorAll('.answer-btn');
                newButtons.forEach(btn => {
                    btn.style.pointerEvents = 'auto';
                });
            }, 100);
        }, 1500);
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
        }
    }

    // Redémarrer le quiz actuel
    restartCurrentQuiz() {
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

    // Effacer l'historique
    clearHistory() {
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ? Cette action est irréversible.')) {
            storage.clearHistory();
            this.updateHistoryDisplay();
            alert('Historique effacé avec succès !');
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
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW enregistré:', registration);
            })
            .catch(registrationError => {
                console.log('Erreur SW:', registrationError);
            });
    });
}
