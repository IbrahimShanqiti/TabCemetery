document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.getElementById('cemetery-tabs');
  
  chrome.storage.local.get('cemetery', data => {
    data.cemetery.reverse().forEach((tab, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
    <span>🪦 ${tab.title}</span>
    <button class="revive-btn" data-index="${index}">Revive 🧟‍♂️</button>
    <button class="dismiss-btn" data-index="${index}">Dismiss ❌</button>
    `;
      tabs.appendChild(li);
    });
  });

  // judgement day
  tabs.addEventListener('click', e => {
    const index = e.target.dataset.index;
  p
    if (e.target.classList.contains('revive-btn')) {
      // bring em back
      chrome.storage.local.get('cemetery', data => {
        const tab = data.cemetery.splice(index, 1)[0];
        chrome.tabs.create({ url: tab.url });
        chrome.storage.local.set({ cemetery: data.cemetery }, () => location.reload());
      });
    } 
    else if (e.target.classList.contains('dismiss-btn')) {
      // permadeath
      chrome.storage.local.get('cemetery', data => {
        data.cemetery.splice(index, 1); // remove permanently
        chrome.storage.local.set({ cemetery: data.cemetery }, () => location.reload());
      });
    }
  });  
});
