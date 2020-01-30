import fs from 'fs';
import path from 'path';
import {
   html
} from 'js-beautify';
import keycode from 'keycode';

import run from '../src/application';

const htmlOptions = {
   preserve_newlines: true,
   unformatted: [],
};

const fixuturesPath = path.join(__dirname, '__fixtures__');
const getTree = () => html(document.body.innerHTML, htmlOptions);

const pressKey = (key, el = document.body, value = key) => {
   const keyCode = keycode(key);
   const e = new KeyboardEvent('input', {
      keyCode
   });
   el.value = value; 
   el.setAttribute('value', value);
   el.dispatchEvent(e);
};

beforeAll(() => {
   const initHtml = fs.readFileSync(path.join(fixuturesPath, 'index.html')).toString();
   document.documentElement.innerHTML = initHtml;
   run();
});

test('application', async () => {
   expect(getTree()).toMatchSnapshot();

   const frequencyMin = document.querySelector('input[name="frequency_gt"]');
   frequencyMin.focus();
   pressKey('3', frequencyMin);
   expect(getTree()).toMatchSnapshot();

   pressKey('Backspace', frequencyMin, '');
   expect(getTree()).toMatchSnapshot();

   pressKey('4', frequencyMin);
   expect(getTree()).toMatchSnapshot();

   pressKey('1', frequencyMin);
   expect(getTree()).toMatchSnapshot();

   const frequencyMax = document.querySelector('input[name="frequency_lt"]');
   pressKey('Backspace', frequencyMax, '');
   expect(getTree()).toMatchSnapshot();

   pressKey('2', frequencyMax);
   expect(getTree()).toMatchSnapshot();
});