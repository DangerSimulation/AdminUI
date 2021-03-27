import {Component, OnInit} from '@angular/core';
import {ScenarioListService} from '../../../common/service/scenario-list.service';
import {Scenario, SimulationEvents} from '../../../common/shared/types';
import {Router} from '@angular/router';
import {ScenarioService} from '../../../common/service/scenario.service';
import {SimulationEventsService} from '../../../common/service/simulation-events.service';

@Component({
    selector: 'app-scenario-select',
    templateUrl: './scenario-select.component.html',
    styleUrls: ['./scenario-select.component.css']
})
export class ScenarioSelectComponent implements OnInit {

    constructor(public readonly ScenarioListService: ScenarioListService, private readonly router: Router,
                private scenarioService: ScenarioService, private simulationEventsService: SimulationEventsService) {
    }

    ngOnInit(): void {
    }

    public onScenarioSelected(scenario: Scenario): void {
        this.scenarioService.setScenarioInformation(scenario);

        this.router.navigateByUrl('control').then(value => {
            console.log(`Scenario ${scenario.name} selected`);
            this.simulationEventsService.sendSimulationEvent(this.createSimulationEventName(scenario));
        });
    }

    private createSimulationEventName(scenario: Scenario): SimulationEvents {
        switch (scenario.name) {
            case 'Strand':
                return 'StrandSelected';
            case 'akjfnjakifb':
                return 'akjfnjakifbSelected';
            case 'awdbjh':
                return 'awdbjhSelected';
            default:
                console.error(`Not recognized scenario ${scenario.name}. Add it to the type`);
        }
    }

}
