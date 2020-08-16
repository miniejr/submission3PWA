const ApiKey = "b53914000a6b4c6b856a3ed0a42a02eb";
const BaseUrl = "https://api.football-data.org/v2/";
const DetailTeams = `${BaseUrl}teams/`;
const standings = `${BaseUrl}competitions/2021/standings?standingType=TOTAL`;
const pertandingan = `${BaseUrl}competitions/2021/matches/`;

const fetchAPI = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": ApiKey,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        console.log("Error: " + res.status);
        return Promise.reject(new Error(res.statusText));
      } else {
        return Promise.resolve(res);
      }
    })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
};

// function menampilkan data standing football
function getStandings() {
  if ("cache" in window) {
    caches.match(standings).then((response) => {
      if (response) {
        response.json().then((data) => {
          console.log(data);
          standingData(data);
        });
      }
    });
  }
  fetchAPI(standings)
    .then((data) => {
      console.log(data);
      standingData(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function standingData(data) {
  let standings = "";
  let elStandings = document.getElementById("standings");
  data.standings[0].table.forEach((table) => {
    standings += `
                <tr>
                <td class="team">${table.position}</td>
                <td class="thtd"><a href="./team.html?id=${
                  table.team.id
                }"><img alt="imglogo" src="${table.team.crestUrl.replace(
      /^http:\/\//i,
      "https://"
    )}" class="imglogo" alt="logoteamimg"/></td>
                <td class="team">${table.team.name}</td>
                <td class="tdscore">${table.won}</td>
                <td class="tdscore">${table.lost}</td>
                <td class="tdscore">${table.draw}</td>
                <td class="tdscore">${table.points}</td>
                </tr>
        `;
  });
  elStandings.innerHTML = `
                <table class="responsive-table">
                    <thead>
                    <tr>
                    <th class="thtd">Peringkat</th>
                    <th class="thtd"></th>
                    <th class="team">TEAM</th>
                    <th class="tdscore">WIN</th>
                    <th class="tdscore">LOST</th>
                    <th class="tdscore">DRAW</th>
                    <th class="tdscore">Points</th>
                    </tr> 
                     </thead>
                     <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
                
                </div>
    `;
}
// function menampilkan data detailteam football
function getDetailTeambyId() {
  return new Promise((resolve, reject) => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    if ("cache" in window) {
      caches.match(DetailTeams + idParam).then((response) => {
        if (response) {
          response.json().then((data) => {
            console.log(data);
            detailTeam(data);
          });
        }
      });
    }

    fetchAPI(DetailTeams + idParam)
      .then((data) => {
        console.log(data);
        detailTeam(data);
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function detailTeam(data) {
  let teamHTML = `  
    <ul class="collection with-header">
        <li class="collection-header"><img src="${data.crestUrl.replace(
          /^http:\/\//i,
          "https://"
        )}" class="imgteam" alt="imgteam"></li>
        <li class="collection-item">Nama Team  : ${data.name}</li>
        <li class="collection-item">Alamat  : ${data.address}</li>
        <li class="collection-item">Email   : ${data.email}</li>
        <li class="collection-item">Telp    : ${data.phone}</li>
        <li class="collection-item">Lokasi  : ${data.venue}</li>
        <li class="collection-item">Didirikan Tahun : ${data.founded}</li>
        <li class="collection-item">Website : <a href="${data.website}">${
    data.website
  }</a></li>
        <li class="collection-item center-align">Squad</li>
 </ul>`;
  document.getElementById("teamdetail").innerHTML = teamHTML;
}

function getMatch() {
  if ("cache" in window) {
    caches.match(pertandingan).then((response) => {
      if (response) {
        response.json().then((data) => {
          console.log(data);
          dataPertandingan(data);
        });
      }
    });
  }
  fetchAPI(pertandingan)
    .then((data) => {
      console.log(data);
      dataPertandingan(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function dataPertandingan(data) {
  let matchHTML = "";
  matchHTML += `<h3>Pertandingan ${data.competition.name}</h3>`;
  const match = data.matches;
  let maxMatch = match.length;
  if (match.length > 20) {
    maxMatch = 20;
  }
  for (let i = 0; i < maxMatch; i++) {
    matchHTML += `<table >
<tbody class="tbody">
<tr>
<td class="matchteam"><a href="./team.html?id=${match[i].homeTeam.id}">
${match[i].homeTeam.name}</a><br>${match[i].score.fullTime.homeTeam}</td>
<td class="matchtd"><img src="img/primierlogo.png" alt="logoprimier" class="imglogoprimier"></td>
<td class="matchteam"><a href="./team.html?id=${match[i].awayTeam.id}">
${match[i].awayTeam.name}</a><br>${match[i].score.fullTime.awayTeam}</td>
</tr>
</tbody>
</table>`;
    document.getElementById("match").innerHTML = matchHTML;
  }
}

function getAddTeamFav() {
  getTeamAll().then((data) => {
    if (data.length === 0) {
      let getIsiFavHtml = "";
      getIsiFavHtml += `<p class="center-align">Belum ada tim favorit yang ditambahkan<p>`;
      document.getElementById("save").innerHTML = getIsiFavHtml;
    } else {
      console.log(data);
      getSaveTeam(data);
    }
  });
}

function getSaveTeam(data) {
  let getTeamFavHtml = "";
  data.forEach((team) => {
    getTeamFavHtml += `
      <ul class="collection">
      <li class="collection-item avatar">
      <a href="./team.html?id=${team.id}&fav=true">
      <img src ="${team.crestUrl.replace(
        /^http:\/\//i,
        "https://"
      )}" class="circle" alt="imglogoteam"> </a>
      <span class="title">${team.name}</span>
      <p>${team.address}</p>
      <p><a href="${team.website}">${team.website}</a></p>
      <a class="deletebtn waves-effect waves-light secondary-content btn" id="${
        team.id
      }")>Hapus</a>

    </li>
    </ul>
      `;
    document.getElementById("save").innerHTML = getTeamFavHtml;

    let btnHapus = document.querySelectorAll(".deletebtn");
    for (let btn of btnHapus) {
      btn.addEventListener("click", function (event) {
        let id = event.target.id;
        deleteTeam(id).then(() => {
          console.log(id);
          getAddTeamFav();
        });
      });
    }
  });
}

function GetSaveTeamDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  getTeamId(idParam).then((data) => {
    console.log(data);
    detailTeam(data);
  });
}
