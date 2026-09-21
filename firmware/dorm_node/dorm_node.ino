#include <WiFi.h>

const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

void setup()
{
    Serial.begin(115200);
    delay(1000);

    Serial.println();
    Serial.println("================================");
    Serial.println("        ESP32 WiFi Test");
    Serial.println("================================");

    WiFi.mode(WIFI_STA);

    Serial.println();
    Serial.println("Scanning WiFi networks...");

    int n = WiFi.scanNetworks();

    if (n == 0)
    {
        Serial.println("No WiFi networks found!");
    }
    else
    {
        Serial.print("Found ");
        Serial.print(n);
        Serial.println(" networks:");

        for (int i = 0; i < n; i++)
        {
            Serial.print(i + 1);
            Serial.print(": ");
            Serial.print(WiFi.SSID(i));
            Serial.print(" | RSSI: ");
            Serial.print(WiFi.RSSI(i));
            Serial.print(" | Channel: ");
            Serial.println(WiFi.channel(i));
        }
    }

    Serial.println();
    Serial.print("Connecting to: ");
    Serial.println(WIFI_SSID);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int attempts = 0;

    while (WiFi.status() != WL_CONNECTED && attempts < 30)
    {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    Serial.println();

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println();
        Serial.println("================================");
        Serial.println("       WiFi CONNECTED!");
        Serial.println("================================");

        Serial.print("SSID: ");
        Serial.println(WiFi.SSID());

        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());

        Serial.print("Gateway: ");
        Serial.println(WiFi.gatewayIP());

        Serial.print("Signal Strength: ");
        Serial.print(WiFi.RSSI());
        Serial.println(" dBm");
    }
    else
    {
        Serial.println();
        Serial.println("================================");
        Serial.println("       WiFi CONNECTION FAILED");
        Serial.println("================================");

        Serial.print("WiFi status code: ");
        Serial.println(WiFi.status());
    }
}

void loop()
{
}
