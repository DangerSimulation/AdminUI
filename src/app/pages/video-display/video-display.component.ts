import {WebRTCConnectionService} from '../../../common/service/web-rtc-connection.service';
import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-video-display',
	templateUrl: './video-display.component.html',
	styleUrls: ['./video-display.component.css']
})
export class VideoDisplayComponent implements OnDestroy {

	@ViewChild('video')
	video: ElementRef<HTMLVideoElement>;

	private trackAddedSubscription: Subscription;

	constructor(private readonly webRTCConnectionService: WebRTCConnectionService) {
		this.trackAddedSubscription = this.webRTCConnectionService.trackAddedSubject.subscribe(value => {
			this.setVideoFeed(value);
		});
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
