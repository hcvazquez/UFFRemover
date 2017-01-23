import { mergeDeep } from './object-assign-deep';

export class DictionaryManager {
    constructor() {
        this.dictionaries = {};
    }

    /**
     * @public
     * @name contains
     * @param locale
     * @returns {boolean}
     */
    contains(locale) {
        return !!this.dictionaries[locale];
    }

    /**
     * @public
     * @name get
     * @param locale
     * @returns {Object}
     */
    get(locale) {
        return this.dictionaries[locale];
    }

    /**
     * @public
     * @name add
     * @description
     * @param locale
     * @param translations
     * @param fallbackTranslations
     */
    add(locale, translations, fallbackTranslations) {
        this.dictionaries[locale] = mergeDeep({}, fallbackTranslations, translations);
    }
}