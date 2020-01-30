//@ts-check
import itinerary from '../itinerary';

describe('Itinerary', () => {
    const tree = ['Moscow', [
        ['Smolensk'],
        ['Yaroslavl'],
        ['Voronezh', [
            ['Liski'],
            ['Boguchar'],
            ['Kursk', [
                ['Belgorod', [
                    ['Borisovka'],
                ]],
                ['Kurchatov'],
            ]],
        ]],
        ['Ivanovo', [
            ['Kostroma'],
            ['Kineshma'],
        ]],
        ['Vladimir'],
        ['Tver', [
            ['Klin'],
            ['Dubna'],
            ['Rzhev'],
        ]],
    ]];

    it('route 1', () => {
        const route = ['Dubna', 'Tver', 'Moscow', 'Ivanovo', 'Kostroma'];
        expect(itinerary(tree, 'Dubna', 'Kostroma')).toEqual(route);
    });

    it('route 2', () => {
        const route2 = ['Borisovka', 'Belgorod', 'Kursk', 'Kurchatov'];
        expect(itinerary(tree, 'Borisovka', 'Kurchatov')).toEqual(route2);
    });
});