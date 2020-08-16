const dbPromised = idb.open("Info-BolaApp", 1, upgradeDb => {
    const articlesObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("NamaTeam", "name", {
        unique: false
    });
});

function saveTeam(team) {
    dbPromised
        .then(db => {
            const tx = db.transaction("teams", "readwrite");
            const store = tx.objectStore("teams");
            console.log(team);
            store.put(team);
            return tx.complete;
        })
        .then(() => {
            M.toast({
                html: 'Team Favorit berhasil disimpan'
            })
        });
}

const deleteTeam = id => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const transaction = db.transaction("teams", `readwrite`);
            transaction.objectStore("teams").delete(parseInt(id));
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
                M.toast({
                    html: 'Team Favorit berhasil dihapus'
                })
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};
const getTeamAll = () => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const tx = db.transaction('teams', 'readonly');
            return tx.objectStore("teams")
                .getAll();
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error('Team Favorit belum ada'));
            }
        })
    })
}


function getTeamId(id) {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const tx = db.transaction('teams', 'readonly');
            const store = tx.objectStore("teams");
            return store.get(parseInt(id));
        }).then(data => {
            resolve(data);
        })
    })
}