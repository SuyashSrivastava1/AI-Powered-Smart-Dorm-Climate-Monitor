# Software — Dorm Climate Web Dashboard

A React + Vite web application that connects to ESP32 sensor nodes over a local WiFi network and displays real-time temperature, humidity, and air quality data.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS 4 | Styling |
| Recharts | Sensor data charts |
| Lucide React | Icons |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- ESP32 sensor nodes running on the same local network

### Install & Run

```bash
cd software
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Configuration

On first launch, the **Configuration Screen** lets you add sensor nodes by IP address. Each node is labelled (e.g., "Bed 1") and polled independently. You can add as many nodes as needed to support 4-sharing or 6-sharing room layouts.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint static analysis |

## Project Structure

```
src/
├── components/
│   ├── ConfigurationScreen.jsx   # Node IP setup & room configuration
│   ├── Dashboard.jsx             # Main dashboard layout
│   ├── LiveSensorCard.jsx        # Per-node sensor display with charts
│   └── SubjectiveFeedback.jsx    # User comfort feedback form
├── hooks/
│   └── useSensorData.js          # Custom hook: polls node HTTP API
├── App.jsx
├── main.jsx
└── index.css
```
