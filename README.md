# Dorm Climate Monitor (IDP)

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Hardware](https://img.shields.io/badge/Hardware-ESP32-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)

The Dorm Climate Monitor is an Innovative Design Project (IDP) designed to monitor environmental conditions in shared dormitory rooms. It provides real-time tracking of temperature, humidity, and air quality across multiple zones (e.g., individual beds) using a distributed network of low-cost ESP32 sensor nodes.

## System Overview

The system consists of independent hardware sensor nodes that connect to the local WiFi network, and a central React web dashboard that aggregates and displays the data.

- **Modular Hardware**: A single, generic firmware runs on all ESP32 nodes. Nodes are deployed as needed.
- **Flexible Layouts**: The dashboard can be configured for 2-sharing, 4-sharing, or 6-sharing rooms.
- **Real-Time API**: Nodes serve data directly to the local network via HTTP — no cloud subscription or external servers required.
- **Subjective Feedback**: The dashboard includes a form for occupants to log their subjective comfort level, which can be correlated with the objective sensor data.

## Project Structure

This repository is organized into three main components:

| Directory | Description |
|-----------|-------------|
| [`/software`](./software/) | The React + Vite web dashboard application. |
| [`/firmware`](./firmware/) | Arduino C++ firmware for the ESP32 sensor nodes. |
| [`/docs`](./docs/) | Technical documentation, architecture, and API specs. |

## Documentation

To understand how the system works or to build your own, refer to the docs:

- [System Architecture](./docs/architecture.md)
- [Hardware & Wiring Guide](./docs/hardware.md)
- [API Documentation](./docs/api.md)

## Getting Started

### 1. Flash the Hardware
Deploy the firmware to your ESP32 nodes. See the [Firmware Guide](./firmware/README.md) for instructions on wiring the DHT22 and MQ-135 sensors and uploading the sketch.

### 2. Run the Dashboard
Ensure your computer is on the same WiFi network as the ESP32 nodes.

```bash
cd software
npm install
npm run dev
```

### 3. Configure the System
Open `http://localhost:5173` in your browser. On the Configuration Screen, enter the IP addresses assigned to your ESP32 nodes by your router, assign them labels, and launch the dashboard.

## Team
- **Suyash Srivastava**
- **Yahvi Tewari**
- **Rida Farooqui**
