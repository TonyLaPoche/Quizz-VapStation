// Service Firestore pour le classement public
class LeaderboardService {
    constructor() {
        this.db = null;
        this.enabled = false;
        this.init();
    }

    init() {
        try {
            if (typeof firebaseConfig === 'undefined') {
                console.warn('Firebase : firebase-config.js manquant');
                return;
            }

            const placeholders = ['YOUR_API_KEY', 'YOUR_PROJECT_ID', ''];
            if (!firebaseConfig.apiKey || placeholders.includes(firebaseConfig.apiKey)) {
                console.warn('Firebase : configuration non renseignée (voir firebase-config.example.js)');
                return;
            }

            if (typeof firebase === 'undefined') {
                console.warn('Firebase : SDK non chargé');
                return;
            }

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.db = firebase.firestore();
            this.enabled = true;
        } catch (error) {
            console.warn('Firebase : initialisation impossible', error);
            this.enabled = false;
        }
    }

    isEnabled() {
        return this.enabled;
    }

    validatePostalCode(postalCode) {
        return /^\d{5}$/.test(postalCode);
    }

    validateInitials(initials) {
        return /^[A-Za-zÀ-ÿ]{2}$/.test(initials.trim());
    }

    normalizePostalCode(postalCode) {
        return postalCode.trim();
    }

    normalizeInitials(initials) {
        return initials.trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
            .slice(0, 2);
    }

    async submitScore(results, postalCode, initials) {
        if (!this.enabled) {
            throw new Error('Le classement public n\'est pas configuré.');
        }

        const normalizedPostal = this.normalizePostalCode(postalCode);
        const normalizedInitials = this.normalizeInitials(initials);

        if (!this.validatePostalCode(normalizedPostal)) {
            throw new Error('Code postal invalide (5 chiffres requis).');
        }

        if (!this.validateInitials(normalizedInitials)) {
            throw new Error('Initiales invalides (2 lettres requises).');
        }

        await this.db.collection('scores').add({
            postalCode: normalizedPostal,
            initials: normalizedInitials,
            score: results.score,
            totalQuestions: results.totalQuestions,
            percentage: results.percentage,
            mode: results.mode,
            modeName: results.modeName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async fetchTopScores(limit = 50) {
        if (!this.enabled) {
            throw new Error('Le classement public n\'est pas configuré.');
        }

        // Lecture simple sans orderBy → aucun index Firestore requis
        const snapshot = await this.db.collection('scores').get();

        const scores = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                postalCode: data.postalCode,
                initials: data.initials,
                score: data.score,
                totalQuestions: data.totalQuestions,
                percentage: data.percentage,
                modeName: data.modeName,
                createdAt: data.createdAt?.toDate?.() || null
            };
        });

        scores.sort((a, b) => {
            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }
            const dateA = a.createdAt ? a.createdAt.getTime() : 0;
            const dateB = b.createdAt ? b.createdAt.getTime() : 0;
            return dateB - dateA;
        });

        return scores.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));
    }

    formatDate(date) {
        if (!date) return '—';
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

const leaderboardService = new LeaderboardService();
