const ipToInt = (ip) => {
  return ip.split('.')
    .reduce((acc, elem) => (acc << 8) + parseInt(elem, 10), 0) >>> 0;
};

const intToIp = (int) => {
  return `${(int >>> 24)}.${(int >> 16 & 255)}.${(int >> 8 & 255)}.${(int & 255)}`;
};

export { ipToInt,  intToIp };