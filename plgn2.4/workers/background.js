class LocalStorage {
    static object = {};

    static set(obj) {
        if (!Object.keys(obj)?.length) return;

        Object.keys(obj).forEach((el) => {
            this.object[el] = obj[el];

            chrome.storage.local.set({
                storage: this.object
            });
        });
    }

    static get(keys, callback) {
        keys = keys instanceof Array ? keys : [keys];

        let arr = keys.map((el) => Object.fromEntries([
            [el, this.object[el]]
        ]));
        let out = {};

        for (let i = 0; i < arr.length; i++) {
            Object.assign(out, arr[i]);
        }

        callback(out);
    }
}

class Settings {
    static values = {
        ConfigsRandomOrder: false,
        IgnoreSSL: false,
        DoLoop: false,
        HistoryAutoLoad: true,
        HistoryAutoReset: true
    }

    static get ConfigsRandomOrder() {
        return this.values.ConfigsRandomOrder;
    }
    static set ConfigsRandomOrder(n) {
        this.values.ConfigsRandomOrder = n;
        this.synchronizeValues();
    }

    static get IgnoreSSL() {
        return this.values.IgnoreSSL;
    }
    static set IgnoreSSL(n) {
        this.values.IgnoreSSL = n;
        this.synchronizeValues();
    }

    static get DoLoop() {
        return this.values.DoLoop;
    }
    static set DoLoop(n) {
        this.values.DoLoop = n;
        this.synchronizeValues();
    }

    static get HistoryAutoLoad() {
        return this.values.HistoryAutoLoad;
    }
    static set HistoryAutoLoad(n) {
        this.values.HistoryAutoLoad = n;
        this.synchronizeValues();
    }

    static get HistoryAutoReset() {
        return this.values.HistoryAutoReset;
    }
    static set HistoryAutoReset(n) {
        this.values.HistoryAutoReset = n;
        this.synchronizeValues();
    }

    static synchronizeValues() {
        LocalStorage.set({
            settings: this.values
        });
    }
}

class Properties {
    static values = {
        isEnabled: false,
        awaitRedirect: false,
        iterations: 0,
        depth: 0,
        currentConfig: {},
        currentUrl: '',
        currentTabId: '',
        history: [],
        timeout: 0,
        counters: {
            kcounter: 0,
            ecounter: 0,
            mcounter: 0
        }
    }

    static get isEnabled() {
        return this.values.isEnabled;
    }
    static set isEnabled(n) {
        this.values.isEnabled = n;
        this.synchronizeValues();
    }

    static get timeout() {
        return this.values.timeout;
    }
    static set timeout(n) {
        this.values.timeout = n;
        this.synchronizeValues();
    }

    static get awaitRedirect() {
        return this.values.awaitRedirect;
    }
    static set awaitRedirect(n) {
        this.values.awaitRedirect = n;
        this.synchronizeValues();
    }

    static get iterations() {
        return this.values.iterations;
    }
    static set iterations(n) {
        this.values.iterations = n;
        this.synchronizeValues();
    }

    static get depth() {
        return this.values.depth;
    }
    static set depth(n) {
        this.values.depth = n;
        this.synchronizeValues();
    }

    static get currentConfig() {
        return this.values.currentConfig;
    }
    static set currentConfig(n) {
        this.values.currentConfig = n;
        this.synchronizeValues();
    }

    static get currentUrl() {
        return this.values.currentUrl;
    }
    static set currentUrl(n) {
        this.values.currentUrl = n;
        this.synchronizeValues();
    }

    static get currentTabId() {
        return this.values.currentTabId;
    }
    static set currentTabId(n) {
        this.values.currentTabId = n;
        this.synchronizeValues();
    }

    static get history() {
        return this.values.history;
    }
    static set history(n) {
        this.values.history = n;
        this.synchronizeValues();
    }

    static get counters() {
        return this.values.counters;
    }

    static countK(x = 1) {
        this.values.counters.kcounter += x;
        this.synchronizeValues();
    }

    static countE(x = 1) {
        this.values.counters.ecounter += x;
        this.synchronizeValues();
    }

    static countM(x = 1) {
        this.values.counters.mcounter += x;
        this.synchronizeValues();
    }

    static clearK() {
        this.values.counters.kcounter = 0;
        this.synchronizeValues();
    }

    static clearE() {
        this.values.counters.ecounter = 0;
        this.synchronizeValues();
    }

    static clearM() {
        this.values.counters.mcounter = 0;
        this.synchronizeValues();
    }

    static clearHistory() {
        this.values.history = [];
        this.synchronizeValues();
    }

