import {ScenarioControlComponent} from './scenario-control.component';
import {NbButtonModule, NbCardModule, NbIconModule} from '@nebular/theme';
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";


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
