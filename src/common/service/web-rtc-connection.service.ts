import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebRTCConnectionService {

    public setRemoteDescriptionSubject: Subject<boolean>;
    public trackAddedSubject: Subject<RTCTrackEvent>;
    public answerSubject: Subject<RTCSessionDescription>;
    public offerSubject: Subject<RTCSessionDescription>;
    public iceCandidateSubject: Subject<RTCIceCandidate>;
    public peerConnection: RTCPeerConnection;
    private dataChannel: RTCDataChannel | undefined;

    private makingOffer = false;
    private ignoreOffer = false;
    private polite = false;

    constructor() {
        this.answerSubject = new Subject<RTCSessionDescription>();
        this.offerSubject = new Subject<RTCSessionDescription>();
        this.iceCandidateSubject = new Subject<RTCIceCandidate>();
        this.setRemoteDescriptionSubject = new Subject<boolean>();
        this.trackAddedSubject = new Subject<RTCTrackEvent>();

        const config = {
            iceServers: [
                {
                    urls: 'stun.l.google.com:19302'
                }
            ]
        };

        this.peerConnection = new RTCPeerConnection();

        //this.peerConnection.addTransceiver('video', {direction: 'recvonly'});

        this.peerConnection.oniceconnectionstatechange = ev => console.log(`Ice connection state is ${this.peerConnection.iceConnectionState}`);

        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
            console.log('New track was added');
            //this.peerConnection.addTransceiver(event.track);

            this.trackAddedSubject.next(event);
        };

        this.peerConnection.onnegotiationneeded = async () => {
            console.log('Negotiation needed');
            try {
                this.makingOffer = true;
                // @ts-ignore setLocalDescription works without arguments, but the type definitions are not up to date. Should be included with Typescript > 4.2.3
                await this.peerConnection.setLocalDescription().then(value => console.log('Created offer'));
                this.offerSubject.next(this.peerConnection.localDescription);
            } catch (error) {
                console.log(error);
            } finally {
                this.makingOffer = false;
            }
        };

        this.peerConnection.onicecandidate = (candidate: RTCPeerConnectionIceEvent) => {
            this.iceCandidateSubject.next(candidate.candidate);
        };
    }

    public async onSignalingMessage(description: RTCSessionDescription, candidate: RTCIceCandidate): Promise<void> {
        try {
            if (description.sdp) {
                const offerCollision = (description.type === 'offer') && (this.makingOffer || this.peerConnection.signalingState !== 'stable');
                console.log(`We have ${offerCollision ? 'a' : 'no'} collision`);

                this.ignoreOffer = !this.polite && offerCollision;
                console.log(`We ${offerCollision ? 'will' : 'won\'t'} ignore the offer`);
                if (this.ignoreOffer) {
                    return;
                }
                await this.peerConnection.setRemoteDescription(description);
                console.log('Set remote description');
                if (description.type === 'offer') {
                    // @ts-ignore
                    await this.peerConnection.setLocalDescription().then(value => console.log('Created answer'));
                    this.answerSubject.next(this.peerConnection.localDescription);
                }
            } else if (candidate) {
                try {
                    console.log('Set candidate');
                    await this.peerConnection.addIceCandidate(candidate);
                } catch (e) {
                    if (!this.ignoreOffer) {
                        throw e;
                    } else {
                        console.warn(`Ignore error ${e}`);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}