    static addToHistory(x) {
        if (!this.values.history.length) {
            this.values.history.push(`${Utils.getCurrentTime()} – Начало`);
        }
        this.values.history.push(x);
        this.synchronizeValues();
    }

    static synchronizeValues() {
        LocalStorage.set({
            properties: this.values
        });
    }
}

class ObjectsList {
    static values = [];

    static add(obj) {
        this.values.push(obj);
        this.synchronizeValues();
    }

    static set(uid, obj) {
        Object.keys(obj).forEach((el) => {
            if (this.values.filter((x) => x.id == uid)[0]) this.values.filter((x) => x.id == uid)[0][el] = obj[el];
        });
    }

    static remove(uid) {
        this.values = this.values.filter((x) => x.id != uid);
        this.synchronizeValues();
    }

    static removeByName(name) {
        this.values = this.values.filter((x) => x.fileName != name);
        this.synchronizeValues();
    }

    static get(uid) {
        return this.values.filter((x) => x.id == uid)[0];
    }

    static getByName(name) {
        return this.values.filter((x) => x.fileName == name)[0];
    }

    static getAll() {
        return this.values;
    }

    static synchronizeValues() {
        LocalStorage.set({
            objects: this.values
        });
    }
}

class ConfigsList extends ObjectsList {
    static values = [];

    static synchronizeValues() {
        LocalStorage.set({
            configs: this.values
        });
    }
}

class KeywordsList extends ObjectsList {
    static values = [];

    static synchronizeValues() {
        LocalStorage.set({
            keywords: this.values
        });
    }
}

class UrlsList extends ObjectsList {
    static values = [];

    static synchronizeValues() {
        LocalStorage.set({
            urls: this.values
        });
    }
}

class FilesManager {
    static get(uid) {
        return ConfigsList.get(uid) ?? KeywordsList.get(uid) ?? UrlsList.get(uid);
    }

    static getAll() {
        return [...ConfigsList.getAll(), ...KeywordsList.getAll(), ...UrlsList.getAll()];
    }

    static set(uid, obj) {
        ConfigsList.set(uid, obj);
        KeywordsList.set(uid, obj);
        UrlsList.set(uid, obj);
    }

    static remove(uid) {
        ConfigsList.remove(uid);
        KeywordsList.remove(uid);
        UrlsList.remove(uid);
    }
}

class FileGenerator {
    static generateAndDownloadHistoryFile() {
        if (Properties.history.length) {
            Properties.addToHistory(`${Utils.getCurrentTime()} – Дата скачивания файла`);
        }

        let text = `${Properties.history.map((el) => `${el}`).join('\n')}`;
        let dataUri = "data:text/txt;base64," + btoa(unescape(encodeURIComponent(text)));

        chrome.downloads.download({
            url: dataUri,
            filename: `history${Math.floor(Math.random() * 10000)}.txt`
        });
    }
}

class Utils {
    static getRandomKeyword(array) {
        let list = array.flat().map((x) => KeywordsList.getAll().filter((y) => y.fileName == x)[0]?.array ?? x)?.flat();
        return list[this.randomInt(0, list.length - 1)];
    }

    static getNextUrl(array, currentUrl) {
        let list = array.flat().map((x) => UrlsList.getAll().filter((y) => y.fileName == x)[0]?.array ?? x)?.flat();
        return list[currentUrl?.length ? (list.indexOf(currentUrl) + 1) : 0];
    }

    static getCurrentTime() {
        return new Date().toLocaleTimeString([], {
            hour12: false,
        });
    }

    static randomInt(min, max) {
        return (Math.round(Math.random() * (Math.floor(max) - Math.floor(min))) + Math.floor(min));
    }

    static randomId(name = '') {
        return `${name}${this.randomInt(1000, 10000000)}`;
    }
}

class Listeners {
    static updateListener(tabId, changeInfo, tab) {
        Properties.awaitRedirect = false;

        clearTimeout(Properties.timeout);

        Properties.timeout = setTimeout(() => {
            if (Properties.isEnabled) {
                Properties.iterations = Properties.iterations - 1;
                Properties.depth = 0;
                
                BotController.updateConfig();
    
                chrome.tabs.update(tabId, {
                    url: Properties.currentUrl
                });
                
                console.log("Время истекло, переход на главный сайт");
            }
        }, (((Properties.currentConfig?.closeTimeout?.max ?? 1 > Properties.currentConfig?.timeout?.max) ? Properties.currentConfig?.closeTimeout?.max ?? 1 : Properties.currentConfig?.timeout?.max) + 15) * 1000);

        if (changeInfo.status == 'complete' && Properties.currentTabId == tabId) {
            chrome.tabs.query({
                active: true
            }, (tabs) => {
                let tab = tabs[0];

                chrome.tabs.sendMessage(tab.id, {
                    command: 'initStep',
                    config: Properties.currentConfig,
                    iterations: Properties.iterations,
                    depth: Properties.depth
                });
            });
        }
    }

