document.getElementById('fetchArticle').addEventListener('click', async () => {
    const title = await getRandomWikipediaArticle();
    notify(title);
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
  