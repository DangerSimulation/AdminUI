import {Injectable, OnDestroy} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as WebSocket from 'ws';
import {Server} from 'ws';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {sdpTypeConverter} from '../shared/utils';
import {PeerMessage} from '../shared/types';
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
    private answerSubscription: Subscription;

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
                console.log(`Receive message with type ${potentialType[1]}`);
                switch (potentialType[1]) {
                    case 'offer':
                        const offerMessage: PeerMessage<RTCSessionDescriptionInit> = JSON.parse(messageString, sdpTypeConverter);
                        this.webRTCConnectionService.setRemoteDescription(offerMessage.data);
                        break;
                    case 'iceCandidate':
                        const iceCandidateMessage: PeerMessage<RTCIceCandidate> = JSON.parse(messageString);
                        this.webRTCConnectionService.addIceCandidate(iceCandidateMessage.data);
                        break;
                    default:
                        console.log(`Invalid message type: ${potentialType[1]}`);
                }
            });

            ws.on('close', (ws: WebSocket, code: number, reason: string) => {
                console.log(`Websocket connection closed. Reason ${reason}. Code ${code}`);
                this.socketConnection = undefined;
                this.broadcastService.startSocket();
                this.webRTCConnectionService.reactToConnectionLoss();
            });

        });

        this.electronService.ipcRenderer.on('reload-triggered', () => {
            this.closeSocket();
        });

        this.setRemoteDescriptionSubscription = this.webRTCConnectionService.setRemoteDescriptionSubject.subscribe(value => {
            const message = {
                messageType: 'offerResponse',
                data: value
            } as PeerMessage<boolean>;
            this.sendMessage(message);
        });

        this.iceCandidateSubscription = this.webRTCConnectionService.iceCandidateSubject.subscribe(value => {
            if (value === null) {
                return;
            }
            const message = {
                messageType: 'iceCandidate',
                data: value
            } as PeerMessage<RTCIceCandidate>;
            this.sendMessage(message);
        });

        this.answerSubscription = this.webRTCConnectionService.answerSubject.subscribe(value => {
            const message = {
                messageType: 'answer',
                data: value
            } as PeerMessage<RTCSessionDescription>;
            this.sendMessage(message);
        });
    }

    public sendMessage(message: PeerMessage<unknown>): void {
        if (this.socketConnection) {
            console.log(`Send message with type ${message.messageType}`);
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
