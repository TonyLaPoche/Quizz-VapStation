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
            case 'mixed': {
                const ranges = Object.keys(vapStationData);
                ranges.forEach(range => {
                    const rangeProducts = getProductsByRange(range);
                    const productsPerRange = Math.min(3, Math.ceil(count / ranges.length));
                    const selectedFromRange = getRandomProducts(rangeProducts, productsPerRange);
                    products = products.concat(selectedFromRange);
                });
                break;
            }
            case 'all':
                products = getAllProducts();
                break;
            default:
                if (vapStationData[mode]) {
                    products = getProductsByRange(mode);
                } else {
                    throw new Error('Mode de quiz non reconnu');
                }
        }

        if (products.length === 0) {
            return [];
        }

        // Sélectionner des produits aléatoirement
        const selectedProducts = getRandomProducts(products, count);
        const allFlavors = getAllFlavors();

        // Générer les questions - une question par produit pour tester tous ses arômes
        let questions = [];
        let questionId = 1;
        
        selectedProducts.forEach(product => {
            // Déterminer le nombre de choix selon le nombre d'arômes du produit
            const choiceCount = product.flavors.length === 1 ? 4 : Math.max(6, product.flavors.length + 2);
            
            // Générer les choix d'arômes (corrects + distracteurs)
            const flavorChoices = this.generateFlavorChoices(product.flavors, allFlavors, choiceCount);

            questions.push({
                id: questionId++,
                product: product,
                question: `Quels arômes sont dans ${product.name} ?`,
                correctAnswers: [...product.flavors], // Tous les arômes corrects
                choices: flavorChoices,
                isMultipleChoice: true,
                answered: false,
                selectedAnswers: [], // Tableau des réponses sélectionnées
                isCorrect: false
            });
        });

        // Mélanger les questions et limiter au nombre demandé
        questions = questions.sort(() => 0.5 - Math.random()).slice(0, count);
        
        return questions;
    }

    // Générer des choix d'arômes pour les questions à choix multiples
    generateFlavorChoices(correctFlavors, allFlavors, count = 6) {
        const choices = [...correctFlavors]; // Commencer avec tous les arômes corrects
        const otherFlavors = allFlavors.filter(flavor => !correctFlavors.includes(flavor));
        
        // Ajouter des arômes distracteurs aléatoirement
        while (choices.length < count && otherFlavors.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherFlavors.length);
            const flavor = otherFlavors.splice(randomIndex, 1)[0];
            choices.push(flavor);
        }
        
        // Mélanger les choix
        return choices.sort(() => 0.5 - Math.random());
    }

    // Obtenir la question actuelle
    getCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            return null;
        }
        return this.questions[this.currentQuestionIndex];
    }

    // Répondre à une question (choix multiples)
    answerQuestion(selectedAnswers) {
        const currentQuestion = this.getCurrentQuestion();
        if (!currentQuestion || currentQuestion.answered) {
            return null;
        }

        currentQuestion.answered = true;
        currentQuestion.selectedAnswers = Array.isArray(selectedAnswers) ? selectedAnswers : [selectedAnswers];
        
        // Vérifier si toutes les bonnes réponses sont sélectionnées et aucune mauvaise
        const correctSet = new Set(currentQuestion.correctAnswers);
        const selectedSet = new Set(currentQuestion.selectedAnswers);
        
        currentQuestion.isCorrect = 
            correctSet.size === selectedSet.size && 
            [...correctSet].every(answer => selectedSet.has(answer));

        if (currentQuestion.isCorrect) {
            this.score++;
        }

        return {
            isCorrect: currentQuestion.isCorrect,
            correctAnswers: currentQuestion.correctAnswers,
            selectedAnswers: currentQuestion.selectedAnswers,
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
        if (mode === 'mixed') return 'Quiz Mélangé';
        if (mode === 'all') return 'Quiz Complet';
        const range = vapStationData[mode];
        return range ? `Gamme ${range.name}` : mode;
    }

    // Obtenir une explication pour la réponse
    getAnswerExplanation(question) {
        const product = question.product;
        const correctFlavors = question.correctAnswers.join(', ');
        const selectedFlavors = question.selectedAnswers.join(', ');
        
        if (question.isCorrect) {
            return `Correct ! ${product.name} contient bien : ${correctFlavors}`;
        } else {
            const missing = question.correctAnswers.filter(f => !question.selectedAnswers.includes(f));
            const extra = question.selectedAnswers.filter(f => !question.correctAnswers.includes(f));
            
            let explanation = `Les bons arômes de ${product.name} sont : ${correctFlavors}. `;
            
            if (missing.length > 0) {
                explanation += `Vous avez oublié : ${missing.join(', ')}. `;
            }
            if (extra.length > 0) {
                explanation += `En trop : ${extra.join(', ')}.`;
            }
            
            return explanation;
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
        this.screens = ['home-screen', 'quiz-screen', 'results-screen', 'history-screen', 'about-screen', 'products-screen'];
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
