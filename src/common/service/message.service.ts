import {Injectable} from '@angular/core';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {SimulationMessage} from '../shared/types';

@Injectable({
	providedIn: 'root'
})
export class MessageService {

	constructor(private readonly webRTCConnectionService: WebRTCConnectionService) {
	}

	public sendMessage(message: SimulationMessage<unknown>): void {
		console.log(`Send event ${message.eventType} to simulation. Data: ${JSON.stringify(message.data)}`);
		this.webRTCConnectionService.sendMessage(message);
	}
}
