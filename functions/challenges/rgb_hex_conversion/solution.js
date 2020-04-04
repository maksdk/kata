const toHex = (val) => {
  const res = val.toString(16);
  return res.length === 1 ? `0${res}` : res;
}

const rgbToHex = (r, g, b) => {
  const hex = [r, g, b]
    .map(v => toHex(v))
    .join('');

  return `#${hex}`;
};

const hexToRgb = (hex) => {
  const [r, g, b] = hex
    .substring(1, hex.length)
    .match(/.{1,2}/g)
    .map(val => parseInt(val, 16)); 

  return { r, g, b };
};

export { hexToRgb, rgbToHex };