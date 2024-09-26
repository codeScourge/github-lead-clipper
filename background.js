// runs when a tab (url) updates
chrome.tabs.onUpdated.addEventListener((tabId, tab) => {
    if (tab.url && tab.url.includes("https://github.com")) {
        chrome.tabs.sendMessage(tabId, {ping: "pong"})
    }
})