import {ScenarioControlComponent} from './scenario-control.component';
import {NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule} from '@nebular/theme';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PipesModule} from '../../../common/pipes/pipes.module';
import {FormsModule} from '@angular/forms';


@NgModule({
	declarations: [ScenarioControlComponent],
	imports: [
		CommonModule,
		NbCardModule,
		NbIconModule,
		NbButtonModule,
		PipesModule,
		NbSelectModule,
		NbInputModule,
		FormsModule
	]
})
export class ScenarioControlModule {
}
