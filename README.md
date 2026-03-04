# VeraNode WSN ( Multi-Zone IoT Monitoring & Control System )

A hybrid IoT solution with **ESP-NOW** for low-latency local sensor networking and **MQTT** for cloud-based monitoring and automation. This system allows for real-time temperature and humidity tracking across multiple zones with automated relay control based on user-defined thresholds.

## System Overview

The project consists of two main firmware components:

### 1. The Transmitter (Sensor Node)

Located in various "Zones," these nodes collect environmental data and broadcast it to the central hub.

* **Sensor Integration:** Uses DHT11 for high-accuracy temperature and humidity readings.
* **Protocol:** Communicates via ESP-NOW to minimize power consumption and latency.
* **Channel Hopping:** Automatically cycles through Wi-Fi channels 1–13 to ensure the receiver captures the data packet regardless of the hub's current Wi-Fi channel.



### 2. The Receiver (Central Gateway)

The "Brain" of the system that bridges the local sensor network to the internet.

* **Connectivity:** Maintains a persistent connection to an MQTT broker (default: `broker.emqx.io`).
* **Dynamic Configuration:** Features a built-in Web Portal (Access Point mode) to configure Wi-Fi credentials and User IDs without re-flashing code.
* **Local Automation:** Controls 4 independent relays based on temperature setpoints received via MQTT and stored in non-volatile memory.
* **Data Persistence:** Uses the `Preferences` library to save states, ensuring settings survive power outages.



---

## Hardware Requirements

| Component | Specification |
| --- | --- |
| **Microcontrollers** | 2x (or more) ESP32 Development Boards |
| **Sensor** | DHT11 Temperature & Humidity Sensor |
| **Output** | 4-Channel Relay Module |
| **Feedback** | Reset Button for clearing NVM credentials |

* If you are using the **"ESP8266"** as a transmitter, replace the standard WiFi library with the **"ESP8266WiFi"** library. Note that you must still use an **"ESP32"** as the gateway


### Pin Mapping (Receiver)

* **Relay 1:** GPIO 15
* **Relay 2:** GPIO 13
* **Relay 3:** GPIO 17
* **Relay 4:** GPIO 18
* **Reset Button:** GPIO 4 



---

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

In this example, Relay 1 (GPIO 15) will trigger HIGH if Zone 1 temperature exceeds 28°C.

---

## Setup & Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/laksindu/VeraNode-WSN.git
```

2. **Configure Transmitter:**
   * Find the MAC Address of your Receiver ESP32.
   * Update `receiverAddress[]` in `Transmitter.ino` with your hardware's MAC.

3. **Flash Firmware:**
   * Upload `Receiver.ino` to the hub.
   * Upload `Transmitter.ino` to your sensor nodes. (if nodes are esp8266 use ESP8266 WIFI library )

4. **Network Provisioning:**
   * If no Wi-Fi is found, the Receiver starts an AP named **"ESP32"**.
   * Connect to it and navigate to `192.168.4.1/wifi` (via POST) to save your SSID, Password, and UserID.





---

## Future Roadmap

* [ ] Add support for deep sleep on Transmitter nodes to extend battery life.
* [ ] Create a React Native mobile dashboard for visual control.
* [ ] Add Gas sensor to monitor Gas level.
