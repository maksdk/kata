//@ts-check
const itinerary = (tree, fromName, toName) => {

    const findPathes = (node, currAcc, acc) => {
        const [ name, children ] = node;
        const newAcc = [...currAcc, name ];

        if (name === fromName) return [newAcc, ...acc ];
        if (name === toName) return [...acc, newAcc ];
        if (!children) return acc;

        return children.reduce((initAcc, child) => findPathes(child, newAcc, initAcc), acc);
    }
    const pathes = findPathes(tree, [], []);
    const [ fromPath, toPath ] = pathes;

    let commonNodeName = "";
    for(let i = fromPath.length - 1; i >= 0; i--) {
        const name = toPath.find(name => name === fromPath[i]);
        if (name) {
            commonNodeName = name;
            break;
        }
    }

    const fromIndex = fromPath.findIndex(name => name === commonNodeName);
    const toIndex = toPath.findIndex(name => name === commonNodeName);

    const restFromPath = fromPath.splice(fromIndex + 1, fromPath.length);
    const restToPath = toPath.splice(toIndex + 1, toPath.length);

    const result = [...restFromPath.reverse(), commonNodeName, ...restToPath];
    return result;
};

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

console.log(itinerary(tree, 'Dubna', 'Kostroma'))
console.log(itinerary(tree, 'Borisovka', 'Kurchatov'))


// export default itinerary;