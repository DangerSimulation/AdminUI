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
    name: ScenarioName,
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
    event: SimulationEvents
}

export type ScenarioName = 'Strand' | 'awdbjh' | 'akjfnjakifb';
export type InitiatorEventName = 'DrowningMan';

//Have all events here. Scenario select events should be <scenario name>Selected
//Scenario events should be named <scenario name><event name>
export type SimulationEvents = `${ScenarioName}:${InitiatorEventName}` | `${ScenarioName}Selected` | null
