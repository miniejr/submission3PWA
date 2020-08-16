document.addEventListener("DOMContentLoaded", () => {
  // Activate sidebar nav
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach((elm) => {
          elm.innerHTML = xhttp.responseText;
        });

        document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
          elm.addEventListener("click", (event) => {
            const sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  let page = window.location.hash.substr(1);
  if (page == "") page = "home";
  loadPage();

  function loadPage() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const content = document.querySelector("#body-content");
        if (page === "home") {
          getMatch();
        } else if (page === "standings") {
          getStandings();
        } else if (page === "fav") {
          getAddTeamFav();
        }
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status == 404) {
          content.innerHTML = "<p>Maaf Halaman Tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>ups..Halaman tidak dapat diakses</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }
});