    static errorListener(details) {
        console.log(`Ошибка ${details.error} возникла на ${details.url} : ${Properties.currentUrl}`);
        Properties.countE();

        if (!Properties.awaitRedirect) {
            chrome.tabs.get(details.tabId, (tab) => {
                if (details.error == 'net::ERR_CONNECTION_REFUSED') {
                    if (!tab.url.includes(new URL(Properties.currentUrl).hostname) && Properties.currentTabId == tab.id) {
                        console.log('Переход на главный сайт в результате критической ошибки');

                        Properties.depth = 0;
                        Properties.awaitRedirect = true;

                        chrome.tabs.update(tab.id, {
                            url: Properties.currentUrl
                        });
                    }
                }
            });
        }
    }

    static messageListener(msg, sender, sendResponse) {
        if (!msg?.command) return;

        switch (msg.command) {
            case 'toggle':
                BotController.toggle();
                break;
            case 'export':
                FileGenerator.generateAndDownloadHistoryFile();
                break;
            case 'clear':
                Properties.clearK();
                Properties.clearHistory();
                break;
            case 'clearMCEC':
                Properties.clearE();
                Properties.clearM();
                break;
            case 'toggleRandom':
                Settings.ConfigsRandomOrder = Settings.ConfigsRandomOrder ? false : true;
                Settings.DoLoop = Settings.ConfigsRandomOrder ? false : Settings.DoLoop;
                break;
            case 'toggleSSL':
                Settings.IgnoreSSL = Settings.IgnoreSSL ? false : true;
                break;
            case 'toggleLoop':
                Settings.DoLoop = Settings.DoLoop ? false : true;
                Settings.ConfigsRandomOrder = Settings.DoLoop ? false : Settings.ConfigsRandomOrder;
                break;
            case 'toggleSave':
                Settings.HistoryAutoLoad = Settings.HistoryAutoLoad ? false : true;
                break;
            case 'toggleReset':
                Settings.HistoryAutoReset = Settings.HistoryAutoReset ? false : true;
                break;
            case 'removeFile':
                FilesManager.remove(msg.id);
                break;
            case 'toggleAlg':
                FilesManager.set(msg.id, {
                    enabled: FilesManager.get(msg.id).enabled ? false : true
                });
                break;
            case 'updateConfig':
                Properties.iterations = msg.iterations;
                Properties.depth = msg.depth;

                Properties.countM();
                if (msg.keywordUsed) Properties.countK();

                BotController.updateConfig();
                break;
            case 'debug':
                console.log(msg.val);
                break;
            case 'pushHistory':
                Properties.addToHistory(msg.string);
                break;
            case 'getData':
                sendResponse({
                    ConfigsRandomOrder: Settings.ConfigsRandomOrder,
                    IgnoreSSL: Settings.IgnoreSSL,
                    DoLoop: Settings.DoLoop,
                    HistoryAutoReset: Settings.HistoryAutoReset,
                    HistoryAutoLoad: Settings.HistoryAutoLoad,
                    isEnabled: Properties.isEnabled,
                    kcounter: Properties.counters.kcounter,
                    ecounter: Properties.counters.ecounter,
                    mcounter: Properties.counters.mcounter,
                    configs: ConfigsList.getAll(),
                    keywords: KeywordsList.getAll(),
                    urls: UrlsList.getAll()
                });
                break;
            case 'getCurrentConfigUrl':
                sendResponse({
                    url: Properties.currentConfig.url
                });
                break;
            case 'upload':
                if (msg?.text?.length) {
                    if (msg.text[0] == '[' && msg.text[msg.text.length - 1] == ']') {
                        if (msg.text.includes('http://') || msg.text.includes('https://')) {
                            const urls = new Urls(msg.text, msg.name);

                            UrlsList.removeByName(urls.getAsObject().fileName);
                            if (urls.isValid) UrlsList.add(urls.getAsObject());
                        } else {
                            const keywords = new Keywords(msg.text, msg.name);

                            KeywordsList.removeByName(keywords.getAsObject().fileName);
                            if (keywords.isValid) KeywordsList.add(keywords.getAsObject());
                        }
                    } else {
                        const configFile = new File([""], "configs/bing_25117.json");
let configContents;

const reader = new FileReader();
reader.onload = function(event) {
  configContents = event.target.result;

  // здесь вы можете использовать configContents для настройки вашего скрипта
};
reader.readAsText(configFile);

                        ConfigsList.removeByName(config.getAsObject().fileName);
                        if (config.isValid) ConfigsList.add(config.getAsObject());
                    }
                }
                break;
        }
    }
}

