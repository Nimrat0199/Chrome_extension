document.addEventListener('DOMContentLoaded', async() => {
  

  // Create elements
  const div = document.createElement('div');
  div.className = 'container';
  const p1 = document.createElement('p');
  const area = document.createElement('textarea');
  area.placeholder = "enter a note";
  const btnSave = document.createElement('button');
  btnSave.innerText="ADD";
  btnSave.className = 'save';

  // Append elements to the div
  div.appendChild(p1);
  div.appendChild(area);
  div.appendChild(btnSave);
  document.body.appendChild(div);

  // Retrieve the current tab URL
  await chrome.runtime.sendMessage({ action: 'getBaseDomain' }, function(response) {
    baseDomain = response.baseDomain;
    console.log('Base domain:', baseDomain);
  });

    // Retrieve selected text from storage
  await chrome.storage.local.get('selectedText', (data) => {
      p1.textContent = data.selectedText || 'please select a text ';
      chrome.storage.local.remove('selectedText', function() {
        console.log('selectedText has been removed');
      });      
    });

    // Add event listener for the bu.tton
    btnSave.addEventListener('click', () => {
      console.log('Save button clicked');
      if(area.value!="" && p1.textContent != 'please select a text '){
         // Save note data
      chrome.storage.local.get([baseDomain], function(result) {
        let data = result[baseDomain] || [];

        const newEntry = { question: p1.textContent, answer: area.value };
        data.push(newEntry);

        chrome.storage.local.set({ [baseDomain]: data }, function() {
          console.log('New note added to', baseDomain);
        });
        document.querySelector('#noteadded').style.display="block";
      });
      }
      if(area.value==""){
        area.placeholder="please enter a comment";
        const style = document.createElement('style');

// Add the CSS for the placeholder to the style element
style.innerHTML = `
  ::placeholder {
    color: red;
    opacity: 1; 
  }
`;

// Append the style element to the document head
document.head.appendChild(style);
      }
      if(p1.textContent == 'please select a text '){
        p1.style.color="red";
      }
      
    });
      // Send a message to content script to change color
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColorToRed' });
    });
    
  
});





  