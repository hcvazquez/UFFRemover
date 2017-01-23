import { Chomsky } from './chomsky';

describe('Class: Chomsky', () => {
    it('should initialize with all it\'s defaults.', () => {
        let instance = new Chomsky();
        expect(instance).toBeDefined();
        expect(instance.dictionaryManager).toBeDefined();
        expect(instance.asyncLoader).toBeDefined();
        expect(instance.onLocaleChange).toBeDefined();
        expect(instance.currentLocale).toBe('en-US');
        expect(instance.formats).toBeDefined();
    });

    it('should initialize with a predefined locale (if provided).', () => {
        let instance = new Chomsky('en-GB');
        expect(instance).toBeDefined();
        expect(instance.dictionaryManager).toBeDefined();
        expect(instance.asyncLoader).toBeDefined();
        expect(instance.onLocaleChange).toBeDefined();
        expect(instance.currentLocale).toBe('en-GB');
        expect(instance.formats).toBeDefined();
    });

    describe('Function: _translationFetcher(locale)', () => {
        let chomsky;
        beforeEach(() => {
            chomsky = new Chomsky;
        });
        it('should call the load method of the AsyncLoader.', () => {
            expect(chomsky._translationFetcher).toBeDefined();
            spyOn(chomsky.asyncLoader, 'load').and.callFake(() => {
            });
            chomsky._translationFetcher('url');
            expect(chomsky.asyncLoader.load).toHaveBeenCalledWith('i18n/url.json');
            expect(chomsky.asyncLoader.load).toHaveBeenCalledTimes(1);
        });
        it('should call the load method of the AsynLoader (location changed)', () => {
            expect(chomsky._translationFetcher).toBeDefined();
            spyOn(chomsky.asyncLoader, 'load').and.callFake(() => {
            });
            chomsky.setLocation('test/');
            chomsky._translationFetcher('url');
            expect(chomsky.asyncLoader.load).toHaveBeenCalledWith('test/url.json');
            expect(chomsky.asyncLoader.load).toHaveBeenCalledTimes(1);
        });
    });
    
    xdescribe('Function: use(locale)', () => {
        let chomsky;
        beforeEach(() => {
            chomsky = new Chomsky;
        });
        it('should be defined.', done => {
            expect(chomsky.setLanguage).toBeDefined();
            done();
        });

        it('should set the current locale.', done => {
            let locale = 'en-US';
            spyOn(chomsky.formats, 'setLocale').and.callFake(() => {
            });
            chomsky.setLanguage(locale);
            expect(chomsky.currentLocale).toBe(locale);
            expect(chomsky.formats.setLocale).toHaveBeenCalledWith(locale);
            done();
        });

        it('should set the current locale and apply a language.', done => {
            let locale = 'en-US';
            let language = { greeting: 'Hello' };
            spyOn(chomsky.formats, 'setLocale').and.callFake(() => {
            });
            spyOn(chomsky, 'applyLanguage').and.callFake(() => {
            });
            chomsky.setLanguage(locale, language);
            expect(chomsky.currentLocale).toBe(locale);
            expect(chomsky.formats.setLocale).toHaveBeenCalledWith(locale);
            expect(chomsky.applyLanguage).toHaveBeenCalledWith(locale, language);
            done();
        });
    });

    describe('Function: _applyLanguage(language, translationObject)', () => {
        let chomsky;
        beforeEach(() => {
            chomsky = new Chomsky;
        });
        it('should be defined.', () => {
            expect(chomsky._applyLanguage).toBeDefined();
        });
    });

    describe('Function: _getTranslations(locale)', () => {
        let chomsky;
        beforeEach(() => {
            chomsky = new Chomsky;
        });
        it('should be defined.', () => {
            expect(chomsky._getTranslations).toBeDefined();
        });
    });

    describe('Function: _getValue(key)', () => {
        let chomsky;
        beforeEach(() => {
            chomsky = new Chomsky();
            chomsky.dictionaryManager.dictionaries['en-US'] = {
                greeting: 'Hello',
                menu: {
                    title: 'The Menu',
                    button: {
                        label: 'Click Here.',
                        alt: {
                            desc: 'Tool tip'
                        }
                    }
                },
                farewell: 'Goodbye'
            };
        });
        it('should be defined.', () => {
            expect(chomsky._getValue).toBeDefined();
        });

        it('should return a value from the dictionary.', () => {
            expect(chomsky._getValue).toBeDefined();
            expect(chomsky._getValue('greeting')).toBe('Hello');
        });

        it('should return a nested value from the dictionary.', () => {
            expect(chomsky._getValue).toBeDefined();
            expect(chomsky._getValue('menu.title')).toBe('The Menu');
            expect(chomsky._getValue('menu.button.label')).toBe('Click Here.');
            expect(chomsky._getValue('menu.button.alt.desc')).toBe('Tool tip');
        });

        it('should return a nested value from the locale dictionary.', () => {
            expect(chomsky._getValue).toBeDefined();
            expect(chomsky._getValue('farewell')).toBe('Goodbye');
        });
    });

    xdescribe('Function: translate(key, interpolation, pluralValue)', () => {
        let chomsky;
        let key = 'greeting';

        beforeEach(() => {
            chomsky = new Chomsky;
            let frenchTranslation = {
                greeting: 'Bonjour',
                farewell: 'Au revoir, {name}.',
                birthday: 'Joyeux anniversaire est, {dob:date}.',
                reminder: 'Votre réunion est {meeting:date:ddd}.',
                placements: 'Vous avez besoin {placed:number:0,0.0000}.'
            };
            let usTranslation = {
                greeting: 'Hello',
                farewell: 'Goodbye, {name}.',
                birthday: 'Happy birthday is, {dob:date}.',
                reminder: 'Your meeting is on {meeting:date:ddd}.',
                placements: 'You need {placed:number:0,0.0000}.'
            };
            chomsky.setLanguage('fr', frenchTranslation);
            chomsky.setLanguage('en', usTranslation);
        });

        it('should translate a string.', () => {
            expect(chomsky.translate).toBeDefined();
            chomsky.setLanguage('en');
            expect(chomsky.translate(key)).toBe('Hello');
            chomsky.setLanguage('fr');
            expect(chomsky.translate(key)).toBe('Bonjour');
        });

        it('should fail-over from the local into the language.', () => {
            expect(chomsky.translate).toBeDefined();
            chomsky.setLanguage('fr-FR');
            expect(chomsky.translate(key)).toBe('Bonjour');
            chomsky.setLanguage('en-US');
            expect(chomsky.translate(key)).toBe('Hello');
        });

        it('should return the key when the translation is not available.', () => {
            expect(chomsky.translate).toBeDefined();
            chomsky.setLanguage('fr');
            expect(chomsky.translate(key + '_')).toBe('greeting_');
            chomsky.setLanguage('en');
            expect(chomsky.translate(key + '_')).toBe('greeting_');
        });

        it('should resolve dynamic variables inside of strings.', () => {
            expect(chomsky.translate).toBeDefined();
            chomsky.setLanguage('fr');
            let mockDynamicValues = { name: 'Mary' };
            expect(chomsky.translate('farewell', mockDynamicValues)).toBe('Au revoir, Mary.');
            chomsky.setLanguage('en');
            expect(chomsky.translate('farewell', mockDynamicValues)).toBe('Goodbye, Mary.');
        });

        it('should resolve dynamic date variables inside of strings.', () => {
            expect(chomsky.translate).toBeDefined();
            chomsky.setLanguage('fr');
            let mockDynamicValues = { dob: new Date(1776, 6, 4) };
            // French
            let frenchTranslation = chomsky.translate('birthday', mockDynamicValues);
            let frenchDate = frenchTranslation.split(',')[1].split('/');
            expect(frenchTranslation).toContain('Joyeux anniversaire est,');
            expect(frenchDate.length).toBe(3);
            expect(frenchDate[0]).toContain('4');
            expect(frenchDate[1]).toContain('7');
            expect(frenchDate[2]).toContain('1776');
            // English
            chomsky.setLanguage('en');
            let englishTranslation = chomsky.translate('birthday', mockDynamicValues);
            let englishDate = englishTranslation.split(',')[1].split('/');
            expect(englishTranslation).toContain('Happy birthday is');
            expect(englishDate.length).toBe(3);
            expect(englishDate[0]).toContain('7');
            expect(englishDate[1]).toContain('4');
            expect(englishDate[2]).toContain('1776');
        });

        it('should resolve dynamic date variables with custom formatting inside of strings.', () => {
            expect(chomsky.translate).toBeDefined();
            chomsky.setLanguage('fr');
            let mockDynamicValues = { meeting: new Date(1776, 6, 4) };
            // French
            let frenchTranslation = chomsky.translate('reminder', mockDynamicValues);
            let frenchDate = frenchTranslation.split('on ')[1];
            expect(frenchTranslation).toContain('Votre réunion est');
            expect(frenchDate.toLowerCase()).toContain('jeu');
            // English
            chomsky.setLanguage('en');
            let englishTranslation = chomsky.translate('reminder', mockDynamicValues);
            let englishDate = englishTranslation.split('on ')[1];
            expect(englishTranslation).toContain('Your meeting is on');
            expect(englishDate.toLowerCase()).toContain('thu');
        });

        it('should resolve dynamic number variables with custom formatting inside of strings.', () => {
            expect(chomsky.translate).toBeDefined();
            chomsky.setLanguage('fr');
            let mockDynamicValues = { placed: 123456.23 };
            // French
            expect(chomsky.translate('placements', mockDynamicValues)).toBe('Vous avez besoin 123,456.2300.');
            // English
            chomsky.setLanguage('en');
            expect(chomsky.translate('placements', mockDynamicValues)).toBe('You need 123,456.2300.');
        });

        it('should resolve plural values.', () => {
            expect(chomsky.translate).toBeDefined();
            let mockUSPluralValues = {
                messages: {
                    zero: 'No messages.',
                    1: 'Only 1 message',
                    many: '{messages} messages.'
                }
            };
            chomsky.setLanguage('en-US', mockUSPluralValues);
            expect(chomsky.translate('messages', 0)).toBe('No messages.');
            expect(chomsky.translate('messages', 1)).toBe('Only 1 message');
            expect(chomsky.translate('messages', 50)).toBe('50 messages.');
            let mockFRPluralValues = {
                messages: {
                    zero: 'Pas de messages.',
                    1: 'Seulement 1 message',
                    many: '{messages} messages.'
                }
            };
            chomsky.setLanguage('fr-FR', mockFRPluralValues);
            expect(chomsky.translate('messages', 0)).toBe('Pas de messages.');
            expect(chomsky.translate('messages', 1)).toBe('Seulement 1 message');
            expect(chomsky.translate('messages', 50)).toBe('50 messages.');

        });
    });

    describe('Function: setLocation(location)', () => {
        let chomsky;
        beforeEach(() => {
            chomsky = new Chomsky();
        });
        it('should be defined.', () => {
            expect(chomsky.setLocation).toBeDefined();
        });
        it('should set the location', () => {
            chomsky.setLocation('TEST');
            expect(chomsky.location).toEqual('TEST');
        })
    });
});
