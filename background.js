function getBaseDomain(urlString) {
  let url = new URL(urlString);
  let hostname = url.hostname;

  // Extract base domain (e.g., 'example.com')
  let domainParts = hostname.split('.');
  let baseDomain = domainParts.slice(-2).join('.');

  return baseDomain;
}

// Set up message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getBaseDomain') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      let currentTab = tabs[0];
      let url = currentTab.url;
      let baseDomain = getBaseDomain(url);
      console.log(baseDomain);
      sendResponse({ baseDomain: baseDomain });
    });
    // Indicate that the response will be sent asynchronously
    return true;
  }
});




