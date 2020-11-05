/**
 * Use enum like a name in function params
 */
enum Screens {
    Intro = 'Intro',
    Gameplay = 'Gameplay',
    Outro = 'Outro'
}

function addScreen(screenName: keyof typeof Screens) {
    return '';
}
addScreen('Intro'); // correct
addScreen(''); // wrong


/**
 * See types of object by keys
 */
const list = {
    id: 1,
    text: 'Text',
    due: new Date()
};

function getProp<O, K extends keyof O>(obj: O, key: K): O[K] {
    return obj[key];
}

getProp(list, 'id'); // correct
getProp(list, 'idd'); // wrong