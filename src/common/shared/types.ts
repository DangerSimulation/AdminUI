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
