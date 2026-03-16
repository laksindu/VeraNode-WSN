# VeraNode WSN (Multi-Zone IoT Monitoring & Control System)

VeraNode is a hybrid IoT solution featuring a low-latency ESP-NOW local sensor network and MQTT integration for cloud-based monitoring and automation. This system allows for real-time temperature and humidity tracking across multiple zones with automated relay control based on user-defined thresholds.

## Project Structure

This repository is a monorepo containing both the hardware and mobile software components:

- `/firmware`: ESP32 source code for Transmitter and Receiver nodes (C++/Arduino).
- `/mobile-app`: React Native / Expo application for monitoring and control.

## Firmware System Overview

The firmware consists of two primary node types designed for the ESP32 platform.

### 1. The Transmitter (Sensor Node)
- Collects environmental data and broadcasts it to the central hub.
- Sensor Integration: Uses DHT11 for temperature and humidity readings.
- Protocol: Communicates via ESP-NOW to minimize power and latency.
- Channel Hopping: Automatically cycles through Wi-Fi channels 1–13 to ensure data capture.

### 2. The Receiver (Central Gateway)
- The bridge between the local sensor network and the internet.
- Connectivity: Maintains a persistent connection to an MQTT broker (default: broker.emqx.io).
- Dynamic Configuration: Features a built-in Portal (AP mode) to configure Wi-Fi and User IDs without re-flashing.
- Local Automation: Controls 4 independent relays based on temperature setpoints stored in non-volatile memory.

### Hardware Requirements & Pin Mapping

| Component              | Specification                          |
|------------------------|----------------------------------------|
| Microcontrollers       | 2x (or more) ESP32 Development Boards |
| Sensor                 | DHT11 Temperature & Humidity Sensor   |
| Output                 | 4-Channel Relay Module                |
| Relay 1-4              | GPIO 25, 13, 26, 18                   |
| Reset Button           | GPIO 4                                |


## Installation & Setup

1. Clone the Repository:
   ```bash
   git clone https://github.com/laksindu/Veranode-WSN.git
   ```

2. Flash Firmware:
   - Upload `Receiver.ino` to the hub.
   - Upload `Transmitter.ino` to your sensor nodes. (if nodes are esp8266 use ESP8266 WIFI library )

3. Configure Transmitter:
   - Find the MAC Address of your Receiver ESP32.
   - Update `receiverAddress[]` in `Transmitter.ino` with your Receiver's MAC.

4. Network Provisioning:
   - If no Wi-Fi is found, the Receiver starts an AP named "VeraNode".
   - You can Use the dashboard to securely transmit your local WiFi credentials to the device
   - When using a custom dashboard, connect to the VeraNode Access Point and navigate to 192.168.4.1/wifi. Submit a POST request to save your WiFi SSID, Password, and UserID to the device


## Mobile Application (VeraNode Mobile)

The mobile dashboard is built with React Native (Expo).for real time monitoring and temperature based automation within the VeraNode ecosystem.

### Key Features
- EAS Integrated: Optimized for Expo Application Services (EAS) for building standalone APKs.
- Network Permissions:ACCESS_FINE_LOCATION and NEARBY_WIFI_DEVICES

#### App Setup & Build ( or you can downlaod the prebuild app from release)

To build the app for your own account, you must initialize your own EAS project:

1. Install dependencies:
   ```bash
   cd mobile-app
   cd VeraNode
   npm install
   ```

2. Initialize EAS:
   ```bash
   eas init
   ```
   This will generate your own projectId in app.json.

3. Build APK:
   - Development: `eas build --profile development --platform android`
   - Production: `eas build --profile production --platform android`

4. Mobile App (apk):
   - Initial Connection: Launch the VeraNode app and connect your mobile device to the VeraNode Access Point (AP).
   - Provisioning: Use the dashboard to securely transmit your local WiFi credentials to the device.
   - Deployment: Once connected to your network, the VeraNode WSN will automatically begin syncing data to your mobile dashboard.


## MQTT API Reference

The system generates topics dynamically based on the configured `userID`.

### Data Uplink (Publishes)

* `iot/{userID}/ZoneX_temp`: Current temperature for Zone X.
* `iot/{userID}/ZoneX_humid`: Current humidity for Zone X.
* `iot/{userID}/from_device`: Online/Offline status.

### Command Downlink (Subscribes)

The device listens on `iot/{userID}/to_device` for JSON payloads to update relay logic:

```json
{
  "sensor": "temp",
  "zone": "1",
  "temp": 28,
  "relay": "15"
}

```

## Main repository for both firmware and mobile app

1. Mobile app :
  ```bash
   git clone https://github.com/laksindu/VeraNode.git

  ```

2. Firmware :
  ```bash
   git clone https://github.com/laksindu/VeraNode-Firmware.git

  ```
