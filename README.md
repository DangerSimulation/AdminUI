# AdminUi

This is the admin ui used to supervise and control
the [unity vr application: Simulation](https://www.github.com/DangerSimulation/Simulation). This app gets the camera
feed of Simulation and has a side panel to control events inside Simulation.

1. [Installation](#installation)
2. [Requirements](#requirements)
3. [Tech stack](#tech-stack)
4. [Connection flow](#connection-flow)
5. [How to extend](#how-to-extend)
6. [Internationalization](#internationalization)

## Installation

For the development version simply type `npm start` into your favorite shell.

If you'd want to create a new release, simply use the npm script `electron:build`.

All other releases are available on the releases tab on [Github](https://github.com/DangerSimulation/AdminUI/releases).
Each commit on `main` creates a new release.

## Requirements

- Connection between simulation and admin ui has to be seamless.
- Reconnect immediately, should the connection be lost.
- A consistent state between admin ui and simulation has to be kept at all times.
- A connection has to be established without any user interaction.
	- This requires the admin ui and the simulation to be in the same network,

## Tech stack

This app is an angular site wrapped into electron. This enables cross platform support and gives the angular app os
functionality like starting a websocket server.

Complete stack list:

- Electron ~ Enables desktop functionality
- Angular ~ UI Framework
- Nebular ~ Component library, supplements angular
- ws ~ Simple websocket framework
- dgram ~ Node udp package
- WebRTC ~ Peer to Peer audio and video streaming

## Connection flow

![The connection flow displayed in one picture](https://github.com/DangerSimulation/Documentation/blob/main/Files/ConnectionFlow.png?raw=true)

AdminUI first starts to send UDP broadcast messages and creates a websocket server. Simulation listens to broadcast
messages and connects to the websocket of the admin ui. This is possible with the sender ip address from the broadcast
message. The webrtc handshake gets initiated as soon as the websocket connection is established. The webrtc handshake
can be viewed in [this](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling)
tutorial. The "Signalling Server" is the websocket.

We restart the connection flow once a connection is lost.

## How to extend

All UI elements to control the simulation are defined with a [json document](src/assets/simulation-scenarios.json). This
defines all scenarios and each step in each scenario.

### General json structure

```typescript
interface ScenarioList {
	version: number,
	scenarios: Scenario[]
}

interface Scenario {
	id: number,
	name: string,
	description: string,
	steps: Step[]
}

interface Step {
	id: string,
	description: string,
	unique: boolean,
	initiator: Initiator | null,
	next: number[]
}

interface Initiator {
	description: string,
	event: string
}
```

The top level object is *ScenarioList*, it holds all scenarios. Each scenario has a name, description, id and an array
of steps. Each step has an id, a description, an indicator for uniqueness, an optional initiator and an array of
following steps. The initiator is either an event forwarded to the simulation or null. The unique property indicates
whether an event should only be used once.

### Example JSON

Let's say you want to add a scenario named "CarCrash". You'd first add a new scenario:

```json
{
	"version": 0,
	"scenarios": [
		{},
		{
			"id": 1,
			"name": "CarCrash",
			"description": "Example scenario of a car crash",
			"steps": [
				{}
			]
		}
	]
}
```

And this scenario has 4 steps.

```json
{
	"version": 0,
	"scenarios": [
		{},
		{
			"id": 1,
			"name": "CarCrash",
			"description": "Example scenario of a car crash",
			"steps": [
				{
					"id": "Arrival",
					"description": "You arrived at the crash site",
					"initiator": null,
					"next": [
						"AskResponders",
						"Investigate"
					]
				},
				{
					"id": "AskResponders",
					"description": "Go and ask the first responders about the situation",
					"initiator": {
						"description": "Initiate a conversation with first responders",
						"event": "InformAboutSituation"
					},
					"next": [
					]
				},
				{
					"id": "Investigate",
					"description": "Take a closer look at the crash site",
					"initiator": null,
					"next": [
					]
				}
			]
		}
	]
}
```

We have added 3 steps to our scenario. The first step with the id "Arrival" is the initial step. In it's *next* property
we have two possible following steps. Meaning after arriving we have either the option to talk to the first responders
or investigate the site. One step has also an *initiator*. In this case it would initiate the conversation with first
responders. If you'd select that step, an event with the name *InformationAboutSituation* would be sent to the
simulation.

The other thing you'd need to do to add a scenario is to add all events to the known event list in the
[*simulation-events.service.ts*](src/common/service/simulation-events.service.ts). That includes all initiator events,
and the name of our scenario with a postfix of "Selected". So we need to add "InformAboutSituation" and "
CarCrashSelected". For our example that means adding:

```typescript
export class SimulationEventsService {

	private knownEvents: string[] = [
		'...',
		'CarCrashSelected',
		'InformAboutSituation'
	];

}
```

This is the part done for the AdminUI. New events have to be implemented in the simulation as well. Refer
to [this](https://github.com/DangerSimulation/Simulation).

### Internationalization

We use `@angular/localization` for internationalization. To create a translation file run the npm
script `npm run localization`. This creates a file for [german](./src/locales/messages.de.xlf). Edit the file to provide
translations, follow [this](https://angular.io/guide/i18n#translate-each-translation-file) tutorial.

