import { DictionaryManager } from './dictionarymanager';
import { AsyncLoader } from './asyncloader';
import { Formats } from './formats';
import * as Rx  from 'rxjs/Rx';

export class Chomsky {
    constructor(locale) {
        // TODO - prefix/suffix
        // Dictionary Manger to handle translations that have been loaded
        this.dictionaryManager = new DictionaryManager();
        // Loader to load translations from a JSON file
        this.asyncLoader = new AsyncLoader();
        // Handle for when the locale changes
        this.onLocaleChange = new Rx.Subject();
        // Custom formats based on the locale
        this.formats = new Formats();
        // Default location for translations
        this.location = 'i18n/';
        // Current locale
        this.currentLocale = locale || window.navigator.language;
        // Use the locale if passed in
        if (locale) {
            this.use(locale);
        }
    }

    /**
     * @public
     * @name setLocation
     * @param {String} location - path where the i18n JSON files live
     * @default 'i18n/'
     */
    setLocation(location) {
        this.location = location;
    }

    /**
     * @public
     * @description: public method for changing the language
     * @param locale MUST BE formatted as such: 'en-US' or 'en'
     * @returns {Promise}
     */
    use(locale) {
        // Capture the pending task
        let pending;
        // If we don't have the translations, load them
        if (!this.dictionaryManager.get(locale)) {
            pending = this._getTranslations(locale);
        }
        // Return the pending if we are fetching
        if (typeof pending !== 'undefined') {
            return pending;
        } else {
            // Split out the language code from the locale
            let languageCode = (locale.split('-')[0] || '').toLowerCase();
            // Return the translations if they are already loaded
            let currentTranslations = [this.dictionaryManager.get(locale), this.dictionaryManager.get(languageCode)];
            this._applyLanguage(locale, currentTranslations[0], currentTranslations[1]);
            return Rx.Observable.of(currentTranslations);
        }
    }

    /**
     * @public
     * @name translate
     * @param key
     * @param interpolation
     * @returns {*}
     */
    translate(key, interpolation) {
        let value = this._getValue(key);

        // Handle pluralization
        if (typeof value === 'object') {
            if (typeof interpolation === 'number') {
                let pluralization = value;
                if (pluralization) {
                    if (pluralization.hasOwnProperty(interpolation)) {
                        value = pluralization[interpolation];
                    } else {
                        if (interpolation === 0) {
                            value = pluralization.zero;
                        } else {
                            value = pluralization.many;
                        }
                    }
                }
            }
        }

        // Handle interpolation
        if (interpolation && value) {
            value = value.replace(/{([^}]*)}/gi, (m, param) => {
                let params = param.split(':');
                if (params.length === 1) {
                    let match = '';
                    if (interpolation.hasOwnProperty(param)) {
                        match = interpolation[param];
                    } else {
                        match = interpolation;
                    }
                    return match;
                }
                let unparsedValue = interpolation[params[0]] || interpolation;
                switch (params[1]) {
                    case 'date':
                        return this.formatDate(unparsedValue, (params[2] || undefined), (params[3] || undefined));
                    case 'currency':
                        return this.formatCurrency(unparsedValue, (params[2] || undefined), (params[3] || undefined));
                    case 'number':
                        return this.formatNumber(unparsedValue, (params[2] || undefined));
                    default:
                        return '';
                }
            });
        }

        // Return the key if no value is present.
        return value || '';
    }

    /**
     * @public
     * @name formatDate
     * @param date
     * @param format
     * @param mask
     * @returns {*}
     * @private
     */
    formatDate(date, format, mask) {
        return this.formats.formatDate(date, format, mask);
    }

    /**
     * @public
     * @name formatCurrency
     * @param value
     * @param format
     * @param localeOverride
     * @returns {*}
     * @private
     */
    formatCurrency(value, format, localeOverride) {
        return this.formats.formatCurrency(value, format, localeOverride);
    }

    /**
     * @public
     * @name formatNumber
     * @param numberString
     * @param format
     * @returns {*}
     * @private
     */
    formatNumber(numberString, format) {
        return this.formats.formatNumber(numberString, format);
    }

    /**
     * @private
     * @name getValue
     * @param key
     * @returns {string}
     */
    _getValue(key) {
        let value = null;
        let translations = this.dictionaryManager.get(this.currentLocale);

        if (translations) {
            let tokens = key.split('.');
            for (let i = 0; i < tokens.length; i++) {
                if (!value) {
                    value = translations[tokens[i]];
                } else {
                    value = value[tokens[i]];
                }
            }
        }
        return value;
    }

    /**
     * @private
     * @name _getTranslations
     * @param locale
     * @returns {*|Observable.<T>}
     */
    _getTranslations(locale) {
        // Split out the language code from the locale
        let languageCode = (locale.split('-')[0] || '').toLowerCase();
        // Cue up two observables to grab the locale and the fallback locale
        // en-US - locale (en-US) / fallback (en)
        let translations = this._translationFetcher(locale);
        let fallbackTranslations = this._translationFetcher(languageCode);
        // Combine the two observables and share the same subscription
        this.pending = Rx.Observable.combineLatest(translations, fallbackTranslations).share();
        // Subscribe to the result
        this.pending.subscribe(result => {
            this._applyLanguage(locale, result[0], result[1]);
        }, err => {
            console.error('[Chomsky] - Fetching Translations Error:', err);
        }, () => {
            this.pending = undefined;
        });

        return this.pending;
    }

    /**
     * @private
     * @name _applyLanguage
     * @description This method is the setter for the active language
     * @param locale
     * @param translations
     * @param fallbackTranslations
     */
    _applyLanguage(locale, translations, fallbackTranslations) {
        // Set current locale
        this.currentLocale = locale;
        // Set locale on formats too
        this.formats.setLocale(locale);
        // Handle overrides
        if (translations && translations.hasOwnProperty('formats')) {
            this.formats.override(translations.formats);
            delete translations['formats'];
        } else if (fallbackTranslations && fallbackTranslations.hasOwnProperty('formats')) {
            this.formats.override(fallbackTranslations.formats);
            delete fallbackTranslations['formats'];
        }
        // Add the translations to the DictionaryManager
        this.dictionaryManager.add(locale, translations, fallbackTranslations);
        // Emit a change event
        this.onLocaleChange.next(locale);
    }

    /**
     * @private
     * @name _translationFetcher
     * @param {String} locale - locale to fetch
     * @returns {Observable}
     */
    _translationFetcher(locale) {
        return this.asyncLoader.load(`${this.location}${locale}.json`);
    }
}

export default Chomsky;