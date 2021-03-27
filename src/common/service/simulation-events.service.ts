import {Injectable} from '@angular/core';
import {MessageService} from './message.service';
import {SimulationEvents} from '../shared/types';

@Injectable({
    providedIn: 'root'
})
export class SimulationEventsService {

    constructor(private messageService: MessageService) {
    }

    public sendSimulationEvent(event: SimulationEvents): void {
        console.log(`Send ${event} to simulation`);
        this.messageService.sendMessage(event);
    }

}
