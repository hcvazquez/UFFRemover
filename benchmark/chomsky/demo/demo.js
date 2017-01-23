import { Chomsky } from './../src/chomsky';

class Demo {
    constructor() {
        // Setup Chomsky
        this.chomsky = new Chomsky();
        // Listening for changes
        this.chomsky.onLocaleChange.subscribe(locale => {
            console.log(`[Language Change]: ${locale}`);
            console.log('\t' + this.chomsky.translate('GREETING', { name: 'John' }));
            console.log('\t' + this.chomsky.translate('GOODBYE', { name: 'John' }));
            console.log('\t' + this.chomsky.translate('TODAY', { today: new Date() }));
            console.log('\t' + this.chomsky.translate('TOMORROW', { tomorrow: '7/4/1776' }));
            console.log('\t' + this.chomsky.translate('MONEY', { debt: 123456.1 }));
            console.log('\t' + this.chomsky.translate('NUMBER', { people: 1234567 }));
            console.log('\t' + this.chomsky.translate('MESSAGES', 0));
            console.log('\t' + this.chomsky.translate('MESSAGES', 1));
            console.log('\t' + this.chomsky.translate('MESSAGES', 45));
        });
        // Locales
        const usLocale = 'en-US';
        const frLocale = 'fr-FR';
        const gbLocale = 'en-GB';
        // Swap locales
        this.chomsky.use('en');
        this.chomsky.use(usLocale);
        this.chomsky.use(frLocale);
        this.chomsky.use(gbLocale).subscribe(() => {
            // Load US again (should not fire XHR requests)
            this.chomsky.use(usLocale);
        });
    }
}

let demo = new Demo();