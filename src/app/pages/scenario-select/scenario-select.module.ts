import {ScenarioSelectComponent} from './scenario-select.component';
import {NbAccordionModule, NbButtonModule, NbCardModule} from '@nebular/theme';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';


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
