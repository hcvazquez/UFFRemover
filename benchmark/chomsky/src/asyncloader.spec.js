import { AsyncLoader } from './asyncloader';

describe('Class: AsyncLoader', () => {
    it('should be defined', () => {
        let instance = new AsyncLoader();
        expect(instance).toBeDefined();
    });

    describe('Method: load(url)', () => {
        it('should be defined', () => {
            let instance = new AsyncLoader();
            expect(instance.load).toBeDefined();
        });
    });
});