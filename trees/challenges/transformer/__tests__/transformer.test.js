import transform from '../transformer';

describe('transform', () => {
    describe('simple tree', () => {
        const tree = ['A', [
            ['B', [
                ['D'],
            ]],
            ['C', [
                ['E'],
                ['F'],
            ]],
        ]];

        it('#simple test1', () => {
            const expected = ['B', [
                ['D'],
                ['A', [
                    ['C', [
                        ['E'],
                        ['F'],
                    ]],
                ]],
            ]];

            const actual = transform(tree, 'B');
            expect(actual).toEqual(expected);
        });
    });

    describe('hard tree', () => {
        const tree = ['A', [
            ['B', [
                ['D', [
                    ['H'],
                ]],
                ['E'],
            ]],
            ['C', [
                ['F', [
                    ['I', [
                        ['M'],
                    ]],
                    ['J', [
                        ['N'],
                        ['O'],
                    ]],
                ]],
                ['G', [
                    ['K'],
                    ['L'],
                ]],
            ]],
        ]];

        it('#hard test 1', () => {
            const expected = ['F', [
                ['I', [
                    ['M'],
                ]],
                ['J', [
                    ['N'],
                    ['O'],
                ]],
                ['C', [
                    ['G', [
                        ['K'],
                        ['L'],
                    ]],
                    ['A', [
                        ['B', [
                            ['D', [
                                ['H'],
                            ]],
                            ['E'],
                        ]],
                    ]],
                ]],
            ]];

            const actual = transform(tree, 'F');
            expect(actual).toEqual(expected);
        });

        it('#hard test 2', () => {
            const expected = ['I', [
                ['M'],
                ['F', [
                    ['J', [
                        ['N'],
                        ['O'],
                    ]],
                    ['C', [
                        ['G', [
                            ['K'],
                            ['L'],
                        ]],
                        ['A', [
                            ['B', [
                                ['D', [
                                    ['H'],
                                ]],
                                ['E'],
                            ]],
                        ]],
                    ]],
                ]],
            ]];

            const actual = transform(tree, 'I');
            expect(actual).toEqual(expected);
        });
    });
});