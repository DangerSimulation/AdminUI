export interface PeerMessage {
    description: RTCSessionDescription | undefined,
    candidate: RTCIceCandidate | undefined
}

