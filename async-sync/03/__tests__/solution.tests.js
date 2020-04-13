import solution from '../solution';

describe('Request', () => {
  it('set 1', (done) => {
    const link = 'http://localhost:8080/';
    const title = 'Википедия';
    solution(title, link, (err, result) => {
      expect(result).toBe(link);
      done(err);
    });
  });

  it('set 2', (done) => {
    const link = 'http://localhost:8080';
    const title = 'Инструкции';
    solution(title, link, (err, result) => {
      expect(result).toBe(`${link}/statements`);
      done(err);
    });
  });

  it('set 3', (done) => {
    const link = 'http://localhost:8080';
    const title = 'Выражения';
    solution(title, link, (err, result) => {
      expect(result).toBe(`${link}/expressions`);
      done(err);
    });
  });

  it('set 4', (done) => {
    const link = 'http://localhost:8080';
    const title = 'Операции';
    solution(title, link, (err, result) => {
      expect(result).toBe(`${link}/operators`);
      done(err);
    });
  });

  it('set 5', (done) => {
    const link = 'http://localhost:8080';
    const title = 'Нафинг';
    solution(title, link, (err) => {
      expect(err).not.toBeNull();
      done();
    });
  });
});
