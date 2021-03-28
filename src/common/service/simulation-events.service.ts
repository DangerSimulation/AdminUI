import {Injectable} from '@angular/core';
import {MessageService} from './message.service';
import {NbToastrService} from '@nebular/theme';
import {SimulationMessage} from '../shared/types';

@Injectable({
    providedIn: 'root'
})
export class SimulationEventsService {

    private knownEvents: string[] = [
        'DrowningMan',
        'StrandSelected',
        'SceneCancel'
    ];

    constructor(private messageService: MessageService, private toasterService: NbToastrService) {
    }

    public sendSimulationEvent(message: SimulationMessage<unknown>, event: string): void {
        if (this.knownEvents.includes(event)) {
            this.messageService.sendMessage(message);
        } else {
            const errMessage = `Unknown event ${event}. Check the simulation-scenario.json or add ${event} to the known events.`;
            this.toasterService.danger(errMessage, 'Event error');
            console.error(`Unknown event ${event}. Check the simulation-scenario.json or add ${event} to the known events.`);
        }
    }

}
