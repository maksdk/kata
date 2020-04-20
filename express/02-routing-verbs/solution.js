// @ts-check

import Express from 'express';

export default () => {
  // BEGIN (write your solution here)
  const app = new Express();

  let data = { value: 0 };

  app.get('/', (req, res) => {
    res.status(200).json(data);
  });

  app.post('/increment', (req, res) => {
    data.value += 1;
    res.status(204).end();
  });

  app.post('/decrement', (req, res) => {
    data.value -= 1;
    res.status(204).end()
  });

  app.put('/set', (req, res) => {
    const { value } = req.query;
    data.value = Number(value);
    res.status(204).end();
  });

  app.delete('/reset', (req, res) => {
    data = { value: 0 };
    res.status(204).end();
  });
  // END

  return app;
};
