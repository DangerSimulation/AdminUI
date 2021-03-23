import {Injectable} from '@angular/core';
import {WebRTCConnectionService} from './web-rtc-connection.service';
import {SocketConnectionService} from './socket-connection.service';
import {PeerMessage} from '../shared/types';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private readonly webRTCConnectionService: WebRTCConnectionService, private readonly socketConnectionService: SocketConnectionService) {
    }

    public sendMessage(messageType: string, data: unknown): void {
        const message = {
            messageType: messageType,
            data: data
        } as PeerMessage<unknown>;

        switch (environment.communicationType) {
            case 'WebRTC':
                this.webRTCConnectionService.sendMessage(JSON.stringify(message));
                break;
            case 'Socket':
                //this.socketConnectionService.sendMessage(message);
                break;
            default:
                console.log(`Unknown communication type ${environment.communicationType}`);
        }
    }
}
