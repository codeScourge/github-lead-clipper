// runs immediatelly, event listener is triggered after background.js sends message
(() => {
    const newRepoLoaded = () => {
        if (!document.getElementsByClassName("repo-webclipper")[0]) {
            const btn = document.createElement("span");
            btn.innerHTML = "&#9763;";
            btn.className = "repo-webclipper";
            btn.style.cursor = "pointer";
            btn.style.transition = "transform 0.5s";


            btn.addEventListener("click", async (e) => {
                const repoUrl = location.href
                const profileUrl = document.querySelector("body > div.logged-in.env-production.page-responsive > div.position-relative.js-header-wrapper > header > div.AppHeader-globalBar.pb-2.js-global-bar > div.AppHeader-globalBar-start > div > div.AppHeader-context-full > nav > ul > li:nth-child(1) > a").href
            
                const getEmails = async (profileUrl) => {
                    const response = await fetch(`https://api.github.com/users/${profileUrl.replace(/^.*com[/]([^/]*).*$/,'$1')}/events/public`);
                    const data = await response.json();
                    return [...new Set([].concat.apply([],data.filter(x => x.type==='PushEvent').map(x => x.payload.commits.map(c => c.author.email)))).values()];
                }
            
                const emails = JSON.stringify(await getEmails(profileUrl));
                const leadObject = {
                    profileUrl: profileUrl, 
                    repoUrl: repoUrl, 
                    emails: emails
                }
                console.log(leadObject);


                // save to session storage
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

                    let newObjects = {}
                    newObjects[KEY] = {"array": [...oldObjects, leadObject]}

                    chrome.storage.sync.set(newObjects).then(() => {
                        console.log("saved to storage")
                    })
                })

                e.target.style.transform = 'rotate(360deg)';
            })


            document.getElementById("repo-title-component").appendChild(btn);
        }
    }

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        newRepoLoaded();
    })

    newRepoLoaded();

})()

