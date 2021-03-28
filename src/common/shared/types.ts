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
    name: string,
    description: string,
    id: number
}

export interface ScenarioInformation {
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
    id: number,
    description: string,
    initiator: Initiator,
    next: number[]
}

export interface Initiator {
    description: string,
    event: string
}

export interface SimulationMessage<T> {
    eventType: 'InitiatorEvent' | 'SystemUpdate' | 'SceneSelection',
    data: T
}

export interface SystemUpdateMessage<T> {
    action: 'SceneCancel' | 'Ping',
    additionalData: T
}
