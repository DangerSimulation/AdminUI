import {Component, OnInit} from '@angular/core';
import {ScenarioListService} from '../../../common/service/scenario-list.service';
import {Scenario} from '../../../common/shared/types';
import {Router} from '@angular/router';
import {ScenarioService} from '../../../common/service/scenario.service';

@Component({
    selector: 'app-scenario-select',
    templateUrl: './scenario-select.component.html',
    styleUrls: ['./scenario-select.component.css']
})
export class ScenarioSelectComponent implements OnInit {

    constructor(public readonly ScenarioListService: ScenarioListService, private readonly router: Router,
                private scenarioService: ScenarioService) {
    }

    ngOnInit(): void {
    }

    public onScenarioSelected(scenario: Scenario): void {
        this.scenarioService.setScenarioInformation(scenario);

        this.router.navigateByUrl('control').then(value => {
            console.log(`Scenario ${scenario.name} selected`);
        });
    }

}
