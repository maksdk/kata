export default (gen) => {
  const it = gen();

  function handleResult({ done, value }) {
    if (done) return value;

    return Promise.resolve(value)
      .then(nextStep)
      .catch(handleError);
  }

  function nextStep(prevValue) {
    return handleResult(it.next(prevValue));
  }

  function handleError(error) {
    return Promise.resolve(it.throw(error))
      .then(handleResult);
  }

  return Promise.resolve(nextStep());
};