import {ScenarioService} from '../../../common/service/scenario.service';
import {Step} from '../../../common/shared/types';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ScenarioResetComponent} from '../../../common/dialog/scenario-reset/scenario-reset.component';
import {NbDialogService} from '@nebular/theme';

@Component({
	selector: 'app-scenario-control',
	templateUrl: './scenario-control.component.html',
	styleUrls: ['./scenario-control.component.css']
})
export class ScenarioControlComponent implements OnInit {

	constructor(public readonly scenarioService: ScenarioService, private router: Router, private dialogService: NbDialogService) {
	}

	ngOnInit(): void {
		if (this.scenarioService.currentStep === undefined) {
			this.router.navigateByUrl('');
		}
	}

	onSelectClick(step: Step): void {
		switch (step.initiator.event) {
			case 'ScenarioComplete':
				this.getConfirmation().subscribe(value => {
					if (value) {
						this.scenarioService.updateSelectedStep(step);
					}
				});
				break;
			default:
				this.scenarioService.updateSelectedStep(step);
				break;
		}
	}

	private getConfirmation(): Observable<boolean> {
		return new Observable<boolean>(subscriber => {
			this.dialogService.open(ScenarioResetComponent, {
				closeOnBackdropClick: false,
				closeOnEsc: false
			}).onClose.subscribe(arg => {
				this.scenarioService.isDone = arg;

				subscriber.next(arg);
				subscriber.complete();
			});
		});
	}

}
