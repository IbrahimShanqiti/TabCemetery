chrome.runtime.onInstalled.addListener(() => {
    // Creating some local storage
    chrome.storage.local.set({ tabActivity: {}, cemetery: [] });
  });
  
  chrome.tabs.onActivated.addListener(activeInfo => {
    const now = Date.now();
    chrome.storage.local.get('tabActivity', data => {
      // Adding tabs to the tabActivity dict so they can get *possibly* reaped later...
      data.tabActivity[activeInfo.tabId] = now;
      chrome.storage.local.set({ tabActivity: data.tabActivity });
    });
  });
  
  // checking the tabs every hour
  setInterval(() => {
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    chrome.storage.local.get(['tabActivity', 'cemetery'], data => {
      // adding em to the gallows
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          if (!tab.pinned) {
            const lastVisit = data.tabActivity[tab.id] || 0;
            if (lastVisit < weekAgo) {
              // temp death until a user decides to revive or nah
              data.cemetery.push({ title: tab.title, url: tab.url, archivedAt: Date.now() });
              chrome.tabs.remove(tab.id);
            }
          }
        });
        chrome.storage.local.set({ cemetery: data.cemetery });
      });
    });
  }, 3600 * 1000);