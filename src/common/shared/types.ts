export interface PeerMessage<T> {
    messageType: string,
    data: T
}

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
    next: number[]
}
