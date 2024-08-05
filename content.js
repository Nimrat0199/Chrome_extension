document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.toString().length > 0) {
    console.log('Selected text:', selection.toString());
    const selectedText = selection.toString();

    // Save the selected text to chrome.storage.local
    chrome.storage.local.set({ selectedText: selectedText }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving selected text:', chrome.runtime.lastError);
      } else {
        console.log('Selected text saved to storage');
      }
    });
  }
});



// Function to underline the selected text and optionally change the color
function underlineSelectedText(selection, changeColor) {
  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);
    let selectedText = range.extractContents();

    // Create a new span element to wrap the selected text
    let span = document.createElement('span');
    span.style.textDecoration = 'underline'; // Underline the text
    span.style.fontWeight = 'bold';          // Make the text bold

    if (changeColor) {
      span.style.color = 'red';              // Set text color to red if requested
    }

    span.appendChild(selectedText);

    // Insert the span element back into the document
    range.deleteContents(); // Remove the original selected text
    range.insertNode(span);
  }
}
// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'changeColorToRed') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      underlineSelectedText(selection, true); // Apply red color
    }
  }
});
 