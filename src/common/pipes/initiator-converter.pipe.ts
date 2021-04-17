import {Pipe, PipeTransform} from '@angular/core';
import {Initiator} from '../shared/types';

@Pipe({
	name: 'initiatorConverter'
})
export class InitiatorConverterPipe implements PipeTransform {

	transform(value: Initiator): Initiator {
		return value;
	}

}
