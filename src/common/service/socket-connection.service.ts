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
    private iceCandidateSubscription: Subscription;
    private answerSubscription: Subscription;
    private offerSubscription: Subscription;

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
                const message: PeerMessage = JSON.parse(messageString, sdpTypeConverter);
                console.log(`Receive message: description is ${message.description.sdp === null ? 'null' : message.description.type}. candidate is ${message.candidate === null ? 'null' : JSON.stringify(message.candidate)}`);

                this.webRTCConnectionService.onSignalingMessage(message.description, message.candidate);
            });

            ws.on('close', (ws: WebSocket, code: number, reason: string) => {
                console.log(`Websocket connection closed. Reason ${reason}. Code ${code}`);
                this.socketConnection = undefined;
                this.broadcastService.startSocket();
            });

            window.onbeforeunload = () => this.ngOnDestroy();

        });

        this.electronService.ipcRenderer.on('reload-triggered', () => {
            this.closeSocket();
        });

        this.iceCandidateSubscription = this.webRTCConnectionService.iceCandidateSubject.subscribe(value => {
            if (value !== null) {
                this.sendMessage(undefined, value);
            }
        });

        this.answerSubscription = this.webRTCConnectionService.answerSubject.subscribe(value => {
            this.sendMessage(value, undefined);
        });

        this.offerSubscription = this.webRTCConnectionService.offerSubject.subscribe(value => {
            this.sendMessage(value, undefined);
        });
    }

    public sendMessage(description: RTCSessionDescription | undefined, candidate: RTCIceCandidate | undefined): void {
        if (this.socketConnection) {
            const message: PeerMessage = {
                candidate: candidate,
                description: description
            };

            console.log(`Send message: description is ${message.description === undefined ? 'null' : message.description.type}. candidate is ${message.candidate === undefined ? 'null' : message.candidate.type}`);
            this.socketConnection.send(JSON.stringify(message));
        }
    }

    ngOnDestroy(): void {
        this.closeSocket();
    }

    private closeSocket(): void {
        this.socket.close();
    }


}
