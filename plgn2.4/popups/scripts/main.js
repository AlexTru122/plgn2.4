const exportButton = document.getElementById('exportButton');
const clearButton = document.getElementById('clearButton');
const removeButton = document.getElementById('removeButton');

const statusBlock = document.getElementsByClassName('statusBlock');
const statusPoint = document.getElementsByClassName('statusPoint');
const toggleButton = document.getElementById('toggleCheckbox');
const status_ = document.getElementById('status');

const requestsCounter = document.getElementById('reqs');
const mvs = document.getElementById('mvs');
const ers = document.getElementById('ers');

toggleButton.addEventListener('click', () => {
    statusPoint[0].style.backgroundColor = statusPoint[0].style.backgroundColor == 'white' ? '#cccccc' : 'white';
    statusBlock[0].style.borderColor = statusBlock[0].style.borderColor == 'rgb(33, 150, 243)' ? 'rgb(248, 248, 248)' : 'rgb(33, 150, 243)';
    statusBlock[0].style.backgroundColor = statusBlock[0].style.backgroundColor == 'rgb(33, 150, 243)' ? 'rgb(248, 248, 248)' : 'rgb(33, 150, 243)';
    status_.style.color = status_.style.color == 'white' ? 'rgb(71, 67, 77)' : 'white';
    status_.innerHTML = status_.innerHTML == 'Выключено' ? 'Включено' : 'Выключено';

    sendMessage({command: 'toggle'});
});
exportButton.addEventListener('click', () => {
    sendMessage({command: 'export'});
});
clearButton.addEventListener('click', () => {
    sendMessage({command: 'clear'});
});
removeButton.addEventListener('click', () => {
    sendMessage({command: 'clearMCEC'});
});


function sendMessage(msg) {
    chrome.runtime.sendMessage(msg);
    updateVisuals();
}

setInterval(async () => {
    updateVisuals();
}, 500);

function updateVisuals() {
    chrome.runtime.sendMessage({command: 'getData'}, (response) => {
        requestsCounter.innerHTML = `Запросы: ${response.kcounter}`;
        mvs.innerHTML = `Переходы: ${response.mcounter}`;
        ers.innerHTML = `Ошибки: ${response.ecounter}`;

        if (response.isEnabled) {
            toggleButton.checked = true;
            statusPoint[0].style.backgroundColor = 'white'
            statusBlock[0].style.borderColor = 'rgb(33, 150, 243)'
            statusBlock[0].style.backgroundColor = 'rgb(33, 150, 243)'
            status_.style.color = 'white'
            status_.innerHTML = 'Включено';
        } else {
            toggleButton.checked = false;
            statusPoint[0].style.backgroundColor = '#cccccc'
            statusBlock[0].style.borderColor = 'rgb(248, 248, 248)'
            statusBlock[0].style.backgroundColor = 'rgb(248, 248, 248)'
            status_.style.color = 'rgb(71, 67, 77)'
            status_.innerHTML = 'Выключено';
        }
    });
}

(() => updateVisuals())();