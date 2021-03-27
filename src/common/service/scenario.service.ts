import {Injectable} from '@angular/core';
import {Scenario, SimulationMessage, Step} from '../shared/types';
import {SimulationEventsService} from './simulation-events.service';

@Injectable({
    providedIn: 'root'
})
export class ScenarioService {

    public nextStepList: number[];
    public currentStep: Step;

    constructor(private simulationEventsService: SimulationEventsService) {
    }

    private _scenario: Scenario;

    get scenario(): Scenario {
        return this._scenario;
    }

    public setScenarioInformation(scenario: Scenario): void {
        this._scenario = scenario;
        this.currentStep = scenario.steps[0];
        this.nextStepList = scenario.steps[0].next;
    };

    public updateSelectedStep(step: Step): void {
        this.currentStep = step;
        this.nextStepList = step.next;
        if (step.initiator) {
            const message: SimulationMessage<string> = {
                eventType: 'InitiatorEvent',
                data: step.initiator.event
            };
            this.simulationEventsService.sendSimulationEvent(message, step.initiator.event);
        }
    }

}
