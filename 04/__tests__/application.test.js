import fs from 'fs';
import path from 'path';
import {
  html
} from 'js-beautify';

import run from '../src/application';

const htmlOptions = {
  preserve_newlines: true,
  unformatted: [],
};

const fixturesPath = path.join(__dirname, '__fixtures__');
const getTree = () => html(document.body.innerHTML, htmlOptions);

beforeEach(() => {
  const initHtml = fs.readFileSync(path.join(fixturesPath, 'index.html')).toString();
  document.documentElement.innerHTML = initHtml;
  run();
});

test('application', async () => {
  expect(getTree()).toMatchSnapshot();

  const newTaskForm = document.querySelector('[data-container="new-task-form"]');
  const newTaskNameInput = newTaskForm.elements.name;
  newTaskNameInput.setAttribute('value', 'First Task in General');
  newTaskForm.dispatchEvent(new Event('submit'));
  expect(getTree()).toMatchSnapshot();

  newTaskNameInput.setAttribute('value', 'Second Task in General');
  newTaskForm.dispatchEvent(new Event('submit'));
  expect(getTree()).toMatchSnapshot();

  const newListForm = document.querySelector('[data-container="new-list-form"]');
  const newListNameInput = newListForm.elements.name;
  newListNameInput.setAttribute('value', 'Random');
  newListForm.dispatchEvent(new Event('submit'));
  expect(getTree()).toMatchSnapshot();

  const randomList = document.querySelector('[href="#random"]');
  randomList.click();
  expect(getTree()).toMatchSnapshot();

  newTaskNameInput.setAttribute('value', 'First Task in Random');
  newTaskForm.dispatchEvent(new Event('submit'));
  expect(getTree()).toMatchSnapshot();

  const generalList = document.querySelector('[href="#general"]');
  generalList.click();
  expect(getTree()).toMatchSnapshot();
});

test('application', async () => {
  expect(getTree()).toMatchSnapshot();
});