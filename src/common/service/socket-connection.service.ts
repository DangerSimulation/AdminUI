import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Server} from 'socket.io';

@Injectable({
	providedIn: 'root'
})
export class SocketConnectionService {

	private socket: Server;
	private socketPort = 11653;

	constructor(private readonly electronService: ElectronService) {
		const options = {
			cors: {
				origin: '*'
			}
		};
		this.socket = this.electronService.remote.require('socket.io')(this.socketPort, options);

		console.log(`Start websocket on port ${this.socketPort}`);

		this.setUpSocket();

		this.electronService.ipcRenderer.on('reload-triggered', () => {
			this.closeSocket();
		});
	}

	public sendMessage(message: string): void {
		this.socket.to('webRTCConnection').emit('message', message);
	}

	private closeSocket(): void {
		this.socket.close();
	}

	private setUpSocket(): void {
		this.socket.on('connection', (socket => {
			socket.join('webRTCConnection');
			console.log('New connection');
		}));
	}
}
