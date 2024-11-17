#include <Arduino.h>

constexpr int PIN_TRIG = 0;
constexpr int PIN_ECHO = 1;

constexpr int PIN_RESET_DISTANCE = 2;

constexpr int ERROR = 10;
int detectionThreshold = 80;

int lastDistance = 0;

void onResetDistanceCalibration() {
  Serial.print("RESET DISTANCE CALIBRATION ");
  Serial.println(lastDistance);
  detectionThreshold = lastDistance;
}

void setup()
{
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  //pinMode(PIN_RESET_DISTANCE, INPUT_PULLUP);
  pinMode(PIN_RESET_DISTANCE, INPUT);
  pinMode(PIN_LED, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(PIN_RESET_DISTANCE), onResetDistanceCalibration, RISING);

  Serial.begin(115200);
}

uint64_t distances[100] = {};
void loop()
{
  uint64_t distance = 0;

  for (int i = 0; i < 100; i++)
  {
    digitalWrite(PIN_TRIG, LOW);

    delayMicroseconds(2);

    // Send a 10us pulse
    digitalWrite(PIN_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(PIN_TRIG, LOW);

    // Distance is [0, 6000]
    long duration = pulseIn(PIN_ECHO, HIGH, 6000);

    if (duration == 0)
    {
      // Failed to read
    }

    // Multiply by speed of sound in air, divide
    distances[i] = duration * 0.034 / 2;
    distance += distances[i];
  }

  Serial.print("Distance: ");
  Serial.println(distance / 100);

  delay(500);
}