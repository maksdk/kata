import crypto from 'crypto';

import solution from '../solution';

describe('Request', () => {
  it('set 1', async () => {
    const registrationFormUrl = 'http://localhost:8080';
    const submitFormUrl = 'http://localhost:8080/users';
    const nickname = crypto.randomBytes(16).toString('hex');
    await solution(registrationFormUrl, submitFormUrl, nickname);
  });

  it('set 2', async () => {
    const registrationFormUrl = 'http://localhost:8080/wrong';
    const submitFormUrl = 'http://localhost:8080/users';
    const nickname = crypto.randomBytes(16).toString('hex');
    const fn = () => solution(registrationFormUrl, submitFormUrl, nickname);
    await expect(fn()).rejects.toThrow(Error);
  });

  it('set 3', async () => {
    const registrationFormUrl = 'http://localhost:8080';
    const submitFormUrl = 'http://localhost:8080/userstest';
    const nickname = crypto.randomBytes(16).toString('hex');
    const fn = () => solution(registrationFormUrl, submitFormUrl, nickname);
    await expect(fn()).rejects.toThrow(Error);
  });
});
