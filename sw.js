// Service Worker pour le cache et le fonctionnement hors ligne
const CACHE_NAME = 'vap-quiz-v2.3.0';
const urlsToCache = [
    '/Quizz-VapStation/',
    '/Quizz-VapStation/index.html',
    '/Quizz-VapStation/styles/main.css',
    '/Quizz-VapStation/js/app.js',
    '/Quizz-VapStation/js/quiz.js',
    '/Quizz-VapStation/js/data.js',
    '/Quizz-VapStation/js/storage.js',
    '/Quizz-VapStation/manifest.json',
    '/Quizz-VapStation/sw.js',
    '/Quizz-VapStation/icons/icon-72.svg',
    '/Quizz-VapStation/icons/icon-96.svg',
    '/Quizz-VapStation/icons/icon-128.svg',
    '/Quizz-VapStation/icons/icon-192.svg',
    '/Quizz-VapStation/icons/icon-512.svg'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installation en cours...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cache ouvert, ajout des fichiers...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Tous les fichiers ont été mis en cache');
                return self.skipWaiting(); // Force l'activation immédiate
            })
            .catch((error) => {
                console.error('Service Worker: Erreur lors de l\'installation:', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activation en cours...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Suppression de l\'ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activé et prêt !');
            return self.clients.claim(); // Prend le contrôle immédiatement
        })
    );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    // Ignorer les requêtes non-HTTP
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Retourner la réponse du cache si elle existe
                if (cachedResponse) {
                    console.log('Service Worker: Ressource servie depuis le cache:', event.request.url);
                    return cachedResponse;
                }
                
                // Sinon, faire la requête réseau
                return fetch(event.request).then((networkResponse) => {
                    // Vérifier si la réponse est valide
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Cloner la réponse pour la mettre en cache
                    const responseToCache = networkResponse.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            console.log('Service Worker: Mise en cache de:', event.request.url);
                            cache.put(event.request, responseToCache);
                        });

                    return networkResponse;
                }).catch((error) => {
                    console.log('Service Worker: Erreur réseau pour:', event.request.url);
                    
                    // En cas d'erreur réseau, retourner la page d'accueil depuis le cache
                    if (event.request.destination === 'document') {
                        return caches.match('/Quizz-VapStation/index.html');
                    }
                    
                    // Pour les autres ressources, on peut retourner une réponse par défaut
                    throw error;
                });
            })
    );
});
