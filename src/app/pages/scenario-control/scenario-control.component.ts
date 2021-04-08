import {ScenarioService} from '../../../common/service/scenario.service';
import {Step} from '../../../common/shared/types';
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
	selector: 'app-scenario-control',
	templateUrl: './scenario-control.component.html',
	styleUrls: ['./scenario-control.component.css']
})
export class ScenarioControlComponent implements OnInit {

	constructor(public readonly scenarioService: ScenarioService, private router: Router) {
	}

	ngOnInit(): void {
		if (this.scenarioService.currentStep === undefined) {
			this.router.navigateByUrl('');
		}
	}

	onSelectClick(step: Step): void {
		this.scenarioService.updateSelectedStep(step);
	}

}
