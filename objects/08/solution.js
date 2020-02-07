//@ts-check
import CRC32 from "crc-32";

export function make() { 
    return []; 
} 

export function get(map, key, defaultValue = null) {
    const index = getIndex(key);

    if (!isExisted(map, index)) {
        return defaultValue;
    }

    const [,value] = map[index];
    return value;
}

export function set(map, key, value) { 
    const index = getIndex(key);
    
    if(isExisted(map, index)) {
        const [existedKey] = map[index];
        if (existedKey !== key) return false;
    }
    
    map[index] = [key, value];

    return true;
} 

function isExisted(map, index) {
    if (typeof map[index] === "undefined") return false;
    return true;
}


function getIndex(key) {
    const hash = CRC32.str(key);
    const index = Math.abs(hash % 1000);
    return index;
}
