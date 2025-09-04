// Gestion du stockage local pour l'historique et les scores
class LocalStorage {
    constructor() {
        this.HISTORY_KEY = 'vap-quiz-history';
        this.STATS_KEY = 'vap-quiz-stats';
    }

    // Sauvegarder un résultat de quiz
    saveQuizResult(result) {
        const history = this.getHistory();
        const newResult = {
            id: Date.now(),
            date: new Date().toISOString(),
            mode: result.mode,
            modeName: result.modeName,
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: Math.round((result.score / result.totalQuestions) * 100),
            duration: result.duration || 0
        };

        history.unshift(newResult);
        
        // Garder seulement les 50 derniers résultats
        if (history.length > 50) {
            history.splice(50);
        }

        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
        this.updateStats();
        
        return newResult;
    }

    // Récupérer l'historique
    getHistory() {
        try {
            const history = localStorage.getItem(this.HISTORY_KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
            return [];
        }
    }

    // Effacer l'historique
    clearHistory() {
        localStorage.removeItem(this.HISTORY_KEY);
        localStorage.removeItem(this.STATS_KEY);
        return true;
    }

    // Mettre à jour les statistiques globales
    updateStats() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            localStorage.removeItem(this.STATS_KEY);
            return;
        }

        const stats = {
            totalGames: history.length,
            totalScore: history.reduce((sum, result) => sum + result.score, 0),
            totalQuestions: history.reduce((sum, result) => sum + result.totalQuestions, 0),
            bestScore: Math.max(...history.map(result => result.percentage)),
            worstScore: Math.min(...history.map(result => result.percentage)),
            averageScore: 0,
            modeStats: {},
            rangeStats: {}, // Nouvelles statistiques par gamme
            recentGames: history.slice(0, 10)
        };

        stats.averageScore = Math.round((stats.totalScore / stats.totalQuestions) * 100);

        // Statistiques par mode
        history.forEach(result => {
            if (!stats.modeStats[result.mode]) {
                stats.modeStats[result.mode] = {
                    name: result.modeName,
                    games: 0,
                    totalScore: 0,
                    totalQuestions: 0,
                    bestScore: 0,
                    averageScore: 0
                };
            }

            const modeStats = stats.modeStats[result.mode];
            modeStats.games++;
            modeStats.totalScore += result.score;
            modeStats.totalQuestions += result.totalQuestions;
            modeStats.bestScore = Math.max(modeStats.bestScore, result.percentage);
        });

        // Calculer les moyennes par mode
        Object.keys(stats.modeStats).forEach(mode => {
            const modeStats = stats.modeStats[mode];
            modeStats.averageScore = Math.round((modeStats.totalScore / modeStats.totalQuestions) * 100);
        });

        // Statistiques par gamme (pour les modes de gamme individuelle)
        const rangeGames = history.filter(result => 
            ['savage', 'inca', 'pupille', 'elfes'].includes(result.mode)
        );
        
        rangeGames.forEach(result => {
            const rangeName = result.mode;
            if (!stats.rangeStats[rangeName]) {
                stats.rangeStats[rangeName] = {
                    name: this.getRangeDisplayName(rangeName),
                    games: 0,
                    totalScore: 0,
                    totalQuestions: 0,
                    bestScore: 0,
                    averageScore: 0,
                    icon: this.getRangeIcon(rangeName),
                    color: this.getRangeColor(rangeName)
                };
            }

            const rangeStats = stats.rangeStats[rangeName];
            rangeStats.games++;
            rangeStats.totalScore += result.score;
            rangeStats.totalQuestions += result.totalQuestions;
            rangeStats.bestScore = Math.max(rangeStats.bestScore, result.percentage);
        });

        // Calculer les moyennes par gamme
        Object.keys(stats.rangeStats).forEach(range => {
            const rangeStats = stats.rangeStats[range];
            rangeStats.averageScore = Math.round((rangeStats.totalScore / rangeStats.totalQuestions) * 100);
        });

        localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    }

    // Récupérer les statistiques
    getStats() {
        try {
            const stats = localStorage.getItem(this.STATS_KEY);
            return stats ? JSON.parse(stats) : {
                totalGames: 0,
                averageScore: 0,
                bestScore: 0,
                modeStats: {},
                rangeStats: {},
                recentGames: []
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            return {
                totalGames: 0,
                averageScore: 0,
                bestScore: 0,
                modeStats: {},
                rangeStats: {},
                recentGames: []
            };
        }
    }

    // Obtenir le nom d'affichage d'une gamme
    getRangeDisplayName(rangeName) {
        const rangeNames = {
            'savage': 'Savage',
            'inca': 'Inca',
            'pupille': 'Pupille',
            'elfes': 'Elfes'
        };
        return rangeNames[rangeName] || rangeName;
    }

    // Obtenir l'icône d'une gamme
    getRangeIcon(rangeName) {
        const rangeIcons = {
            'savage': '🔥',
            'inca': '🌿',
            'pupille': '👁️',
            'elfes': '🧝‍♀️'
        };
        return rangeIcons[rangeName] || '❓';
    }

    // Obtenir la couleur d'une gamme
    getRangeColor(rangeName) {
        const rangeColors = {
            'savage': '#ef4444',
            'inca': '#059669',
            'pupille': '#7c3aed',
            'elfes': '#10b981'
        };
        return rangeColors[rangeName] || '#6b7280';
    }

    // Sauvegarder les préférences utilisateur
    savePreferences(preferences) {
        localStorage.setItem('vap-quiz-preferences', JSON.stringify(preferences));
    }

    // Récupérer les préférences utilisateur
    getPreferences() {
        try {
            const prefs = localStorage.getItem('vap-quiz-preferences');
            return prefs ? JSON.parse(prefs) : {
                questionsPerQuiz: 10,
                showHints: true,
                playSound: true,
                darkMode: false
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des préférences:', error);
            return {
                questionsPerQuiz: 10,
                showHints: true,
                playSound: true,
                darkMode: false
            };
        }
    }

    // Vérifier si le stockage local est disponible
    isAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Exporter les données pour sauvegarde
    exportData() {
        return {
            history: this.getHistory(),
            stats: this.getStats(),
            preferences: this.getPreferences(),
            exportDate: new Date().toISOString()
        };
    }

    // Importer des données depuis une sauvegarde
    importData(data) {
        try {
            if (data.history) {
                localStorage.setItem(this.HISTORY_KEY, JSON.stringify(data.history));
            }
            if (data.stats) {
                localStorage.setItem(this.STATS_KEY, JSON.stringify(data.stats));
            }
            if (data.preferences) {
                localStorage.setItem('vap-quiz-preferences', JSON.stringify(data.preferences));
            }
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'importation des données:', error);
            return false;
        }
    }
}

// Instance globale
const storage = new LocalStorage();
