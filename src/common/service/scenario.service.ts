import {Injectable} from '@angular/core';
import {
	InputData,
	Scenario,
	ScenarioEventMessage,
	SelectData,
	SimulationMessage,
	Step,
	SystemUpdateMessage
} from '../shared/types';
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
	public alwaysAvailableStepList: string[];

	constructor(private simulationEventsService: SimulationEventsService, private router: Router) {
	}

	private _scenario: Scenario;

	get scenario(): Scenario {
		return this._scenario;
	}

	public setScenarioInformation(scenario: Scenario): void {
		this._scenario = scenario;
		this.alwaysAvailableStepList = [];
		this.uniquePreviousSelectedSteps = [];
		this.isDone = false;

		scenario.steps.forEach(step => {
			if (step.alwaysAvailable) {
				this.alwaysAvailableStepList.push(step.id);
			}
		});
		this.currentStep = scenario.steps[0];

		this.nextStepList = scenario.steps[0].next;
	};

	public updateSelectedStep(step: Step): void {
		if (step.unique) {
			this.uniquePreviousSelectedSteps.push(step.id);
		}

		if (!step.alwaysAvailable) {
			this.currentStep = step;
			this.nextStepList = step.next;
		}

		if (step.type !== 'info') {
			this.sendEvent(step);
		}
	}

	private handleInitiatorEvents(step: Step): SimulationMessage<unknown> {
		let message: SimulationMessage<unknown>;

		switch (step.eventName) {
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
					eventType: 'ScenarioEvent',
					data: step.eventName
				} as SimulationMessage<string>;
				break;

		}

		return message;
	}

	private sendEvent(step: Step) {
		let message: SimulationMessage<any>;
		let event = step.eventName;

		switch (step.type) {
			case 'initiator':
				message = this.handleInitiatorEvents(step);
				break;
			case 'select':
				message = {
					eventType: 'ScenarioEvent',
					data: {
						eventName: step.eventName,
						additionalData: (step.eventInfo as SelectData).selectionData
					}
				} as SimulationMessage<ScenarioEventMessage<string>>;
				break;
			case 'input':
				message = {
					eventType: 'ScenarioEvent',
					data: {
						eventName: step.eventName,
						additionalData: (step.eventInfo as InputData).inputValue
					}
				} as SimulationMessage<ScenarioEventMessage<string>>;
		}

		this.simulationEventsService.sendSimulationEvent(message, event);
	}

}
