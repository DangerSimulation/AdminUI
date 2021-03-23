import {Injectable} from '@angular/core';
import {interval, Observable, Subject} from 'rxjs';
import {skipUntil} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WebRTCConnectionService {

    public setRemoteDescriptionSubject: Subject<boolean>;
    public trackAddedSubject: Subject<RTCTrackEvent>;
    public answerSubject: Subject<RTCSessionDescription>;
    public offerSubject: Subject<RTCSessionDescription>;
    public iceCandidateSubject: Subject<RTCIceCandidate>;
    private peerConnection: RTCPeerConnection;
    private dataChannel: RTCDataChannel | undefined;
    private hasConnection = false;
    private iceCandidateQueue: RTCIceCandidateInit[] = [];

    constructor() {
        this.answerSubject = new Subject<RTCSessionDescription>();
        this.offerSubject = new Subject<RTCSessionDescription>();
        this.iceCandidateSubject = new Subject<RTCIceCandidate>();
        this.setRemoteDescriptionSubject = new Subject<boolean>();
        this.trackAddedSubject = new Subject<RTCTrackEvent>();

        this.setUpPeerConnection();
    }

    public addIceCandidate(candidate: RTCIceCandidate): void {
        const init = {
            candidate: candidate['Candidate'],
            sdpMLineIndex: candidate['SdpMLineIndex'],
            sdpMid: candidate['SdpMid']
        } as RTCIceCandidateInit;

        this.iceCandidateQueue.unshift(init);
        this.setIceCandidates();
    }

    public reactToConnectionLoss(): void {
        this.peerConnection.close();
        this.dataChannel.close();

        this.setUpPeerConnection();
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
            }).then(a => {
                console.log('Answer created');

                const answerPoller = interval(2000).pipe(skipUntil(new Observable<any>(subscriber => {
                    if (this.peerConnection.localDescription) {
                        subscriber.next(null);
                        subscriber.complete();
                    }
                }))).subscribe(value => {
                    this.answerSubject.next(this.peerConnection.localDescription);
                    answerPoller.unsubscribe();
                });
            });
        }).catch(e => {
            console.log(`Error setting remote description ${e}`);
            this.setRemoteDescriptionSubject.next(false);
        });

    }

    public sendMessage(message: string) {
        this.dataChannel.send(message);
    }

    public createOffer(): void {

        this.peerConnection.createOffer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: false
        }).then((offer: RTCSessionDescriptionInit) => {
            this.peerConnection.setLocalDescription(offer).then(value => {
                this.offerSubject.next(this.peerConnection.localDescription);
            });
        }).then(event => console.log('Created offer'));
    }

    public setAnswer(answer: RTCSessionDescriptionInit): void {
        this.peerConnection.setRemoteDescription(answer).then(event => {
            console.log('answer set successfully');
            this.setIceCandidates();
        });
    }

    private setIceCandidates(): void {
        if (this.peerConnection.remoteDescription) {
            while (this.iceCandidateQueue.length > 0) {
                this.peerConnection.addIceCandidate(this.iceCandidateQueue.pop()).then(value => console.log('Set ice candidate')).catch(reason => console.log(`Add ice candidate failed with ${reason}`));
            }
        }
    }

    private setUpPeerConnection(): void {
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.addTransceiver('video', {direction: 'recvonly'});

        this.peerConnection.onconnectionstatechange = ev => {
            console.log(this.peerConnection.connectionState);
        };
        this.peerConnection.onnegotiationneeded = event => {
            console.log('Negotiate');
        };
        this.peerConnection.onicecandidate = candidateEvent => {
            if (candidateEvent.candidate) {
                this.iceCandidateSubject.next(candidateEvent.candidate);
                console.log(`New ice candidate`);
            }
        };
        this.dataChannel = this.peerConnection.createDataChannel('dataChannel');
        this.dataChannel.onmessage = message => console.log(message);
        this.dataChannel.onopen = e => console.log('new connection');

        this.peerConnection.ondatachannel = event => {
            this.dataChannel = event.channel;
            this.dataChannel.onmessage = message => console.log(message);
            this.dataChannel.onopen = e => console.log('new connection');
        };
        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
            console.log('New track was added');
            this.trackAddedSubject.next(event);
        };

    }
}
