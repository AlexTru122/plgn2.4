class Algorithm {
    constructor (config, iterations, depth) {
        this.config = config,
        this.iterations = iterations,
        this.depth = depth,
        this.timer = (this.config?.closeTimeout?.max ?? 1 > this.config?.timeout?.max) ? this.config?.closeTimeout?.max ?? 1 : this.config?.timeout?.max
    }

    initStep() {
        if (this.iterations > 0) {
            chrome.runtime.sendMessage({command: 'debug', val: `Осталось ${this.depth} переходов из ${this.config.depth} : ${this.iterations} итераций осталось`});
            this.depth--;

            if ((this.depth + 1) >= this.config.depth) {
                let inputs = this.config.filters.input.map((el) => document.querySelectorAll(el).length ? el : null).filter((x) => x !== null);
                let forms = this.config.filters.form.map((el) => document.querySelectorAll(el).length ? el : null).filter((x) => x !== null);
                let hrefs = this.config.filters.href.map((el) => document.querySelectorAll(el).length ? el : null).filter((x) => x !== null);

                if (inputs.length && forms.length) {
                    this.updateConfig(true);

                    if (this.config.url != 'last') chrome.runtime.sendMessage({command: 'pushHistory', string: `${new URL(this.config.url).hostname} : ${this.config.keyword}`});

                    document.querySelectorAll(inputs[0])[0].value = String(this.config.keyword);
                    document.querySelectorAll(forms[0])[0].submit();
                } else if (hrefs.length) {
                    setTimeout(() => {
                        let hyperlinks = document.querySelectorAll(hrefs[0]);

                        let hrefsAllowed = [];
    
                        for (let i in hyperlinks) {
                            if (hyperlinks[i].href !== undefined && (this.config.IgnoreSSL ? true : hyperlinks[i]?.href?.includes('http') ? (hyperlinks[i]?.href?.includes('https://')) : true)) hrefsAllowed.push(hyperlinks[i].href);
                        }
    
                        let randomHref = hrefsAllowed[Math.floor(Math.random() * (hrefsAllowed.length - 1))];

                        chrome.runtime.sendMessage({command: 'pushHistory', string: `${new URL(this?.config.url).hostname}`});
    
                        this.updateConfig();
                        document.location.href = randomHref;
                    }, this.randomInt(this.config.timeout.min, this.config.timeout.max) * 1000);
                } else {
                    this.iterations--;
                    this.updateConfig();

                    this.goToCurrentUrl();
                }

                return;
            }

            if ((this.depth) <= 0) {
                this.iterations--;
                this.updateConfig();

                setTimeout(() => {
                    this.goToCurrentUrl();
                }, this.randomInt(this.config.closeTimeout.min, this.config.closeTimeout.max) * 1000);

                return;
            }

            if ((this.depth + 1) < this.config.depth) {
                let hrefs = this.config.filters.href.map((el) => document.querySelectorAll(el).length ? el : null).filter((x) => x !== null);

                if (hrefs.length) {
                    setTimeout(() => {
                        let hyperlinks = document.querySelectorAll(hrefs[0]);

                        let hrefsAllowed = [];
     
                        for (let i in hyperlinks) {
                            if (hyperlinks[i].href !== undefined && (this.config.IgnoreSSL ? true : hyperlinks[i]?.href?.includes('http') ? (hyperlinks[i]?.href?.includes('https://')) : true)) hrefsAllowed.push(hyperlinks[i].href);
                        }

                        let randomHref = hrefsAllowed[Math.floor(Math.random() * (hrefsAllowed.length - 1))];

                        this.updateConfig();
                        document.location.href = randomHref;
                    }, this.randomInt(this.config.timeout.min, this.config.timeout.max) * 1000);
                } else {
                    this.iterations--;
                    this.updateConfig();

                    this.goToCurrentUrl();
                }

                return;
            }
        } else {
            this.updateConfig();

            this.goToCurrentUrl();
        }
    }

    updateConfig(keywordUsed = false) {
        chrome.runtime.sendMessage({command: 'updateConfig', iterations: this.iterations, depth: this.depth, keywordUsed: keywordUsed});
    }

    randomInt(min, max) {
        return (Math.round(Math.random() * (Math.floor(max) - Math.floor(min))) + Math.floor(min));
    }

    goToCurrentUrl() {
        chrome.runtime.sendMessage({command: 'getCurrentConfigUrl'}, (response) => {
            document.location.href = response.url == 'last' ? this.config.url : response.url;
        });
    }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.command == 'initStep') {
        const bot = new Algorithm(msg.config, msg.iterations, msg.depth);

        bot.initStep();
    }
});