import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {ScenarioControlComponent} from './pages/scenario-control/scenario-control.component';
import {ScenarioSelectComponent} from './pages/scenario-select/scenario-select.component';

const routes: Routes = [
    {path: '', component: ScenarioSelectComponent},
    {path: 'control', component: ScenarioControlComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
