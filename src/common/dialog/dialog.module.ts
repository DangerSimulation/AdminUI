import {ScenarioResetComponent} from './scenario-reset/scenario-reset.component';
import {NbButtonModule, NbCardModule, NbDialogService} from '@nebular/theme';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';


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
