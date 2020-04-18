export default (gen) => {
  const iterator = gen();

  const iter = ({ done, value }) => {
    if (done) return value;
    return value.then((res) => iter(iterator.next(res)));
  };

  return iter(iterator.next())
    .catch((err) => iter(iterator.throw(err)));
};