import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as WebSocket from 'ws';
import {Data, Server} from 'ws';

@Injectable({
	providedIn: 'root'
})
export class SocketConnectionService {

	private socketConnection: WebSocket[];
	private socket: Server;
	private socketPort = 11653;

	constructor(private readonly electronService: ElectronService) {

		const wss = this.electronService.remote.require('ws');

		this.socket = new wss.Server({port: this.socketPort}, () => {
			console.log('server started');
		});
		this.socket.on('connection', (ws: WebSocket) => {
			this.socketConnection.push(ws);
			console.log(`New connection from ${ws.url}`);

			ws.on('message', (message: Data) => {
				console.log(message);
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
