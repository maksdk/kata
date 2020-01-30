import fs from 'fs';
import path from 'path';
import {
  html
} from 'js-beautify';
import timer from 'timer-promise';
import userEvent from '@testing-library/user-event';
import nock from 'nock';

import run from '../src/application';

nock.disableNetConnect();

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
  nock('http://localhost')
    .post('/users')
    .reply(200);
});

test('application', async () => {
  expect(getTree()).toMatchSnapshot();

  const form = document.querySelector('[data-form="sign-up"]');
  const nameInput = document.getElementById('sign-up-name');
  const emailInput = document.getElementById('sign-up-email');
  const passwordInput = document.getElementById('sign-up-password');
  const passwordConfirmationInput = document.getElementById('sign-up-password-confirmation');

  nameInput.setAttribute('value', 'Petya');
  await userEvent.type(nameInput, 'Petya', {
    allAtOnce: true
  });
  emailInput.setAttribute('value', 'wrong-email');
  await userEvent.type(emailInput, 'wrong-email', {
    allAtOnce: true
  });
  passwordInput.setAttribute('value', 'long password without confirmation');
  await userEvent.type(passwordInput, 'long password without confirmation', {
    allAtOnce: true
  });

  await timer.start(10);
  expect(getTree()).toMatchSnapshot();

  emailInput.setAttribute('value', '');
  await userEvent.type(emailInput, '', {
    allAtOnce: true
  });
  passwordInput.setAttribute('value', 'qwert');
  await userEvent.type(passwordInput, 'qwert', {
    allAtOnce: true
  });

  await timer.start(10);
  expect(getTree()).toMatchSnapshot();

  emailInput.setAttribute('value', 'support@hexlet.io');
  await userEvent.type(emailInput, 'support@hexlet.io', {
    allAtOnce: true
  });
  passwordConfirmationInput.setAttribute('value', 'qwerty');
  await userEvent.type(passwordConfirmationInput, 'qwerty', {
    allAtOnce: true
  });

  await timer.start(10);
  expect(getTree()).toMatchSnapshot();

  form.dispatchEvent(new Event('submit'));
  await timer.start(10);
  await timer.start(10);
  await timer.start(10);
  await timer.start(10);
  expect(getTree()).toMatchSnapshot();
});

test('application', async () => {
  expect(getTree()).toMatchSnapshot();
});