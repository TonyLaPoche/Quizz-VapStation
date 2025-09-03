// Logique principale du quiz
class QuizEngine {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questions = [];
        this.startTime = null;
        this.selectedMode = null;
        this.isAnswering = false;
    }

    // Initialiser un nouveau quiz
    startQuiz(mode, questionsCount = 10) {
        this.selectedMode = mode;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.isAnswering = false;

        // Générer les questions selon le mode
        this.questions = this.generateQuestions(mode, questionsCount);
        
        if (this.questions.length === 0) {
            throw new Error('Aucune question générée pour ce mode');
        }

        this.currentQuiz = {
            mode: mode,
            modeName: this.getModeDisplayName(mode),
            totalQuestions: this.questions.length,
            startTime: this.startTime
        };

        return this.getCurrentQuestion();
    }

    // Générer les questions selon le mode
    generateQuestions(mode, count) {
        let products = [];
        
        switch (mode) {
            case 'savage':
            case 'inca':
            case 'pupille':
            case 'elfes':
                products = getProductsByRange(mode);
                break;
            case 'mixed':
                // Mélanger toutes les gammes
                const ranges = ['savage', 'inca', 'pupille', 'elfes'];
                ranges.forEach(range => {
                    products = products.concat(getProductsByRange(range));
                });
                break;
            case 'all':
                products = getAllProducts();
                break;
            default:
                throw new Error('Mode de quiz non reconnu');
        }

        if (products.length === 0) {
            return [];
        }

        // Sélectionner des produits aléatoirement
        const selectedProducts = getRandomProducts(products, count);
        const allFlavors = getAllFlavors();

        // Générer les questions
        return selectedProducts.map((product, index) => {
            // Choisir un arôme principal aléatoirement
            const correctFlavor = product.flavors[Math.floor(Math.random() * product.flavors.length)];
            
            // Générer les choix de réponses
            const answerChoices = generateAnswerChoices(correctFlavor, allFlavors, 4);

            return {
                id: index + 1,
                product: product,
                question: "Quel est l'arôme principal de ce e-liquide ?",
                correctAnswer: correctFlavor,
                choices: answerChoices,
                answered: false,
                selectedAnswer: null,
                isCorrect: false
            };
        });
    }

    // Obtenir la question actuelle
    getCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            return null;
        }
        return this.questions[this.currentQuestionIndex];
    }

    // Répondre à une question
    answerQuestion(selectedAnswer) {
        if (this.isAnswering) {
            return null; // Éviter les réponses multiples
        }

        const currentQuestion = this.getCurrentQuestion();
        if (!currentQuestion) {
            return null;
        }

        this.isAnswering = true;
        currentQuestion.answered = true;
        currentQuestion.selectedAnswer = selectedAnswer;
        currentQuestion.isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        if (currentQuestion.isCorrect) {
            this.score++;
        }

        return {
            isCorrect: currentQuestion.isCorrect,
            correctAnswer: currentQuestion.correctAnswer,
            selectedAnswer: selectedAnswer,
            explanation: this.getAnswerExplanation(currentQuestion)
        };
    }

    // Passer à la question suivante
    nextQuestion() {
        this.isAnswering = false;
        this.currentQuestionIndex++;
        return this.getCurrentQuestion();
    }

    // Vérifier si le quiz est terminé
    isQuizComplete() {
        return this.currentQuestionIndex >= this.questions.length;
    }

    // Obtenir les résultats finaux
    getResults() {
        const endTime = Date.now();
        const duration = Math.round((endTime - this.startTime) / 1000);

        const results = {
            mode: this.selectedMode,
            modeName: this.currentQuiz.modeName,
            score: this.score,
            totalQuestions: this.questions.length,
            percentage: Math.round((this.score / this.questions.length) * 100),
            duration: duration,
            questions: this.questions,
            completedAt: new Date().toISOString()
        };

        // Sauvegarder les résultats
        storage.saveQuizResult(results);

        return results;
    }

    // Obtenir le nom d'affichage du mode
    getModeDisplayName(mode) {
        const modeNames = {
            'savage': 'Gamme Savage',
            'inca': 'Gamme Inca',
            'pupille': 'Gamme Pupille',
            'elfes': 'Gamme Elfes',
            'mixed': 'Quiz Mélangé',
            'all': 'Toutes les Gammes'
        };
        return modeNames[mode] || mode;
    }

    // Obtenir une explication pour la réponse
    getAnswerExplanation(question) {
        const product = question.product;
        const flavors = product.flavors.join(', ');
        
        if (question.isCorrect) {
            return `Correct ! ${product.name} contient bien : ${flavors}`;
        } else {
            return `La bonne réponse était "${question.correctAnswer}". ${product.name} contient : ${flavors}`;
        }
    }

    // Obtenir les statistiques de progression
    getProgress() {
        return {
            currentQuestion: this.currentQuestionIndex + 1,
            totalQuestions: this.questions.length,
            score: this.score,
            percentage: this.questions.length > 0 ? Math.round((this.score / this.questions.length) * 100) : 0
        };
    }

    // Redémarrer le quiz avec les mêmes paramètres
    restart() {
        if (this.currentQuiz) {
            return this.startQuiz(this.selectedMode, this.questions.length);
        }
        return null;
    }

    // Obtenir des conseils basés sur les performances
    getPerformanceTips(percentage) {
        if (percentage >= 90) {
            return {
                title: "🏆 Excellent !",
                message: "Vous maîtrisez parfaitement cette gamme !",
                color: "#10b981"
            };
        } else if (percentage >= 70) {
            return {
                title: "👍 Très bien !",
                message: "Bonne connaissance, continuez comme ça !",
                color: "#059669"
            };
        } else if (percentage >= 50) {
            return {
                title: "📚 Pas mal !",
                message: "Il y a encore quelques arômes à réviser.",
                color: "#f59e0b"
            };
        } else {
            return {
                title: "💪 À améliorer",
                message: "Prenez le temps de réviser cette gamme.",
                color: "#ef4444"
            };
        }
    }
}

// Gestionnaire des écrans et navigation
class ScreenManager {
    constructor() {
        this.currentScreen = 'home-screen';
        this.screens = ['home-screen', 'quiz-screen', 'results-screen', 'history-screen'];
    }

    showScreen(screenId) {
        // Masquer tous les écrans
        this.screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) {
                element.classList.remove('active');
            }
        });

        // Afficher l'écran demandé
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}

// Gestionnaire des effets sonores (optionnel)
class SoundManager {
    constructor() {
        this.enabled = true;
        this.sounds = {};
    }

    // Jouer un son de succès
    playSuccess() {
        if (this.enabled) {
            this.playBeep(800, 100);
        }
    }

    // Jouer un son d'erreur
    playError() {
        if (this.enabled) {
            this.playBeep(300, 200);
        }
    }

    // Générer un bip simple
    playBeep(frequency, duration) {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Instances globales
const quizEngine = new QuizEngine();
const screenManager = new ScreenManager();
const soundManager = new SoundManager();
