import {Pipe, PipeTransform} from '@angular/core';
import {InputData} from '../shared/types';

@Pipe({
	name: 'inputConverter'
})
export class InputConverterPipe implements PipeTransform {

	transform(value: InputData): InputData {
		return value;
	}

}
