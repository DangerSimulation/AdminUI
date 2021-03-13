import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as WebSocket from 'ws';
import {Server} from 'ws';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {sdpTypeConverter} from '../shared/utils';
import {WebSocketMessage} from '../shared/types';
import {IncomingMessage} from 'http';

@Injectable({
    providedIn: 'root'
})
export class SocketConnectionService {

    private socketConnection: WebSocket | undefined;
    private socket: Server;
    private socketPort = 11653;

    constructor(private readonly electronService: ElectronService, private readonly webRTCConnectionService: WebRTCConnectionService) {

        const wss = this.electronService.remote.require('ws');

        this.socket = new wss.Server({port: this.socketPort}, () => {
            console.log(`server started on port ${this.socketPort}`);
        });
        this.socket.on('connection', (ws: WebSocket, request: IncomingMessage) => {
            if (request.headers.from !== 'Simulation') {
                console.log(`Invalid connection request from ${request.socket.remoteAddress}`);
            }

            if (this.socketConnection) {
                console.log(`New valid connection request from ${request.socket.remoteAddress}. Already got one connection. Ignoring the new one`);
            }

            console.log(`New connection from ${request.socket.remoteAddress}`);
            this.socketConnection = ws;
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

            ws.on('close', (ws: WebSocket, code: number, reason: string) => {
                console.log(`Websocket connection closed. Reason ${reason}. Code ${code}`);
                this.socketConnection = undefined;
            });

        });

        this.electronService.ipcRenderer.on('reload-triggered', () => {
            this.closeSocket();
        });
    }

    public sendMessage(message: WebSocketMessage<any>): void {
        if (this.socketConnection) {
            this.socketConnection.send(message);
        }
    }

    private closeSocket(): void {
        this.socket.close();
    }

}
