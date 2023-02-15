const loadConfig = document.getElementById('loadConfig');
const blocks = document.getElementsByClassName('fileBlocks')[0];

loadConfig.onchange = () => {
    for (let i = 0; i < loadConfig.files.length; i++) {
        loadConfig.files.item(i).text().then((data) => {
            chrome.runtime.sendMessage({
                command: 'upload',
                text: data,
                name: loadConfig.files.item(i).name
            });

            if (i == (loadConfig.files.length - 1)) draw();
        });
    }
}

function draw() {
    loadConfig.value = '';
    blocks.innerHTML = '';

    chrome.runtime.sendMessage({command: 'getData'}, (response) => {
        console.log(response)
        if (response.configs.length || response.urls.length || response.keywords.length) {
            [...response.configs ?? [], ...response.urls ?? [], ...response.keywords ?? []].forEach((el) => {
                console.log(el)
                blocks.innerHTML += `                
                <div class="fileBlock">
                    <h4 class="notblack">${el.fileName}</h4>
                    <button class="removeFile" id="${el.id}"></button>
                </div>`;
            });

            const removeFile = document.querySelectorAll('.removeFile');

            removeFile.forEach((el) => {
                el.addEventListener('click', (event) => {
                    chrome.runtime.sendMessage({
                        command: 'removeFile',
                        id: `${event.target.id}`
                    });

                    draw();
                });
            });
        }
    });
}

(() => draw())();