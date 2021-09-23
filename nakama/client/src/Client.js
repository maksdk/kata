// @ts-check
import { Client } from "@heroiclabs/nakama-js";

export class MultiplayerClient {
    constructor() {
        this.socket = null;
        this.client = null;
    }

    init() {
        this.client = new Client("defaultkey", "192.168.2.209", "7350", false);

        this.socket = this.client.createSocket(false, false);
        
        this.socket.ondisconnect = (event) => {
            console.info("Disconnected from the server. Event:", event);
        };
        this.socket.onnotification = (notification) => {
            console.info("Received notification:", notification);
        };
        this.socket.onchannelpresence = (presence) => {
            console.info("Received presence update:", presence);
        };
        this.socket.onchannelmessage = (message) => {
            console.info("Received new chat message:", message);
        };
        this.socket.onmatchdata = (matchdata) => {
            console.info("Received match data: %o", matchdata);
        };
        this.socket.onmatchpresence = (matchpresence) => {
            console.info("Received match presence update:", matchpresence);
        };
        this.socket.onmatchmakermatched = (matchmakerMatched) => {
            console.info("Received matchmaker update:", matchmakerMatched);
        };
        this.socket.onstatuspresence = (statusPresence) => {
            console.info("Received status presence update:", statusPresence);
        };
        this.socket.onstreampresence = (streamPresence) => {
            console.info("Received stream presence update:", streamPresence);
        };
        this.socket.onstreamdata = (streamdata) => {
            console.info("Received stream data:", streamdata);
        };
    }

    async authorize() {
        try {
            const customId = this.generateId();
            const session = await this.client.authenticateCustom("customId", true);
    
            console.info("Successfully authenticated:", session);
    
            await this.socket.connect(session, false);
        } catch (e) {
            console.log('Error: ', e);
        }
    }

    async callRpc() {
        try {
            const response = await this.socket.send({
                rpc: {
                    id: 'GetMatchRpc',
                    payload: JSON.stringify({})
                }
            });
            return response;
        } catch(e) {
            console.error('Error:', e);
        }
    }

    async join() {
        const response = await this.callRpc();
        const payload = JSON.parse(response.rpc.payload);

        try {
            this.socket.send({
                match_join: {
                    match_id: payload.matchId
                }
            });
        } catch(e) {
            console.error('Error:', e);
        }
    }

    generateId() {
        return [...Array(30)].map(() => Math.random().toString(36)[3]).join('');
    }
}