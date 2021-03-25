import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../common/service/message.service';
import {WebRTCConnectionService} from '../common/service/web-rtc-connection.service';
import {Subscription} from 'rxjs';
import {ScenarioListService} from '../common/service/scenario-list.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
    title = 'AdminUi';
    inputItemNgModel: any;
    @ViewChild('video')
    video: ElementRef<HTMLVideoElement>;

    private trackAddedSubscription: Subscription;

    constructor(private readonly messageService: MessageService, private readonly webRTCConnectionService: WebRTCConnectionService, private readonly scenarioListService: ScenarioListService) {
        this.trackAddedSubscription = this.webRTCConnectionService.trackAddedSubject.subscribe(value => {
            this.setVideoFeed(value);
        });
    }

    public log(): void {
        this.messageService.sendMessage('lol', this.inputItemNgModel);
    }

    public setVideoFeed(track: RTCTrackEvent): void {
        track.track.onunmute = () => {
            this.video.nativeElement.srcObject = track.streams[0];
            console.log(track);
        };
    }

    ngOnDestroy(): void {
        this.trackAddedSubscription.unsubscribe();
    }
}
