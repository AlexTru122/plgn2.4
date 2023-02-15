const toggleRandom = document.getElementById('toggleRandom');
const toggleSSL = document.getElementById('toggleSSL');
const toggleSave = document.getElementById('toggleHistory');
const toggleReset = document.getElementById('toggleReset');
const toggleLoop = document.getElementById('toggleLoop');

toggleRandom.addEventListener('click', () => {
    sendMessage({command: 'toggleRandom'});
});

toggleSSL.addEventListener('click', () => {
    sendMessage({command: 'toggleSSL'});
});

toggleSave.addEventListener('click', () => {
    sendMessage({command: 'toggleSave'});
});

toggleReset.addEventListener('click', () => {
    sendMessage({command: 'toggleReset'});
});

toggleLoop.addEventListener('click', () => {
    sendMessage({command: 'toggleLoop'});
});

function sendMessage(msg) {
    chrome.runtime.sendMessage(msg);
    updateVisuals();
}

function updateVisuals() {
    chrome.runtime.sendMessage({command: 'getData'}, (response) => {
        toggleRandom.checked = response.ConfigsRandomOrder;
        toggleSSL.checked = response.IgnoreSSL;
        toggleSave.checked = response.HistoryAutoLoad;
        toggleReset.checked = response.HistoryAutoReset;
        toggleLoop.checked = response.DoLoop;
    });
}

(() => updateVisuals())();