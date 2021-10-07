import { AbstractScriptType } from '@core/AbstractScriptType';
/* eslint-disable */

export const createScript = (scriptName: string) => {
    return (obj: typeof pc.ScriptType) => {
        scriptName = scriptName || obj.name;
        scriptName = scriptName[0].toLowerCase() + scriptName.slice(1);
        pc.registerScript(obj, scriptName);

        const stack = [];
        // @ts-ignore
        const attributes = obj._attributes;
        let _attributes: any = {};

        // adding prototypes to stack
        let proto = Object.getPrototypeOf(obj);

        while (proto !== AbstractScriptType) {
            stack.push(proto);
            proto = Object.getPrototypeOf(proto);
        }

        // extending _attributes by prototypes attributes
        while (stack.length) {
            proto = stack.pop();

            _attributes = { ..._attributes, ...proto._attributes };
        }

        // adding current attributes to _attributes
        if (attributes) {
            _attributes = { ..._attributes, ...attributes };
        }

        // applying _attributes
        for (const key in _attributes) {
            obj.attributes.add(key, _attributes[key]);
        }
    }
};
