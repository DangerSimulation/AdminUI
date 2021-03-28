import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {ScenarioControlComponent} from './pages/scenario-control/scenario-control.component';
import {ScenarioSelectComponent} from './pages/scenario-select/scenario-select.component';
import {ResetScenarioGuard} from '../common/guards/reset-scenario.guard';
import {NbDialogService} from '@nebular/theme';

const routes: Routes = [
    {path: '', component: ScenarioSelectComponent},
    {path: 'control', component: ScenarioControlComponent, canDeactivate: [ResetScenarioGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [ResetScenarioGuard, NbDialogService]
})
export class AppRoutingModule {
}
