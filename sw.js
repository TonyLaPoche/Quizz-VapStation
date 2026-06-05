// Service Worker pour le cache et le fonctionnement hors ligne
const CACHE_NAME = 'vap-quiz-v3.0.0';
const urlsToCache = [
    '/Quizz-VapStation/',
    '/Quizz-VapStation/index.html',
    '/Quizz-VapStation/styles/main.css',
    '/Quizz-VapStation/js/app.js',
    '/Quizz-VapStation/js/quiz.js',
    '/Quizz-VapStation/js/data.js',
    '/Quizz-VapStation/js/storage.js',
    '/Quizz-VapStation/js/leaderboard.js',
    '/Quizz-VapStation/js/firebase-config.js',
    '/Quizz-VapStation/manifest.json?v=3.0.0',
    '/Quizz-VapStation/sw.js',
    '/Quizz-VapStation/icons/icon-72.svg',
    '/Quizz-VapStation/icons/icon-96.svg',
    '/Quizz-VapStation/icons/icon-128.svg',
    '/Quizz-VapStation/icons/icon-192.svg',
    '/Quizz-VapStation/icons/icon-512.svg',
    '/Quizz-VapStation/sound/success-fanfare-trumpets-6185.mp3'
];

function shouldUseNetworkFirst(url) {
    return url.includes('.js')
        || url.includes('index.html')
        || url.endsWith('/Quizz-VapStation/')
        || url.includes('manifest.json');
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('Service Worker: Erreur lors de l\'installation:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.matchAll().then((clients) => {
                clients.forEach(client => {
                    client.postMessage({ type: 'CACHE_UPDATED' });
                });
                return self.clients.claim();
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith('http')) {
        return;
    }

    const requestUrl = event.request.url;

    if (shouldUseNetworkFirst(requestUrl)) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                }).catch((error) => {
                    if (event.request.destination === 'document') {
                        return caches.match('/Quizz-VapStation/index.html');
                    }
                    throw error;
                });
            })
    );
});
