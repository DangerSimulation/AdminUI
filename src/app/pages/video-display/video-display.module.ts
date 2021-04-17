import {VideoDisplayComponent} from './video-display.component';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';


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

