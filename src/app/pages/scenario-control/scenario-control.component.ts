import {ScenarioService} from '../../../common/service/scenario.service';
import {InputData, SelectData, Step} from '../../../common/shared/types';
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

	public eventValues: Map<string, string> = new Map<string, string>();

	constructor(public readonly scenarioService: ScenarioService, private router: Router,
				private dialogService: NbDialogService) {
	}

	ngOnInit(): void {
		if (this.scenarioService.currentStep === undefined) {
			this.router.navigateByUrl('');
		}
	}

	public checkValue(inputData: InputData, value: string) {
		inputData.isValid = new RegExp(inputData.validator).test(value);
	}

	public calculateDisabledState(step: Step): boolean {
		switch (step.type) {
			case 'select':
				return !this.eventValues.has(step.id);
			case 'input':
				return !(step.eventInfo as InputData).isValid;
			default:
				return false;
		}
	}

	public onValueChange(step: Step, selectedValue: any) {
		this.eventValues.set(step.id, selectedValue);

		switch (step.type) {
			case 'select':
				(step.eventInfo as SelectData).selectionData = selectedValue;
				break;
			case 'input':
				(step.eventInfo as InputData).inputValue = selectedValue;
		}
	}

	onSelectClick(step: Step): void {
		switch (step.eventName) {
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
