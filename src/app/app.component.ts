import {Component, OnDestroy} from '@angular/core';
import {WebRTCConnectionService} from '../common/service/web-rtc-connection.service';
import {ElectronService} from 'ngx-electron';
import {Socket} from 'dgram';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'AdminUi';
  inputItemNgModel: any;
  private client: Socket;

  constructor(private readonly webRTCConnectionService: WebRTCConnectionService, private readonly electronService: ElectronService) {
    const dgram = this.electronService.remote.require('dgram');
    this.client = dgram.createSocket('udp4');
    this.lol();
  }

  private lol(): void {
    const PORT = 12548;

    this.client.on('listening',  () => {
      const address = this.client.address();
      console.log('UDP Client listening on ' + address.address + ':' + address.port);
      this.client.setBroadcast(true);
    });

    this.client.on('message', (message: string, rinfo: any) => {
      console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
    });

    this.client.bind(PORT);

  }

  ngOnDestroy(): void {
    this.client.close();
  }

  public log(): void {
    this.webRTCConnectionService.setRemoteDescription(this.inputItemNgModel);
  }
}
