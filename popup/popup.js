async function getActiveTabUrl() {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
};

function createDownloadCSV(data) {
    return (e) => {
        e.target.disabled = true;
        const headers = Object.keys(data[0]);
        const csvRows = [];
    

        csvRows.push(headers.join(','));
        for (const row of data) {
        const values = headers.map(header => {
            const escaped = (''+row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
        }


        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
    

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();


        e.target.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // const activeTab = await getActiveTabUrl();
    // if (activeTab.url && activeTab.url.includes("https://github.com")) {
    //     document.getElementById("headline").innerText = "You are on GitHub";
    // } else {
    //     document.getElementById("headline").innerText = "You are not on GitHub";
    // }


    // set in contentScript
    const KEY = "repo-webclipper"

    chrome.storage.sync.get(KEY).then((result) => {
        console.log("old storage: ");
        console.log(result);


        let oldObjects;
        if (result[KEY]) {
            oldObjects = result[KEY]["array"] || [];
        } else {
            oldObjects = []
        }
        
        console.log(document.getElementById("n-contacts"))
        document.getElementById("n-contacts").innerText = oldObjects.length.toString();
        document.getElementById("download-button").addEventListener("click", createDownloadCSV(oldObjects));
    })


    document.getElementsByClassName("clear")[0].addEventListener("click", (e) => {
        if (prompt("You are about to delete ALL your leads, are you sure? [yes|no]") === "yes") {
            const newObjects = {}
            newObjects[KEY] = {"array": []}
            chrome.storage.sync.set(newObjects).then(() => {
                location.reload();
            })

        } else {
            console.log("cancelled clear")
        }
    })
});

