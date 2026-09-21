# Hardware Setup

This document details the physical components and wiring required to build a single Dorm Climate Sensor Node.

## Components List (Per Node)

| Item | Description | Purpose |
|------|-------------|---------|
| **ESP32** | NodeMCU or standard dev board | The brain and WiFi communicator |
| **DHT22** | Digital Temp/Humidity Sensor | Measures temperature and humidity |
| **MQ-135** | Gas Sensor | Measures air quality (CO2/VOCs) |
| **Resistor** | 10kΩ Pull-up (if bare DHT22) | Required for DHT22 data line (if not using a module) |
| **Breadboard** | Half-size or mini | Prototyping and connections |
| **Jumper Wires** | M-M and M-F | Connecting components |
| **Power Supply** | 5V USB adapter | Powering the ESP32 |

## Wiring Diagram

### DHT22 Connection
The DHT22 operates on 3.3V logic (though can be powered by 5V). We use the ESP32's 3.3V pin.

| DHT22 Pin | ESP32 Pin | Notes |
|-----------|-----------|-------|
| 1 (VCC) | 3V3 | Power |
| 2 (DATA) | GPIO 4 | Add a 10k pull-up resistor between VCC and DATA if using a bare sensor |
| 3 (NC) | Not Connected | - |
| 4 (GND) | GND | Ground |

### MQ-135 Connection
The MQ-135 requires 5V to heat its internal element properly. We power it from the ESP32's `VIN` or `5V` pin, and read its analog output.

| MQ-135 Pin | ESP32 Pin | Notes |
|------------|-----------|-------|
| VCC | VIN / 5V | Power (requires 5V for internal heater) |
| GND | GND | Ground |
| AOUT | GPIO 34 | Analog output for gas concentration |
| DOUT | Not Connected | Digital threshold output (unused) |

> [!WARNING]
> **Voltage Warning for MQ-135**
> The MQ-135 outputs a 5V analog signal, but the ESP32's ADC pins (like GPIO 34) are rated for 3.3V max. While many dev boards tolerate this, for long-term reliability, it is highly recommended to use a **voltage divider** (e.g., 20kΩ and 10kΩ resistors) between the MQ-135 AOUT and the ESP32 GPIO 34 to step down the voltage.

## Enclosure (Optional)
If deploying in a dorm room, it is recommended to house the breadboard or perfboard in a small 3D-printed enclosure or project box. Ensure there are ventilation holes for the sensors to accurately sample the ambient air.
