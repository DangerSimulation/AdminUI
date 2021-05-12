export interface SignalingMessage {
	sdp: string,
	type: string,
	candidate: string,
	sdpMid: string
	sdpMLineIndex: number,
}

export enum Side {
	Local,
	Remote
}

export interface ScenarioList {
	version: number,
	scenarios: Scenario[]
}

export interface Scenario {
	id: number,
	name: string,
	description: string,
	steps: Step[]
}

export interface Step {
	id: string,
	description: string,
	unique: boolean,
	alwaysAvailable: boolean,
	type: 'initiator' | 'select' | 'input' | 'info'
	eventName: string,
	eventInfo: Initiator | SelectData | InputData | null,
	next: string[]
}

export interface InputData {
	inputValue: string,
	validator: string,
	validatorHint: string,
	isValid: boolean
}

export interface SelectData {
	selectionData: string,
	options: SelectOption[]
}

export interface SelectOption {
	key: string,
	description: string,
}

export interface Initiator {
	description: string,
}

export interface ScenarioEventMessage<T> {
	eventName: string,
	additionalData: T
}

export interface SimulationMessage<T> {
	eventType: 'ScenarioEvent' | 'SystemUpdate' | 'ScenarioSelection',
	data: T
}

export interface SystemUpdateMessage<T> {
	action: 'ScenarioCancel' | 'Ping' | 'UnknownEvent',
	additionalData: T
}
