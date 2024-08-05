document.addEventListener('DOMContentLoaded', () => {
  

  // Create elements
  const div = document.createElement('div');
  div.className = 'container';
  const p1 = document.createElement('p');
  const area = document.createElement('textarea');
  area.placeholder = "Type your text here...";
  const btnSave = document.createElement('button');
  btnSave.className = 'save';

  // Append elements to the div
  div.appendChild(p1);
  div.appendChild(area);
  div.appendChild(btnSave);
  document.body.appendChild(div);

  // Retrieve the current tab URL
  chrome.runtime.sendMessage({ action: 'getBaseDomain' }, function(response) {
    baseDomain = response.baseDomain;
    console.log('Base domain:', baseDomain);

    // Retrieve selected text from storage
    chrome.storage.local.get('selectedText', (data) => {
      p1.textContent = data.selectedText || 'No text selected';
    });

    // Add event listener for the bu.tton
    btnSave.addEventListener('click', () => {
      console.log('Save button clicked');

      // Save note data
      chrome.storage.local.get([baseDomain], function(result) {
        let data = result[baseDomain] || [];

        const newEntry = { question: p1.textContent, answer: area.value };
        data.push(newEntry);

        chrome.storage.local.set({ [baseDomain]: data }, function() {
          console.log('New note added to', baseDomain);
        });
      });

      // Send a message to content script to change color
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColorToRed' });
      });
    });
  });
});





  