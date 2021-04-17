import {Injectable} from '@angular/core';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {SocketConnectionService} from './socket-connection.service';
import {BroadcastService} from './broadcast.service';

@Injectable({
	providedIn: 'root'
})
export class SharedService {

	constructor(private webRTC: WebRTCConnectionService, private webSocket: SocketConnectionService, private broadcast: BroadcastService) {
	}
}

