import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SceneResetComponent} from './scene-reset/scene-reset.component';
import {NbButtonModule, NbCardModule, NbDialogService} from '@nebular/theme';


@NgModule({
    declarations: [SceneResetComponent],
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
