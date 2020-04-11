export const ipToInt = (ip) => {
  const ipInHex = ip
    .split('.')
    .map((octet) => Number(octet).toString(16).padStart(2, 0))
    .join('');

  return parseInt(ipInHex, 16);
};

export const intToIp = (int) => {
  const ipInHex = int.toString(16).padStart(8, 0);

  return chunk(ipInHex, 2)
    .map((octet) => parseInt(octet.join(''), 16))
    .join('.');
};