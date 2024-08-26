document.addEventListener('DOMContentLoaded', () => {
    let baseDomain;
    
    // Retrieve the base domain from the background script
    chrome.runtime.sendMessage({ action: 'getBaseDomain' }, function(response) {
        baseDomain = response.baseDomain;
        console.log('Base domain received in popup2:', baseDomain);

        function removenote(a){
            chrome.storage.local.get([baseDomain], function(result) {
                let data = result[baseDomain] || [];
                data=data.filter((obj)=>{
                    return obj.question!=a
                })
                chrome.storage.local.set({ [baseDomain]: data }, function() {
                  console.log('removed a note ', baseDomain);
                });

              });
        }



        // Only proceed with retrieving storage data after baseDomain is set
        chrome.storage.local.get([baseDomain], function(result) {
            let data = result[baseDomain] || []; // Access the data using the baseDomain key
            if(data.length==0){
                document.querySelector('#abs').classList.toggle('abs');
            }
            console.log('Retrieved data:', data);

            if (data && Array.isArray(data)) {
                let a = data.length;
                data.forEach(ele => {
                    // Create a new div for each question-answer pair
                    const div = document.createElement('div');
                    div.className = 'container';

                    // Create elements for question and answer
                    const p1 = document.createElement('p');
                    const p2 = document.createElement('p');
                    const i =  document.createElement('img');
                    i.addEventListener("click",()=>{
                        div.remove();
                        removenote(ele.question);

                        a--;
                        if(a==0){
                            document.querySelector('#abs').classList.toggle('abs')
                        }
                    })

                    // Set the text content for question and answer
                    p1.textContent = ele.question;
                    p2.textContent = ele.answer;
                    i.setAttribute("src","cross (1).png");


                    // Append question and answer to the div
                    div.appendChild(p1);
                    div.appendChild(p2);
                    div.appendChild(i);

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