import { Formats } from './formats';

describe('Class: Formats', () => {
    it('should initialize with its defaults set.', () => {
        let formats = new Formats();
        expect(formats).toBeDefined();
        expect(formats.formatDefaults).toBeDefined();
        expect(formats.formatDefaults.currency).toBeDefined();
        expect(formats.formatDefaults.date).toBeDefined();
        expect(formats.formatDefaults.number).toBeDefined();
    });

    describe('Function: override(formatOverrides)', () => {
        it('should allow a user to override a locale within their translations object', () => {
            let formats = new Formats();
            let firstLocale = {
                locale: 'en-US'
            };
            let secondLocale = {
                locale: 'fr-FR'
            };
            formats.override(firstLocale);
            expect(formats.formatDefaults.locale).toBe('en-US');
            formats.override(secondLocale);
            expect(formats.formatDefaults.locale).toBe('fr-FR');
        });
        it('should allow a user to override formatters within their translations object', () => {
            let formats = new Formats();
            expect(formats.formatDefaults.currency.display).toBe('0,0.00');
            expect(formats.formatDefaults.date.short).toBe('l');
            let firstLocale = {
                currency: {
                    display: '0'
                },
                date: {
                    short: 'lll'
                },
                number: {
                    format: '0,0.0000'
                }
            };
            formats.override(firstLocale);
            expect(formats.formatDefaults.currency.display).toBe('0');
            expect(formats.formatDefaults.date.short).toBe('lll');
            expect(formats.formatDefaults.number.format).toBe('0,0.0000');
        });
    });

    describe('Function: setLocale(locale)', () => {
        it('should set the locale.', () => {
            let formats = new Formats();
            formats.setLocale('en-US');
            expect(formats.formatDefaults.locale).toBe('en-US');
            formats.setLocale('fr-FR');
            expect(formats.formatDefaults.locale).toBe('fr-FR');
        });
        it('should set the locale from the browsers locale by default.', () => {
            let formats = new Formats();
            let locale = window.navigator.language;
            expect(formats.formatDefaults.locale).toBe(locale);
        });
    });

    describe('Function: formatNumber(value)', () => {
        it('should format a US number', () => {
            let formats = new Formats();
            formats.setLocale('en-US');
            let actual = formats.formatNumber(123456789);
            expect(actual).toBe('123,456,789');
        });

        it('should format a FR number', () => {
            let formats = new Formats();
            formats.setLocale('fr-FR');
            let actual = formats.formatNumber(123456789).split(' ');
            expect(actual[0]).toBe('123');
            expect(actual[1]).toBe('456');
            expect(actual[2]).toBe('789');
        });

        it('should format a percentage.', () => {
            let formats = new Formats();
            formats.setLocale('en-US');
            let actual = formats.formatNumber(26.789, '0.000%');
            expect(actual).toBe('2678.900%');
        });
    });

    describe('Function: parseNumber(numberStr)', () => {
        it('should parse a US number', () => {
            let formats = new Formats();
            formats.setLocale('en-US');
            let actual = formats.parseNumber('123,456,789.12');
            expect(actual).toEqual(123456789.12);
        });

        it('should parse a FR number', () => {
            let formats = new Formats();
            formats.setLocale('fr-FR');
            let actual = formats.parseNumber('123 456 789,12');
            expect(actual).toEqual(123456789.12);
        });
    });

    describe('Function: formatCurrency(value, format, locale)', () => {
        it('should format US currency', () => {
            let formats = new Formats();
            formats.setLocale('en-US');
            let actual = formats.formatCurrency(1234567.89);
            expect(actual).toEqual('$1,234,567.89');
        });

        it('should format US currency with custom override', () => {
            let formats = new Formats();
            formats.setLocale('en-US');
            let actual = formats.formatCurrency(1234567.89, '0[.]00');
            expect(actual).toEqual('$1234567.89');
        });

        it('should format FR currency', () => {
            let formats = new Formats();
            formats.setLocale('fr-FR');
            let actual = formats.formatCurrency(1234567.89);
            expect(actual).toEqual('1 234 567,89€');
        });

        it('should allow a format US currency even in FR locale', () => {
            let formats = new Formats();
            formats.setLocale('fr-FR');
            let actual = formats.formatCurrency(1234567.89, undefined, 'en-US');
            expect(actual).toEqual('$1,234,567.89');
        });
    });

    describe('Function: formatDate(date, format, mask)', () => {
        describe('Date String', () => {
            it('render a US date from a date string', () => {
                let formats = new Formats();
                formats.setLocale('en-US');
                expect(formats.formatDate('July 4, 1776', undefined, 'MMM D YYYY')).toBe('7/4/1776');
            });
            it('render a FR date from a date string', () => {
                let formats = new Formats();
                formats.setLocale('fr-FR');
                expect(formats.formatDate('1776 juillet 4', undefined, 'YYYY MMM D')).toBe('4/7/1776');
            });
        });

        describe('Short date', () => {
            it('render a US date from a short date', () => {
                let formats = new Formats();
                formats.setLocale('en-US');
                expect(formats.formatDate('7/4/1776', undefined, 'MM-DD-YYYY')).toBe('7/4/1776');
            });
            it('render a FR date from a short date', () => {
                let formats = new Formats();
                formats.setLocale('fr-FR');
                expect(formats.formatDate('4/7/1776', undefined, 'DD-MM-YYYY')).toBe('4/7/1776');
            });
        });

        describe('JS Date object', () => {
            it('render a US date from a JS Date', () => {
                let formats = new Formats();
                formats.setLocale('en-US');
                expect(formats.formatDate(new Date(1776, 6, 4))).toBe('7/4/1776');
            });
            it('render a FR date from a JS Date', () => {
                let formats = new Formats();
                formats.setLocale('fr-FR');
                expect(formats.formatDate(new Date(1776, 6, 4))).toBe('4/7/1776');
            });
        });
    });
});
