import {Component} from '@angular/core';
import {WebRTCConnectionService} from '../common/service/web-rtc-connection.service';
import {BroadcastService} from '../common/service/broadcast.service';
import {SocketConnectionService} from '../common/service/socket-connection.service';
import {WebSocketMessage} from '../common/shared/types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'AdminUi';
    inputItemNgModel: any;

    constructor(private readonly webRTCConnectionService: WebRTCConnectionService,
                private readonly broadcastService: BroadcastService,
                private readonly socketConnectionService: SocketConnectionService) {
    }

    public log(): void {
        const message: WebSocketMessage<string> = {
            data: 'lol',
            messageType: this.inputItemNgModel
        };
        this.socketConnectionService.sendMessage(message);
    }
}
