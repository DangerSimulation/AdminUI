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
	unique: boolean,
	description: string,
	initiator: Initiator | null,
	next: string[]
}

export interface Initiator {
	description: string,
	event: string
}

export interface SimulationMessage<T> {
	eventType: 'InitiatorEvent' | 'SystemUpdate' | 'ScenarioSelection',
	data: T
}

export interface SystemUpdateMessage<T> {
	action: 'ScenarioCancel' | 'Ping',
	additionalData: T
}
