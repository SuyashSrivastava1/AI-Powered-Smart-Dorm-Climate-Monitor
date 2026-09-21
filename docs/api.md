# API Documentation

The ESP32 nodes expose a very simple, single-endpoint HTTP API. 

The React Dashboard acts as the client, sending `HTTP GET` requests to each node's local IP address to fetch the latest sensor data.

## `GET /data`

Fetches the current temperature, humidity, and raw air quality values.

### Request
```http
GET /data HTTP/1.1
Host: <ESP32_IP_ADDRESS>
```

### Response (Success)
- **Status Code:** `200 OK`
- **Content-Type:** `application/json`
- **Headers:** `Access-Control-Allow-Origin: *` (CORS enabled for dashboard access)

**Body:**
```json
{
  "temperature": 24.5,
  "humidity": 58.2,
  "air_quality": 312
}
```

| Field | Type | Description |
|-------|------|-------------|
| `temperature` | Float | Temperature in Celsius (°C). Valid range depends on DHT22 (-40 to 80°C). |
| `humidity` | Float | Relative humidity percentage (%). Valid range 0-100%. |
| `air_quality` | Integer | Raw analog reading from the MQ-135 ADC (0-4095). Higher values indicate worse air quality. |

### Response (Error)
If the DHT sensor fails to return a valid reading (e.g., disconnected or faulty).

- **Status Code:** `500 Internal Server Error`
- **Content-Type:** `application/json`

**Body:**
```json
{
  "error": "DHT22 read failed"
}
```

## Polling Behavior
The dashboard uses the `useSensorData` hook to poll this endpoint.
- **Interval:** By default, the dashboard polls every 3000ms (3 seconds).
- **Timeouts:** If the node does not respond, the dashboard catches the network error and displays a simulation or error state (depending on the `isSimulating` fallback logic in the hook).
