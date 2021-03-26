import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScenarioControlComponent} from './scenario-control.component';
import {NbButtonModule, NbCardModule, NbIconModule} from '@nebular/theme';


@NgModule({
    declarations: [ScenarioControlComponent],
    imports: [
        CommonModule,
        NbCardModule,
        NbIconModule,
        NbButtonModule
    ]
})
export class ScenarioControlModule {
}
