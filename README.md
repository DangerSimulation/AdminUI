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
export interface ScenarioList {
	version: number,
	scenarios: Scenario[]
}

export interface Scenario {
	id: number,
	name: string,
	description: string,
	steps: Step[]
}

export interface Step {
	id: string,
	description: string,
	unique: boolean,
	alwaysAvailable: boolean,
	type: 'initiator' | 'select' | 'input' | 'info'
	eventName: string,
	eventInfo: Initiator | SelectData | InputData | null,
	next: string[]
}
```

The top level object is *ScenarioList*, it holds all scenarios. Each scenario has a name, description, id and an array
of steps. Each step has the following values:

- id
	- An unique id
- description
	- A description of the step
- unique
	- Whether this step should only be selectable once
- alwaysAvailable
	- Whether this step should be selectable at any time
- type
	- The type of this step. Has to be *initiator*, *select*, *input* or *info*
- eventName
	- The name of the event possibly emitted
- eventInfo
	- Additional data for the event. *type* indicates which type this has. See [event info](#event-info)
- next
	- A list of id's of following steps. This is ignored if *alwaysAvailable* is true

This list of steps defines how an event is displayed in the scenario control tab.

### Event Info

- Initiator:

```typescript
export interface Initiator {
	description: string,
}
```

An *initiator* only has a description.

- SelectData

```typescript
export interface SelectData {
	selectionData: string,
	options: SelectOption[]
}

export interface SelectOption {
	key: string,
	description: string,
}
```

*SelectData* creates a drop down menu with predefined options. *selectData* gets populated once the user selects
something. This property doesn't have to get a value.
*options* is a list of *SelectOptions*. Each SelectOption defines one item in the dropdown menu. *key* should be unique
and is used to determine what the user selected. *description* is what the user sees in the dropdown menu. The key of
the selected item is sent to Simulation as additional data.

- InputData

```typescript
export interface InputData {
	inputValue: string,
	validator: string,
	validatorHint: string,
	isValid: boolean
}
```

*InputData* creates an input field with validation. Properties are:

- inputValue
	- The entered value. Doesn't have to be filled
- validator
	- A Regex to ensure the input is correct
- validatorHint
	- A human-readable version of the regex
- isValid
	- Whether the entered value matched the validator. Populated once a value is entered

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
					"unique": true,
					"alwaysAvailable": false,
					"type": "info",
					"eventName": "",
					"eventInfo": null,
					"next": [
						"AskResponders",
						"InjuredReport"
					]
				},
				{
					"id": "AskResponders",
					"description": "Go and ask the first responders about the situation",
					"unique": true,
					"alwaysAvailable": false,
					"type": "initiator",
					"eventName": "AskResponders",
					"eventInfo": {
						"description": "Initiate a conversation with first responders",
						"event": "InformAboutSituation"
					},
					"next": [
					]
				},
				{
					"id": "InjuredReport",
					"description": "A first responder informs about the amount of injured persons",
					"unique": true,
					"alwaysAvailable": false,
					"type": "input",
					"eventName": "InjuredReport",
					"eventInfo": {
						"inputValue": "",
						"validator": "^[1-9]{1,2}$",
						"validatorHint": "A number between 1 and 99",
						"isValid": false
					},
					"next": [
					]
				},
				{
					"id": "WeatherChange",
					"description": "Weather is changing to the selected option",
					"unique": false,
					"alwaysAvailable": true,
					"type": "select",
					"eventName": "WeatherChange",
					"eventInfo": {
						"selectionData": "",
						"options": [
							{
								"key": "Rain",
								"description": "It's starting to rain"
							},
							{
								"key": "BlueSky",
								"description": "Clouds are clearing up"
							},
							{
								"key": "Cloudy",
								"description": "Big clouds appear"
							}
						]
					},
					"next": [
					]
				}
			]
		}
	]
}
```

We have added 4 steps to our scenario. The first step with the id "Arrival" is the initial step. In it's *next* property
we have two possible following steps. Meaning after arriving we have either the option to talk to the first responders
or we can have a first responder tell the trainee how many are injured. We also have a step to switch the weather with.
This step is always available, thus its *alwaysAvailable* flag is set to true. We display an initiator, input, info and
select step in this example. The info step is only an informational step and is not impacting the Simulation. All others
are sending event to Simulation once they are selected. input and select also have additional data with their event.

You get an error message with a toastr, if an event isn't implemented in the simulation.

This is the part done for the AdminUI. New events have to be implemented in the simulation as well. Refer
to [this](https://github.com/DangerSimulation/Simulation).

### Internationalization

We use `@angular/localization` for internationalization. To create a translation file run the npm
script `npm run localization`. This creates a file for [german](./src/locales/messages.de.xlf). Edit the file to provide
translations, follow [this](https://angular.io/guide/i18n#translate-each-translation-file) tutorial.

