import {Injectable} from '@angular/core';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {SimulationEvents} from '../shared/types';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private readonly webRTCConnectionService: WebRTCConnectionService) {
    }

    public sendMessage(message: SimulationEvents): void {
        this.webRTCConnectionService.sendMessage(message);
    }
}
