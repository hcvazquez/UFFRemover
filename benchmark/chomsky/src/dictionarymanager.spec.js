/* globals describe, it, xit, expect, afterEach, beforeEach */
import { DictionaryManager } from './dictionarymanager';

describe('Class: DictionaryManager', () => {
    let dictionaryManager;

    beforeEach(() => {
        dictionaryManager = new DictionaryManager();
    });

    describe('contains(locale)', () => {
        it('should be defined', () => {
            expect(dictionaryManager.contains).toBeDefined();
        });
        it('should return true if it contains the locale', ()=> {
            dictionaryManager.dictionaries = {
                test: {}
            };
            expect(dictionaryManager.contains('test')).toBe(true);
        });
        it('should return false if it does not contains the locale', ()=> {
            expect(dictionaryManager.contains('test')).toBe(false);
        });
    });

    describe('get(locale)', () => {
        it('should be defined', () => {
            expect(dictionaryManager.get).toBeDefined();
        });
        it('should return the locale if it exists', ()=> {
            dictionaryManager.dictionaries = {
                test: {}
            };
            expect(dictionaryManager.get('test')).toEqual({});
        });
        it('should return if it does not contains the locale', ()=> {
            expect(dictionaryManager.get('test')).not.toBeDefined();
        });
    });

    describe('add(locale, translations, fallbackTranslations)', () => {
        it('should be defined', () => {
            expect(dictionaryManager.add).toBeDefined();
        });
        it('should add properly', ()=> {
            dictionaryManager.add('test', { 'MESSAGE': 'HI' }, { 'FALLBACK': 'FALL', 'MESSAGE': 'NOPE' });
            expect(dictionaryManager.get('test')).toEqual({
                'MESSAGE': 'HI',
                'FALLBACK': 'FALL'
            })
        });
    });
});
