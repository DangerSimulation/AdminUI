import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ScenarioEventMessage, Side, SignalingMessage, SimulationMessage, SystemUpdateMessage} from '../shared/types';

@Injectable({
	providedIn: 'root'
})
export class WebRTCConnectionService {

	public signalingMessage: Subject<SignalingMessage>;
	public trackAddedSubject: Subject<RTCTrackEvent>;
	public scenarioEventMessageSubject: Subject<ScenarioEventMessage<unknown>>;
	public systemUpdateMessageSubject: Subject<SystemUpdateMessage<unknown>>;
	public scenarioSelectionMessageSubject: Subject<string>;
	private localConnection: RTCPeerConnection;
	private dataChannel: RTCDataChannel | undefined;

	constructor() {
		this.signalingMessage = new Subject<SignalingMessage>();
		this.trackAddedSubject = new Subject<RTCTrackEvent>();
		this.scenarioSelectionMessageSubject = new Subject<string>();
		this.scenarioEventMessageSubject = new Subject<ScenarioEventMessage<unknown>>();
		this.systemUpdateMessageSubject = new Subject<SystemUpdateMessage<unknown>>();
	}

	public resetWebRTCConnection(): void {
		this.localConnection.close();
		this.dataChannel.close();
		this.localConnection = null;
		this.dataChannel = null;
	}

	public async createPeerConnection(): Promise<void> {
		this.localConnection = new RTCPeerConnection({iceServers: [{urls: 'stun:stun.l.google.com:19302'}]});

		this.dataChannel = this.localConnection.createDataChannel('data');
		this.dataChannel.onopen = ev => console.log('Data channel opened');
		this.dataChannel.onclose = ev => console.log('Data channel closed');
		this.dataChannel.onmessage = this.handleDataChannelMessage.bind(this);

		this.localConnection.onicecandidate = (iceEvent: RTCPeerConnectionIceEvent) => {
			console.log('New ice candidate');
			if (iceEvent.candidate) {
				this.signalingMessage.next({
					candidate: iceEvent.candidate.candidate,
					sdp: undefined,
					sdpMLineIndex: iceEvent.candidate.sdpMLineIndex,
					sdpMid: iceEvent.candidate.sdpMid,
					type: 'candidate'
				});
			}
		};

		this.localConnection.ontrack = evt => {
			console.log('onTrack');
			this.trackAddedSubject.next(evt);
		};

		this.localConnection.onconnectionstatechange = evt => {
			console.log(this.localConnection.connectionState);
		};

		await this.createDescription('offer');
	}

	public async createDescription(type: RTCSdpType): Promise<void> {
		console.log(`Create ${type}`);
		let description: RTCSessionDescriptionInit;

		switch (type) {

			case 'offer':
				description = await this.localConnection.createOffer({offerToReceiveVideo: true});
				break;
			case 'answer':
				description = await this.localConnection.createAnswer();
				break;
		}
		await this.localConnection.setLocalDescription(description);

		this.signalingMessage.next({
			candidate: '', sdp: description.sdp, sdpMLineIndex: 0, sdpMid: '', type: description.type
		});
	}

	public async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
		return this.localConnection.addIceCandidate(candidate);
	}

	public async setDescription(side: Side, message: SignalingMessage): Promise<void> {
		console.log(`Set ${side} ${message.type}`);

		switch (side) {

			case Side.Local:
				await this.localConnection.setLocalDescription({
						type: message.type,
						sdp: message.sdp
					} as RTCSessionDescriptionInit
				);
				break;
			case Side.Remote:
				await this.localConnection.setRemoteDescription({
					type: message.type,
					sdp: message.sdp
				} as RTCSessionDescriptionInit);
				break;
		}

		if (message.type === 'offer') {
			await this.createDescription('answer');
		}
	}

	public sendMessage(message: SimulationMessage<unknown>) {
		if (this.dataChannel !== undefined && this.dataChannel !== null && this.dataChannel.readyState === 'open') {
			this.dataChannel.send(JSON.stringify(message));
		} else {
			console.warn('Data channel is not connected. Check connection status');
		}
	}

	private handleDataChannelMessage(event: MessageEvent): void {
		console.log(`Received message from simulation: ${event.data}`);
		const message: SimulationMessage<any> = JSON.parse(event.data);
		console.log(this);
		switch (message.eventType) {
			case 'ScenarioEvent':
				this.scenarioEventMessageSubject.next(message.data);
				break;
			case 'SystemUpdate':
				this.systemUpdateMessageSubject.next(message.data);
				break;
			case 'ScenarioSelection':
				this.scenarioSelectionMessageSubject.next(message.data);
				break;
			default:
				console.warn(`Unknown event ${message.eventType} received from simulation`);
				break;
		}
	}
}