class StringToObjectConverter {
    constructor(text, name) {
        this.object = JSON.parse(text);
        this.name = name;
        this.isValid = true;
    }

    getAsObject() {
        return this.object;
    }
}

class Config extends StringToObjectConverter {
    constructor(text, name) {
        super(text, name);
        this.object = {
            urls: [this.object?.urls].flat(),
            keywords: [this.object?.keywords].flat(),
            iterations: (this.object?.iterations?.min && this.object?.iterations?.max) ? {
                min: Number(this.object?.iterations?.min),
                max: Number(this.object?.iterations?.max),
            } : {
                min: Number(this.object?.iterations),
                max: Number(this.object?.iterations)
            },
            depth: (this.object?.depth?.min && this.object?.depth?.max) ? {
                min: Number(this.object?.depth?.min),
                max: Number(this.object?.depth?.max)
            } : {
                min: Number(this.object?.depth),
                max: Number(this.object?.depth)
            },
            timeout: (this.object?.timeout?.min && this.object?.timeout?.max) ? {
                min: Number(this.object?.timeout?.min),
                max: Number(this.object?.timeout?.max)
            } : {
                min: Number(this.object?.timeout),
                max: Number(this.object?.timeout)
            },
            closeTimeout: ((this.object?.closeTimeout?.min ?? this.object?.timeout?.min) && (this.object?.closeTimeout?.max ?? this.object?.timeout?.max) && !Number(this.object?.closeTimeout)) ? {
                min: Number(this.object?.closeTimeout?.min ?? this.object?.timeout?.min),
                max: Number(this.object?.closeTimeout?.max ?? this.object?.timeout?.max)
            } : {
                min: Number(this.object?.closeTimeout ?? this.object?.timeout),
                max: Number(this.object?.closeTimeout ?? this.object?.timeout)
            },
            filters: {
                input: this.object?.filters?.input ?? [`.d${Utils.randomInt(1000000, 100000000)}`],
                form: this.object?.filters?.form ?? [`.d${Utils.randomInt(1000000, 100000000)}`],
                href: this.object?.filters?.href ?? [`.d${Utils.randomInt(1000000, 100000000)}`]
            },
            id: Utils.randomId(this.name),
            fileName: this.name,
            enabled: true
        }
        this.isValid = this.object.urls.every((x) => typeof x == 'string' && (x?.indexOf('http') == 0 || x?.includes('.json'))) && this.object.keywords.every((x) => typeof x == 'string' && x?.indexOf('http') != 0)
    }
}

class Keywords extends StringToObjectConverter {
    constructor(text, name) {
        super(text, name);
        this.object = {
            id: Utils.randomId(this.name),
            fileName: this.name,
            array: this.object
        }
        this.isValid = this.object.array.every((x) => typeof x == 'string' && x?.indexOf('http') != 0);
    }
}

class Urls extends StringToObjectConverter {
    constructor(text, name) {
        super(text, name);
        this.object = {
            id: Utils.randomId(this.name),
            fileName: this.name,
            array: this.object
        }
        this.isValid = this.object.array.every((x) => typeof x == 'string' && x?.indexOf('http') == 0);
    }
}

class BotController {
    static toggle(update = true) {
        if (ConfigsList.getAll().length && !Properties.isEnabled) {
            Properties.isEnabled = true;

            if (update) this.updateConfig();

            chrome.tabs.create({
                url: Properties.currentUrl,
                active: true
            }, (tab) => {
                Properties.currentTabId = tab.id;
            });

            chrome.tabs.onUpdated.addListener(Listeners.updateListener);
            chrome.webNavigation.onErrorOccurred.addListener(Listeners.errorListener);
        } else {
            Properties.isEnabled = false;
            Properties.currentConfig = {};
            Properties.currentUrl = '';
            Properties.iterations = -1;
            Properties.depth = -1;

            if (Settings.HistoryAutoLoad) FileGenerator.generateAndDownloadHistoryFile();
            if (Settings.HistoryAutoReset) {
                Properties.clearHistory();
                Properties.clearK();
            }

            chrome.tabs.onUpdated.removeListener(Listeners.updateListener);
            chrome.webNavigation.onErrorOccurred.removeListener(Listeners.errorListener);
        }
    }

