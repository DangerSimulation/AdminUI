import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as WebSocket from 'ws';
import {Server} from 'ws';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {sdpTypeConverter} from '../shared/utils';
import {WebSocketMessage} from '../shared/types';

@Injectable({
    providedIn: 'root'
})
export class SocketConnectionService {

    private socketConnection: WebSocket[] = [];
    private socket: Server;
    private socketPort = 11653;

    constructor(private readonly electronService: ElectronService, private readonly webRTCConnectionService: WebRTCConnectionService) {

        const wss = this.electronService.remote.require('ws');

        this.socket = new wss.Server({port: this.socketPort}, () => {
            console.log('server started');
        });
        this.socket.on('connection', (ws: WebSocket) => {
            this.socketConnection.push(ws);
            console.log(`New connection from ${ws.url}`);

            ws.on('message', (messageString: string) => {
                const potentialType = messageString.match(/"messageType":"([a-zA-Z]+)"/);
                if (potentialType.length !== 2) {
                    console.error(`Message structure of message is invalid. Message: ${messageString}`);
                    return;
                }

                switch (potentialType[1]) {
                    case 'offer':
                        const message: WebSocketMessage<RTCSessionDescriptionInit> = JSON.parse(messageString, sdpTypeConverter);
                        this.webRTCConnectionService.setRemoteDescription(message.data);
                        break;
                    default:
                        console.log(`Invalid message type: ${potentialType[1]}`);
                }
            });

        });
        this.socket.on('listening', () => {
            console.log('listening on ' + this.socketPort);
        });

        this.electronService.ipcRenderer.on('reload-triggered', () => {
            this.closeSocket();
        });
    }

    public sendMessage(message: string): void {
        this.socketConnection.forEach(ws => ws.send(message));
    }

    private closeSocket(): void {
        this.socket.close();
        this.socketConnection.forEach(ws => ws.close());
    }

}
