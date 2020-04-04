import { chunk } from 'lodash';

export const rgbToHex = (...channels) => {
  const hex = channels
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
};

export const hexToRgb = (hex) => {
  const chars = hex.slice(1).split('');
  const [r, g, b] = chunk(chars, 2)
    .map((channel) => channel.join(''))
    .map((channel) => parseInt(channel, 16));
  return { r, g, b };
};