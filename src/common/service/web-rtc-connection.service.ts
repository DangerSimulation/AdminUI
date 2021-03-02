import { Injectable } from '@angular/core';

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

  public setRemoteDescription(sdp: string): void {
    if (this.hasConnection){
      return;
    }
    this.peerConnection.setRemoteDescription(JSON.parse(sdp, (key, value) => {
      if (key === 'type') {
        return 'offer';
      }
      return value;
    })).then(a => console.log('set offer'));
    this.peerConnection.createAnswer().then(answer => this.peerConnection.setLocalDescription(answer)).then(a => console.log('Answer created'));
  }
}
