import {SharedService} from '../common/service/shared.service';
import {Component} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	public leftColumnFlex = 0.3;
	private mouseMoveSubscription: Subscription;
	private mouseUpSubscription: Subscription;
	private mouseX = 90000;

	//Import the shared service here to have all important services loaded all the time
	constructor(private sharedService: SharedService) {
		this.mouseUpSubscription =
			fromEvent(document, 'mouseup')
				.subscribe(e => {
					if (this.mouseMoveSubscription !== undefined) {
						this.mouseMoveSubscription.unsubscribe();
					}
					this.mouseX = 90000;
				});
	}

	public startResize(): void {
		this.mouseMoveSubscription =
			fromEvent(document, 'mousemove')
				.subscribe((e: MouseEvent) => {
					if (this.mouseX === 90000) {
						this.mouseX = e.x;
						return;
					}

					const dir = e.x - this.mouseX;
					this.leftColumnFlex += dir * 0.001;

					this.mouseX = e.x;
				});
	}

	public onDragStart(): boolean {
		return false;
	}

	public onDrop(): boolean {
		return false;
	}

	ngOnDestroy() {
		this.mouseMoveSubscription.unsubscribe();
		this.mouseUpSubscription.unsubscribe();
	}
}
