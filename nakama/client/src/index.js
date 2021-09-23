import { MultiplayerClient } from './Client';
import { Game } from './game';

window.addEventListener('load', async () => {
    const client = new MultiplayerClient();
    client.init();
    await client.authorize();

	const game = new Game();
	game.create();
	game.start();
});