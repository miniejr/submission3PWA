document.addEventListener("DOMContentLoaded", () => {
  const elems = document.querySelectorAll(".parallax");
  const instances = M.Parallax.init(elems);
});

document.addEventListener("DOMContentLoaded", () => {
  getStandings();
});

document.addEventListener("DOMContentLoaded", () => {
  getMatch();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/workbox-sw.js")
      .then(function () {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(function () {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}

// Menerapkan Push Event pada ServiceWorker
if (!("serviceWorker" in navigator)) {
  console.log("Service worker tidak didukung browser ini.");
} else {
  registerServiceWorker();
  requestPermission();
}

function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/workbox-sw.js")
    .then((registration) => {
      console.log("Registrasi service worker berhasil.");
      return registration;
    })
    .catch(function (err) {
      console.error("Registrasi service worker gagal.", err);
    });
}

function requestPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((result) => {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }
      navigator.serviceWorker.ready.then(() => {
        if ("PushManager" in window) {
          navigator.serviceWorker.getRegistration().then((registration) => {
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  "BLop2g91pH7TpQIm1dFEmzatYzBl9PdGwEnKdYsLm-IO9YDIXYAddRE_ZvTA2RScW8tprEZayGkA_cGgq7ht-UY"
                ),
              })
              .then((subscribe) => {
                console.log(
                  "Berhasil melakukan subscribe dengan endpoint: ",
                  subscribe.endpoint
                );
                console.log(
                  "Berhasil melakukan subscribe dengan p256dh key: ",
                  btoa(
                    String.fromCharCode.apply(
                      null,
                      new Uint8Array(subscribe.getKey("p256dh"))
                    )
                  )
                );
                console.log(
                  "Berhasil melakukan subscribe dengan auth key: ",
                  btoa(
                    String.fromCharCode.apply(
                      null,
                      new Uint8Array(subscribe.getKey("auth"))
                    )
                  )
                );
              })
              .catch((e) => {
                console.error("Tidak dapat melakukan subscribe ", e.message);
              });
          });
        }
      });
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
