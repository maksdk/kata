import Game from './game.js';

window.addEventListener('load', () => {
  const game = new Game();
  game.create();
  game.start();
});