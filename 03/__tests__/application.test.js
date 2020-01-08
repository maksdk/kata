import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';

import run from '../src/application';

const htmlOptions = {
  preserve_newlines: false,
  unformatted: [],
};

const fixuturesPath = path.join(__dirname, '__fixtures__');
const getTree = () => html(document.body.innerHTML, htmlOptions);

beforeAll(() => {
  const initHtml = fs.readFileSync(path.join(fixuturesPath, 'index.html')).toString();
  document.documentElement.innerHTML = initHtml;
  run();
});

test('application', async () => {
  expect(getTree()).toMatchSnapshot();

  const name = document.querySelector('[data-editable-target="name"]');
  name.click();
  expect(getTree()).toMatchSnapshot();

  const form1 = document.querySelector('form');
  const input1 = form1.elements.name;
  input1.setAttribute('value', 'Hexlet');
  form1.dispatchEvent(new Event('submit'));
  expect(getTree()).toMatchSnapshot();

  const email = document.querySelector('[data-editable-target="email"]');
  email.click();
  expect(getTree()).toMatchSnapshot();

  const form2 = document.querySelector('form');
  const input2 = form2.elements.email;
  input2.setAttribute('value', 'support@hexlet.io');
  form2.dispatchEvent(new Event('submit'));
  expect(getTree()).toMatchSnapshot();

  name.click();
  const form3 = document.querySelector('form');
  const input3 = form3.elements.name;
  input3.setAttribute('value', '');
  form3.dispatchEvent(new Event('submit'));
  expect(getTree()).toMatchSnapshot();
});
