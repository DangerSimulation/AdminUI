import {Injectable, OnDestroy} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as WebSocket from 'ws';
import {Server} from 'ws';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {sdpTypeConverter} from '../shared/utils';
import {WebSocketMessage} from '../shared/types';
import {IncomingMessage} from 'http';
import {Subscription} from 'rxjs';
import {BroadcastService} from './broadcast.service';

@Injectable({
    providedIn: 'root'
})
export class SocketConnectionService implements OnDestroy {

    private socketConnection: WebSocket | undefined;
    private socket: Server;
    private socketPort = 11653;
    private setRemoteDescriptionSubscription: Subscription;
    private iceCandidateSubscription: Subscription;

    constructor(private readonly electronService: ElectronService, private readonly webRTCConnectionService: WebRTCConnectionService,
                private readonly broadcastService: BroadcastService) {

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
            this.broadcastService.closeSocket();
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
                this.broadcastService.startSocket();
            });

        });

        this.electronService.ipcRenderer.on('reload-triggered', () => {
            this.closeSocket();
        });

        this.setRemoteDescriptionSubscription = this.webRTCConnectionService.setRemoteDescriptionSubject.subscribe(value => {
            const message = {
                messageType: 'offerResponse',
                data: value
            } as WebSocketMessage<boolean>;
            this.sendMessage(message);
        });

        this.iceCandidateSubscription = this.webRTCConnectionService.iceCandidateSubject.subscribe(value => {
            const message = {
                messageType: 'answer',
                data: value
            } as WebSocketMessage<RTCSessionDescription>;
            this.sendMessage(message);
        });
    }

    public sendMessage(message: WebSocketMessage<unknown>): void {
        if (this.socketConnection) {
            this.socketConnection.send(JSON.stringify(message));
        }
    }

    ngOnDestroy(): void {
        this.closeSocket();
    }

    private closeSocket(): void {
        this.socket.close();
        if (!this.setRemoteDescriptionSubscription.closed) {
            this.setRemoteDescriptionSubscription.unsubscribe();
        }
    }


}
