import { isObject, mergeDeep } from './object-assign-deep';

describe('Util: isObject', () => {
    describe('Function: isObject(item)', () => {
        it('should return true if object is object', () => {
            expect(isObject({})).toBe(true);
        });
        it('should return false if object is array', () => {
            expect(isObject([])).toBe(false);
        });
        it('should return false if object is String', () => {
            expect(isObject('Test')).toBe(false);
        });
        it('should return false if object is Number', () => {
            expect(isObject(123)).toBe(false);
        });
    });
});

describe('Util: mergeDeep', () => {
    describe('Function: mergeDeep(target, source)', () => {
        it('should merge two basic objects', () => {
            const a = { a: 1 };
            const b = { b: { c: { d: 1 } } };
            const result = { a: 1, b: { c: { d: 1 } } };
            expect(mergeDeep(a, b)).toEqual(result);
        });
        it('should merge two complex objects', () => {
            const a = { a: 1, e: [2] };
            const b = { b: { c: { d: [1, 2, 3] } }, e: [1] };
            const result = { a: 1, b: { c: { d: [1, 2, 3] } }, e: [2, 1] };
            expect(mergeDeep(a, b)).toEqual(result);
        });
    });
});