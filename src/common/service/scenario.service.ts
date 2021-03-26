import {Injectable} from '@angular/core';
import {Scenario, Step} from '../shared/types';

@Injectable({
    providedIn: 'root'
})
export class ScenarioService {

    public nextStepList: number[];
    public currentStep: Step;

    constructor() {
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
            console.log(`Triggering event ${step.initiator.event}`);
        }
    }

}
