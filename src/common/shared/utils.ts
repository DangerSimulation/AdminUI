import {RTCSdpType} from './rtc-sdp-type.enum';

export function sdpTypeConverter(key: string, value): string {
	if (key === 'type') {
		return RTCSdpType[value];
	}
	return value;
}
