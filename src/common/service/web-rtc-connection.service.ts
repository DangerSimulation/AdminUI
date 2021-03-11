import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WebRTCConnectionService {

    private peerConnection: RTCPeerConnection;
    private dataChannel: RTCDataChannel | undefined;
    private hasConnection = false;

    constructor() {
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.onicecandidate = e => console.log(`SDP: ${JSON.stringify((this.peerConnection.localDescription))}`);
        this.peerConnection.ondatachannel = event => {
            this.dataChannel = event.channel;
            this.dataChannel.onmessage = message => console.log(message);
            this.dataChannel.onopen = e => console.log('new connection');
        };
    }

    public setRemoteDescription(sdp: RTCSessionDescriptionInit): void {
        if (this.hasConnection) {
            return;
        }

        this.peerConnection.setRemoteDescription(sdp).then(a => {
            console.log('Offer set');
            this.peerConnection.createAnswer().then((answer: RTCSessionDescriptionInit) => {
                this.peerConnection.setLocalDescription(answer);
            }).then(a => console.log('Answer created'));
        });

    }
}
