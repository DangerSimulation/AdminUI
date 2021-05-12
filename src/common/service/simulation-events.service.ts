import {Injectable, OnDestroy} from '@angular/core';
import {MessageService} from './message.service';
import {NbToastrService} from '@nebular/theme';
import {SimulationMessage} from '../shared/types';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {Subscription} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SimulationEventsService implements OnDestroy {

	private systemUpdateMessageSubscription: Subscription;

	constructor(private webRTCConnectionService: WebRTCConnectionService, private messageService: MessageService, private toasterService: NbToastrService) {
		this.systemUpdateMessageSubscription = webRTCConnectionService.systemUpdateMessageSubject.subscribe(value => {
			if (value.action === 'UnknownEvent') {
				const errMessage = `Unknown event ${value.additionalData}. The simulation doesnt have it implemented or the name is wrong.`;
				this.toasterService.danger(errMessage, 'Event error');
				console.error(errMessage);
			}
		});
	}

	public sendSimulationEvent(message: SimulationMessage<unknown>, event: string): void {
		this.messageService.sendMessage(message);
	}

	ngOnDestroy(): void {
		this.systemUpdateMessageSubscription.unsubscribe();
	}

}
