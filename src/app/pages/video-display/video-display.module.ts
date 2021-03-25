import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoDisplayComponent} from './video-display.component';


@NgModule({
    declarations: [VideoDisplayComponent],
    exports: [
        VideoDisplayComponent
    ],
    imports: [
        CommonModule
    ]
})
export class VideoDisplayModule {
}
