import {Injectable, OnDestroy} from '@angular/core';
import {Socket} from 'dgram';
import {ElectronService} from 'ngx-electron';
import {environment} from '../../environments/environment';
import {Subscription, timer} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BroadcastService implements OnDestroy {

    private socket: Socket;
    private broadcastAddress = '255.255.255.255';
    private broadcaster: Subscription;

    constructor(private readonly electronService: ElectronService) {
        this.startSocket();

        this.electronService.ipcRenderer.on('reload-triggered', () => {
            this.closeSocket();
        });
    }

    public startSocket(): void {
        const dgram = this.electronService.remote.require('dgram');
        this.socket = dgram.createSocket('udp4');
        this.setUpBroadcastListener();
    }

    public closeSocket(): void {
        if (this.socket === null) {
            return;
        }
        this.socket.close();
        this.socket = null;
        this.broadcaster.unsubscribe();
        console.log(`Stop broadcasting`);
    }

    ngOnDestroy(): void {
        this.closeSocket();
    }

    private setUpBroadcastListener(): void {
        const PORT = environment.broadcastPort;

        this.socket.bind(() => {
            this.socket.setBroadcast(true);
            this.broadcaster = timer(0, 5000).subscribe(value => {
                const message = Buffer.from('Connect to websocket to initiate webrtc handshake');
                this.socket.send(message, 0, message.length, PORT, this.broadcastAddress, () => {
                    console.log('Broadcast webrtc initiation request');
                });
            });
        });
    }


}
