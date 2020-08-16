const CACHE_NAME = "info-BolaV2";
const urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/pages/home.html",
    "/pages/standings.html",
    "/pages/fav.html",
    "/team.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/api.js",
    "/js/db.js",
    "/js/idb.js",
    "/js/materialize.min.js",
    "/js/script.js",
    "/js/nav.js",
    "/img/paralax.jpg",
    "/img/primierlogo.png",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "/manifest.json",
    "/img/icons/icon-144x144.png",
    "/img/notif.png",
    "/img/loader.gif",
    "/img/bolaku.png"

];


self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});


self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheName) {
            return Promise.all(
                cacheName.map(function (cacheName) {
                    if (cacheName != CACHE_NAME && cacheName.startsWith("football")) {
                        console.log("ServiceWorker: cache " + cacheName + " telah dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("football-data.org")) {
        event.respondWith(async function () {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) return cachedResponse;
            const networkResponse = await fetch(event.request);
            event.waitUntil(
                cache.put(event.request, networkResponse.clone())
            );
            return networkResponse;
        }());
    } else {
        event.respondWith(
            caches.match(event.request, {
                'ignoreSearch': true
            }).then(function (response) {
                return response || fetch(event.request);
            })
        )
    }
});


// notifikasi
self.addEventListener('push', event => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    let options = {
        body: body,
        icon: 'img/notif.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});