    static updateConfig() {
        let availableConfigs = ConfigsList.getAll().filter((x) => x.enabled);

        if (!Object.keys(Properties.currentConfig).length) {
            console.log('first');
            let config = availableConfigs[0];
            let url = Utils.getNextUrl(config.urls, Properties.currentUrl);

            Properties.iterations = Utils.randomInt(config.iterations.min, config.iterations.max);
            Properties.depth = Utils.randomInt(config.depth.min, config.depth.max);
            Properties.currentUrl = url;

            Properties.currentConfig = {
                url: url,
                keyword: Utils.getRandomKeyword(config.keywords),
                iterations: Properties.iterations,
                depth: Properties.depth,
                timeout: config.timeout,
                closeTimeout: config.closeTimeout,
                filters: config.filters,
                IgnoreSSL: Settings.IgnoreSSL,
                id: config.id
            }
        } else if (Properties.depth > 0) {
            console.log('depth > 0');
            let config = availableConfigs.filter((x) => x.id == Properties.currentConfig?.id)[0];

            Properties.currentConfig = {
                url: Properties.currentUrl,
                keyword: Utils.getRandomKeyword(config.keywords),
                iterations: Properties.currentConfig.iterations,
                depth: Properties.currentConfig.depth,
                timeout: config.timeout,
                closeTimeout: config.closeTimeout,
                filters: config.filters,
                IgnoreSSL: Settings.IgnoreSSL,
                id: config.id
            }
        } else if (Properties.iterations > 0) {
            console.log('iterations > 0');
            let config = availableConfigs.filter((x) => x.id == Properties.currentConfig?.id)[0];
            let url = Properties.currentUrl;

            Properties.depth = Utils.randomInt(config.depth.min, config.depth.max);
            Properties.currentUrl = url;

            Properties.currentConfig = {
                url: url ?? 'last',
                keyword: Utils.getRandomKeyword(config.keywords),
                iterations: Properties.currentConfig.iterations,
                depth: Properties.depth,
                timeout: config.timeout,
                closeTimeout: config.closeTimeout,
                filters: config.filters,
                IgnoreSSL: Settings.IgnoreSSL,
                id: config.id
            }
        } else {
            console.log('neither');
            let config = availableConfigs.filter((x) => x.id == Properties.currentConfig?.id)[0];
            let url = Utils.getNextUrl(config.urls, Properties.currentUrl);

            if ((url ?? 'last') == 'last' || !Properties.currentUrl) {
                if (Settings.ConfigsRandomOrder) {
                    config = availableConfigs[Utils.randomInt(0, availableConfigs.length - 1)];
                    url = Utils.getNextUrl(config.urls);
                } else {
                    config = availableConfigs[availableConfigs.indexOf(availableConfigs.filter((x) => x.id == Properties.currentConfig?.id)[0]) + 1];
                    url = config?.urls?.length ? Utils.getNextUrl(config.urls) : [];

                    if (!config) {
                        if (Settings.DoLoop) {
                            config = availableConfigs[0];
                            url = Utils.getNextUrl(config.urls);
                        } else {
                            BotController.toggle();
                            return;
                        }
                    }
                }
            }

            Properties.iterations = Utils.randomInt(config.iterations.min, config.iterations.max);
            Properties.depth = Utils.randomInt(config.depth.min, config.depth.max);
            Properties.currentUrl = url;

            Properties.currentConfig = {
                url: url,
                keyword: Utils.getRandomKeyword(config.keywords),
                iterations: Properties.iterations,
                depth: Properties.depth,
                timeout: config.timeout,
                closeTimeout: config.closeTimeout,
                filters: config.filters,
                IgnoreSSL: Settings.IgnoreSSL,
                id: config.id
            }

            console.log(Properties.currentConfig)
        }
    }
}

(() => {
    chrome.runtime.onMessage.addListener(Listeners.messageListener);

    chrome.storage.local.get(['storage'], (data) => {
        if (Object.keys(data)?.length) {
            LocalStorage.set(data.storage);
            LocalStorage.get(['settings', 'properties', 'configs', 'keywords', 'urls'], (obj) => {
                Settings.values = obj.settings;
                Properties.values = obj.properties;
                ConfigsList.values = obj.configs;
                KeywordsList.values = obj.keywords;
                UrlsList.values = obj.urls;

                if (Properties.isEnabled) {
                    chrome.tabs.remove([Properties.currentTabId], () => {
                        Properties.isEnabled = false;
                        BotController.toggle(false);
                    });
                }
            });
        } else {
            LocalStorage.set({
                configs: ConfigsList.getAll(),
                keywords: KeywordsList.getAll(),
                urls: UrlsList.getAll(),
                properties: Properties.values,
                settings: Settings.values
            });
        }
    });
})();