importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) {
  workbox.precaching.precacheAndRoute(
    [
      { url: "" },
      { url: "nav.html", revision: "1" },
      { url: "index.html", revision: "1" },
      { url: "pages/home.html", revision: "1" },
      { url: "pages/standings.html", revision: "1" },
      { url: "pages/fav.html", revision: "1" },
      { url: "team.html", revision: "1" },
      { url: "css/materialize.min.css", revision: "1" },
      { url: "css/style.css", revision: "1" },
      { url: "js/api.js", revision: "1" },
      { url: "js/db.js", revision: "1" },
      { url: "js/idb.js", revision: "1" },
      { url: "js/materialize.min.js", revision: "1" },
      { url: "js/script.js", revision: "1" },
      { url: "js/nav.js", revision: "1" },
      { url: "img/paralax.jpg", revision: "1" },
      { url: "img/primierlogo.png", revision: "1" },
      {
        url: "https://fonts.googleapis.com/icon?family=Material+Icons",
        revision: "1",
      },
      { url: "manifest.json", revision: "1" },
      { url: "img/icons/icon-144x144.png", revision: "1" },
      { url: "img/notif.png", revision: "1" },
      { url: "img/loader.gif", revision: "1" },
      { url: "img/bolaku.png", revision: "1" },
    ],
    {
      ignoreUrlParametersMatching: [/.*/],
    }
  );

  workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "pages",
    })
  );

  workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2/"),
    workbox.strategies.cacheFirst({
      cacheName: "App-football",
    })
  );

  // Menyimpan Cache image
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: "images",
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // menyimpan cache dari api football

  // Menyimpan cache Google Font
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: "google-fonts-webfonts",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    new workbox.strategies.StaleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-resources",
    })
  );
  console.log(`Workbox berhasil dimuat`);
} else {
  console.log(`Workbox gagal dimuat`);
}

// push notifikasi
self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }

  var options = {
    body: body,
    icon: "./img/icon-512x512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
