document.addEventListener('DOMContentLoaded', () => {
    let baseDomain;

    // Retrieve the base domain from the background script
    chrome.runtime.sendMessage({ action: 'getBaseDomain' }, function(response) {
        baseDomain = response.baseDomain;
        console.log('Base domain received in popup2:', baseDomain);

        // Only proceed with retrieving storage data after baseDomain is set
        chrome.storage.local.get([baseDomain], function(result) {
            let data = result[baseDomain]; // Access the data using the baseDomain key
            console.log('Retrieved data:', data);

            if (data && Array.isArray(data)) {
                data.forEach(ele => {
                    // Create a new div for each question-answer pair
                    const div = document.createElement('div');
                    div.className = 'container';

                    // Create elements for question and answer
                    const p1 = document.createElement('p');
                    const p2 = document.createElement('p');

                    // Set the text content for question and answer
                    p1.textContent = ele.question;
                    p2.textContent = ele.answer;

                    // Append question and answer to the div
                    div.appendChild(p1);
                    div.appendChild(p2);

                    // Append the div to the body or a container
                    document.body.appendChild(div);
                });
            } else {
                // Create a div to display no data message
                const div = document.createElement('div');
                div.className = 'container';
                const p = document.createElement('p');
                p.textContent = `No data found for the key ${baseDomain}`;
                div.appendChild(p);
                document.body.appendChild(div);
            }
        });
    });
});

