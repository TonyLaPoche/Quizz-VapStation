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

        const snapshot = await this.db.collection('scores')
            .orderBy('percentage', 'desc')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
                id: doc.id,
                rank: index + 1,
                postalCode: data.postalCode,
                initials: data.initials,
                score: data.score,
                totalQuestions: data.totalQuestions,
                percentage: data.percentage,
                modeName: data.modeName,
                createdAt: data.createdAt?.toDate?.() || null
            };
        });
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
