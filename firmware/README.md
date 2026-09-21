# Firmware — Dorm Climate Node

This directory contains the Arduino sketch for the **ESP32 sensor node**. Every physical node in the dorm room runs this same firmware — the node's label and role are configured from the web dashboard.

## Hardware Required (per node)

| Component | Description |
|-----------|-------------|
| ESP32 (any variant) | Microcontroller with built-in WiFi |
| DHT22 | Temperature & Humidity sensor |
| MQ-135 | Air quality / CO₂ sensor (analog) |
| Micro-USB cable | For flashing |

## Wiring

```
ESP32          DHT22
GPIO 4    ──── DATA
3.3V      ──── VCC
GND       ──── GND

ESP32          MQ-135
GPIO 34   ──── AOUT (analog output)
5V        ──── VCC
GND       ──── GND
```

## Setup & Flashing

### 1. Install Arduino IDE
Download from [arduino.cc](https://www.arduino.cc/en/software)

### 2. Add ESP32 Board Support
In Arduino IDE → **File → Preferences**, add this URL to *Additional Boards Manager URLs*:
```
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
```
Then go to **Tools → Board → Boards Manager** and install **esp32 by Espressif Systems**.

### 3. Install Libraries
Go to **Sketch → Include Library → Manage Libraries** and install:
- `DHT sensor library` by Adafruit
- `Adafruit Unified Sensor` by Adafruit
- `ArduinoJson` by Benoit Blanchon

### 4. Configure WiFi
Open `dorm_node/dorm_node.ino` and update:
```cpp
#define WIFI_SSID     "YOUR_SSID"
#define WIFI_PASSWORD "YOUR_PASSWORD"
```

### 5. Flash
- Connect ESP32 via USB
- Select **Tools → Board → ESP32 Dev Module** (or your specific variant)
- Select the correct **Port**
- Click **Upload**

### 6. Find the Node IP
Open **Serial Monitor** (115200 baud) — the assigned IP address will print on startup:
```
Connected! IP: 192.168.1.42
HTTP server started on port 80
```
Use this IP in the web dashboard to add the node.

## API Endpoint

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/data` | `{"temperature": 24.5, "humidity": 58.2, "air_quality": 312}` |

## Scaling

One firmware, any number of nodes:
- Flash the same sketch onto each ESP32
- Each node gets its own IP on the local network
- Add each IP from the dashboard's **Configuration Screen**
- Supports 4-sharing and 6-sharing room layouts
