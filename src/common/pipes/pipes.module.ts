import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InitiatorConverterPipe} from './initiator-converter.pipe';
import {InputConverterPipe} from './input-converter.pipe';
import {SelectConverterPipe} from './select-converter.pipe';


@NgModule({
	declarations: [
		InitiatorConverterPipe,
		InputConverterPipe,
		SelectConverterPipe
	],
	imports: [
		CommonModule
	],
	exports: [
		InitiatorConverterPipe,
		InputConverterPipe,
		SelectConverterPipe
	]
})
export class PipesModule {
}

