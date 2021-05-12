import {Injectable, OnDestroy} from '@angular/core';
import * as WebSocket from 'ws';
import {Server} from 'ws';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {Side, SignalingMessage} from '../shared/types';
import {IncomingMessage} from 'http';
import {Subscription} from 'rxjs';
import {BroadcastService} from './broadcast.service';
import {ElectronService} from './electron.service';

@Injectable({
	providedIn: 'root'
})
export class SocketConnectionService implements OnDestroy {

	private socketConnection: WebSocket | undefined;
	private socket: Server;
	private socketPort = 11653;
	private signalingMessageSubscription: Subscription;

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
				const message: SignalingMessage = JSON.parse(messageString);
				console.log(`Receive ${message.type}`);

				if (message.sdp) {
					webRTCConnectionService.setDescription(Side.Remote, message).then(value => console.log(`Set remote description`));
				}

				if (message.candidate) {
					delete message.sdp;
					delete message.type;

					webRTCConnectionService.addIceCandidate(message).then(value => console.log('Set candidate'));
				}

			});

			ws.on('close', (ws: WebSocket, code: number, reason: string) => {
				console.log(`Websocket connection closed. Reason ${reason}. Code ${code}`);
				this.socketConnection.close();
				this.socketConnection = undefined;
				this.broadcastService.startSocket();
				this.webRTCConnectionService.resetWebRTCConnection();
			});

			//Start handshake
			webRTCConnectionService.createPeerConnection().then(value => console.log('Created peer'));

		});

		this.signalingMessageSubscription = webRTCConnectionService.signalingMessage.subscribe(value => {
			this.sendMessage(value);
		});

		this.electronService.ipcRenderer.on('reload-triggered', () => {
			//this.closeSocket();
		});

	}

	public sendMessage(message: SignalingMessage): void {
		if (this.socketConnection) {
			console.log(`Send message: ${message.type}`);
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
