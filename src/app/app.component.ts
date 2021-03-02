import { Component } from '@angular/core';
import {WebRTCConnectionService} from '../common/service/web-rtc-connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdminUi';
  inputItemNgModel: any;

  constructor(private readonly webRTCConnectionService: WebRTCConnectionService) {
  }

  public log(): void {
    this.webRTCConnectionService.setRemoteDescription(this.inputItemNgModel);
  }
}
