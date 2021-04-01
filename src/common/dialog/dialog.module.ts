import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScenarioResetComponent} from './scenario-reset/scenario-reset.component';
import {NbButtonModule, NbCardModule, NbDialogService} from '@nebular/theme';


@NgModule({
    declarations: [ScenarioResetComponent],
    imports: [
        CommonModule,
        NbCardModule,
        NbButtonModule
    ],
    providers: [
        NbDialogService
    ]
})
export class DialogModule {
}
