# AdminUi

This is the admin ui used to supervise and control
the [unity vr application: Simulation](https://www.github.com/DangerSimulation/Simulation). This app gets the camera
feed of Simulation and has a side panel to control events inside Simulation.

1. [Installation](#installation)
2. [Requirements](#requirements)
3. [Tech stack](#tech-stack)
4. [Connection flow](#connection-flow)
5. [How to extend](#how-to-extend)
6. [Configuring scenarios](#configuring-scenarios)

## Installation

TODO: this

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

## How to extend

## Configuring scenarios
