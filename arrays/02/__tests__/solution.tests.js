import apply from '../solution';

describe('apply', () => {
    let cities;

    beforeEach(() => {
        cities = ['moscow', 'london', 'berlin', 'porto'];
    });

    it('reset', () => {
        const expected = apply(cities, 'reset');
        expect(expected).toEqual([]);
    });

    it('get', () => {
        const expected = apply(cities, 'get', 1);
        expect(expected).toEqual('london');
    });

    it('change', () => {
        const expected = apply(cities, 'change', 0, 'miami');
        expect(expected).toEqual(['miami', 'london', 'berlin', 'porto']);
    });

    it('default', () => {
        const expected = apply(cities);
        expect(expected).toEqual(['moscow', 'london', 'berlin', 'porto']);
    });
});