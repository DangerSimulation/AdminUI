import {NbDialogRef} from '@nebular/theme';
import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-scenario-reset',
	templateUrl: './scenario-reset.component.html',
	styleUrls: ['./scenario-reset.component.css']
})
export class ScenarioResetComponent implements OnInit {

	constructor(protected dialogReference: NbDialogRef<ScenarioResetComponent>) {
	}

	ngOnInit(): void {
	}

	public onConfirmClick(): void {
		this.dialogReference.close(true);
	}

	public onCancelClick(): void {
		this.dialogReference.close(false);
	}
}
