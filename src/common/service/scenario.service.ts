import {Injectable} from '@angular/core';
import {Scenario, SimulationMessage, Step, SystemUpdateMessage} from '../shared/types';
import {SimulationEventsService} from './simulation-events.service';
import {Router} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ScenarioService {

	public nextStepList: string[];
	public currentStep: Step;
	public uniquePreviousSelectedSteps: string[] = [];
	public isDone = false;

	constructor(private simulationEventsService: SimulationEventsService, private router: Router) {
	}

	private _scenario: Scenario;

	get scenario(): Scenario {
		return this._scenario;
	}

	public setScenarioInformation(scenario: Scenario): void {
		this.uniquePreviousSelectedSteps = [];
		this.isDone = false;
		this._scenario = scenario;
		this.currentStep = scenario.steps[0];
		this.nextStepList = scenario.steps[0].next;
	};

	public updateSelectedStep(step: Step): void {
		if (step.unique) {
			this.uniquePreviousSelectedSteps.push(step.id);
		}

		this.currentStep = step;
		this.nextStepList = step.next;
		if (step.initiator) {
			this.sendEvent(step);
		}
	}

	private sendEvent(step: Step) {
		let message: SimulationMessage<any>;

		switch (step.initiator.event) {
			case 'ScenarioComplete':
				message = {
					eventType: 'SystemUpdate',
					data: {
						action: 'ScenarioCancel',
						additionalData: 'Scenario completed'
					}
				} as SimulationMessage<SystemUpdateMessage<string>>;
				this.router.navigateByUrl('');
				break;
			default:
				message = {
					eventType: 'InitiatorEvent',
					data: step.initiator.event
				} as SimulationMessage<string>;
				break;
		}

		this.simulationEventsService.sendSimulationEvent(message, step.initiator.event);
	}

}
