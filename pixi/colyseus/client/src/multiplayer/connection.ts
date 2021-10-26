import { Client } from 'colyseus.js';
const client = new Client('ws://localhost:2567');

export async function connect () {
    try {
        const room = await client.joinOrCreate('my_room');

    room.onStateChange((newState: any) => {
        console.log('New state:', newState);
    });

    room.onLeave((code: any) => {
        console.log('You\'ve been disconnected.', code);
    });

    } catch (e) {
        console.error('Couldn\'t connect:', e);
    }
}