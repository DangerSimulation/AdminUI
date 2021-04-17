import {Pipe, PipeTransform} from '@angular/core';
import {SelectData} from '../shared/types';

@Pipe({
	name: 'selectConverter'
})
export class SelectConverterPipe implements PipeTransform {

	transform(value: SelectData): SelectData {
		return value;
	}

}
