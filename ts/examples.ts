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


/**
 * Generic conditional
 */
type R<T> = T extends number ? [number] : string;

const res1: R<number> = [1];

const res2: R<boolean> = 'string';


 /**
  * Combine types #1
  */
type A = { key1: string, key2: number };
type B = { key2: number, key3: boolean };
type C = A & B;
const res = (a: C) => a.key2;


/**
 * Combine types #2
 */
type DifferentKeys<T, U> = Omit<T, keyof U> & Omit<U, keyof T>;
type SameKeys<T, U> = Omit<T | U, keyof DifferentKeys<T, U>>;