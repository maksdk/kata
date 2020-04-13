import crypto from 'crypto';

import solution from '../solution';

describe('Request', () => {
  it('set 1', (done) => {
    const registrationFormUrl = 'http://localhost:8080';
    const submitFormUrl = 'http://localhost:8080/users';
    const nickname = crypto.randomBytes(16).toString('hex');
    solution(registrationFormUrl, submitFormUrl, nickname, (err) => {
      expect(err).toBeNull();
      done();
    });
  });

  it('set 2', (done) => {
    const registrationFormUrl = 'http://localhost:8080/wrong';
    const submitFormUrl = 'http://localhost:8080/users';
    const nickname = crypto.randomBytes(16).toString('hex');
    solution(registrationFormUrl, submitFormUrl, nickname, (err) => {
      expect(err).toBeInstanceOf(Error);
      done();
    });
  });

  it('set 3', (done) => {
    const registrationFormUrl = 'http://localhost:8080';
    const submitFormUrl = 'http://localhost:8080/userstest';
    const nickname = crypto.randomBytes(16).toString('hex');
    solution(registrationFormUrl, submitFormUrl, nickname, (err) => {
      expect(err).toBeInstanceOf(Error);
      done();
    });
  });
});
