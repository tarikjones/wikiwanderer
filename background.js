chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ lastArticle: '' });
  });
  
  async function getRandomWikipediaArticle() {
    const response = await fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1');
    const data = await response.json();
    const title = data.query.random[0].title;
    return title;
  }
  
  function notify(title) {
    chrome.notifications.create('wikiNotification', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Learn Something New!',
      message: `Click to learn about: ${title}`,
      priority: 2
    }, () => {
      chrome.storage.local.set({ lastArticle: title });
    });
  }
  
  chrome.alarms.create('fetchArticle', { periodInMinutes: 1440 }); // Once a day
  
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'fetchArticle') {
      const title = await getRandomWikipediaArticle();
      notify(title);
    }
  });
  
  chrome.notifications.onClicked.addListener(() => {
    chrome.storage.local.get('lastArticle', (data) => {
      const title = data.lastArticle;
      if (title) {
        const url = `https://en.wikipedia.org/wiki/${title.replace(/ /g, '_')}`;
        chrome.tabs.create({ url });
      }
    });
  });
  