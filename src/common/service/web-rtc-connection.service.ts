import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebRTCConnectionService {

    public setRemoteDescriptionSubject: Subject<boolean>;
    public iceCandidateSubject: Subject<RTCSessionDescription>;
    private peerConnection: RTCPeerConnection;
    private dataChannel: RTCDataChannel | undefined;
    private hasConnection = false;

    constructor() {
        this.iceCandidateSubject = new Subject<RTCSessionDescription>();
        this.setRemoteDescriptionSubject = new Subject<boolean>();
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.onicecandidate = e => {
            if (this.peerConnection.localDescription) {
                this.iceCandidateSubject.next(this.peerConnection.localDescription);
            }
            console.log(`New ice candidate`);
        };
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
            this.setRemoteDescriptionSubject.next(true);
            console.log('Offer set');
            this.peerConnection.createAnswer().then((answer: RTCSessionDescriptionInit) => {
                this.peerConnection.setLocalDescription(answer);
            }).then(a => console.log('Answer created'));
        }).catch(e => {
            console.log(`Error setting remote description ${e}`);
            this.setRemoteDescriptionSubject.next(false);
        });

    }
}
