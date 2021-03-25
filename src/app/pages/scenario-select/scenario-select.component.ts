import {Component, OnInit} from '@angular/core';
import {ScenarioListService} from '../../../common/service/scenario-list.service';
import {Scenario} from '../../../common/shared/types';
import {Router} from '@angular/router';

@Component({
    selector: 'app-scenario-select',
    templateUrl: './scenario-select.component.html',
    styleUrls: ['./scenario-select.component.css']
})
export class ScenarioSelectComponent implements OnInit {

    constructor(public readonly ScenarioListService: ScenarioListService, private readonly router: Router) {

    }

    ngOnInit(): void {
    }

    public onScenarioSelected(scenario: Scenario): void {
        this.router.navigateByUrl('control').then(value => console.log(`Scenario ${scenario.name} selected`));
    }

}
