const blocks = document.getElementsByClassName('algBlocks')[0];

(() => {
    chrome.runtime.sendMessage({command: 'getData'}, (response) => {
        if (response.configs.length) {
            response.configs.forEach((el) => {
                blocks.innerHTML += `                
                <div class="algBlock">
                    <h4 class="notblack">${el.fileName}</h4>
                    <div class="aToggle">
                        <label id="aButton">
                            <input ${el.enabled ? 'checked' : ''} class="toggleAlg" id="${el.id}" type="checkbox">
                            <span id="aSlider"></span>
                        </label>
                    </div>
                </div>`;
            });
        }

        const toggleAlg = document.querySelectorAll('.toggleAlg');

        toggleAlg.forEach((el) => {
            el.addEventListener('click', (event) => {
                chrome.runtime.sendMessage({command: 'toggleAlg', id: `${event.target.id}`});
            });
        });
    });
})();