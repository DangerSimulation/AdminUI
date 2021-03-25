import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScenarioSelectComponent} from './scenario-select.component';
import {NbCardModule} from '@nebular/theme';


@NgModule({
    declarations: [ScenarioSelectComponent],
    imports: [
        CommonModule,
        NbCardModule
    ]
})
export class ScenarioSelectModule {
}
