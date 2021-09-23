import { Game } from './game';

window.addEventListener('load', () => {
	const game = new Game();
	game.create();
	game.start();
});