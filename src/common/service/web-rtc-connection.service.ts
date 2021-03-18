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
    public iceCandidateSubject: Subject<RTCIceCandidate>;
    private peerConnection: RTCPeerConnection;
    private dataChannel: RTCDataChannel | undefined;
    private hasConnection = false;
    private iceCandidateQueue: RTCIceCandidateInit[] = [];

    constructor() {
        this.answerSubject = new Subject<RTCSessionDescription>();
        this.iceCandidateSubject = new Subject<RTCIceCandidate>();
        this.setRemoteDescriptionSubject = new Subject<boolean>();
        this.trackAddedSubject = new Subject<RTCTrackEvent>();

        this.setUpPeerConnection();
    }

    public addIceCandidate(candidate: RTCIceCandidate): void {
        const init = {
            candidate: candidate['Candidate'],
            sdpMLineIndex: candidate['SdpMLineIndex'],
            sdpMid: candidate['SdpMid'],
            usernameFragment: candidate['UserNameFragment']
        } as RTCIceCandidateInit;

        if (this.peerConnection.remoteDescription) {
            while (this.iceCandidateQueue.length > 0) {
                this.peerConnection.addIceCandidate(this.iceCandidateQueue.pop()).then(value => console.log('Set ice candidate')).catch(reason => console.log(`Add ice candidate failed with ${reason}`));
            }
            this.peerConnection.addIceCandidate(init).then(value => console.log('Set ice candidate')).catch(reason => console.log(`Add ice candidate failed with ${reason}`));
        } else {
            this.iceCandidateQueue.push(init);
        }
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

    private setUpPeerConnection(): void {
        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.onconnectionstatechange = ev => {
            console.log(this.peerConnection.connectionState);
        };
        this.peerConnection.onnegotiationneeded = event => {
            console.log('Negotiate');
        };
        this.peerConnection.onicecandidate = candidateEvent => {
            if (this.peerConnection.localDescription) {
                this.answerSubject.next(this.peerConnection.localDescription);
            }
            this.iceCandidateSubject.next(candidateEvent.candidate);
            console.log(`New ice candidate`);
        };
        this.peerConnection.ondatachannel = event => {
            this.dataChannel = event.channel;
            this.dataChannel.onmessage = message => console.log(message);
            this.dataChannel.onopen = e => console.log('new connection');
        };
        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
            console.log('New track was added');
            this.trackAddedSubject.next(event);
        };

        window.setInterval(() => {
            /*this.peerConnection.getStats(null).then(stats => {
                let statsOutput = '';

                stats.forEach(report => {
                    statsOutput += `Report: ${report.type}\nID: ${report.id}\n` +
                        `Timestamp: ${report.timestamp}\n`;

                    // Now the statistics for this report; we intentially drop the ones we
                    // sorted to the top above

                    Object.keys(report).forEach(statName => {
                        if (statName !== 'id' && statName !== 'timestamp' && statName !== 'type') {
                            statsOutput += `${statName}:${report[statName]}\n`;
                        }
                    });
                });

                console.log(statsOutput);
            });*/
        }, 1000);


    }
}
