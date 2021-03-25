import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScenarioSelectComponent} from './scenario-select.component';
import {NbAccordionModule, NbButtonModule, NbCardModule} from '@nebular/theme';


@NgModule({
    declarations: [ScenarioSelectComponent],
    imports: [
        CommonModule,
        NbCardModule,
        NbAccordionModule,
        NbButtonModule
    ]
})
export class ScenarioSelectModule {
}
