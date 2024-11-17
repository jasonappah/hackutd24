#include <Arduino.h>

constexpr int PIN_TRIG_0 = 27;
constexpr int PIN_ECHO_0 = 26;

constexpr int PIN_TRIG_1 = 28;
constexpr int PIN_ECHO_1 = 22;

constexpr int PIN_TRIG_2 = 21;
constexpr int PIN_ECHO_2 = 20;

constexpr int PIN_RESET_DISTANCE = 18;
constexpr int PIN_RESET_DISTANCE_POWER = 19;

constexpr int ERROR = 10;
int detectionThreshold0 = 80;
int detectionThreshold1 = 80;
int detectionThreshold2 = 80;

int lastDistance0 = 0;
int lastDistance1 = 0;
int lastDistance2 = 0;

constexpr int SAMPLE_WINDOW_SIZE = 10;

void onResetDistanceCalibration() {
  //Serial.print("RESET DISTANCE CALIBRATION ");
  //Serial.println(lastDistance);
  detectionThreshold0 = lastDistance0 - ERROR;
  detectionThreshold1 = lastDistance1 - ERROR;
  detectionThreshold2 = lastDistance2 - ERROR;
}

void setup()
{
  pinMode(PIN_TRIG_0, OUTPUT);
  pinMode(PIN_TRIG_1, OUTPUT);
  pinMode(PIN_TRIG_2, OUTPUT);
  pinMode(PIN_ECHO_0, INPUT);
  pinMode(PIN_ECHO_1, INPUT);
  pinMode(PIN_ECHO_2, INPUT);

  //pinMode(PIN_RESET_DISTANCE, INPUT_PULLUP);
  pinMode(PIN_RESET_DISTANCE, INPUT);
  pinMode(PIN_LED, OUTPUT);

  pinMode(PIN_RESET_DISTANCE_POWER, OUTPUT);
  digitalWrite(PIN_RESET_DISTANCE_POWER, HIGH);

  attachInterrupt(digitalPinToInterrupt(PIN_RESET_DISTANCE), onResetDistanceCalibration, RISING);

  Serial.begin(115200);
}

uint64_t test(uint64_t* distances, int trigger, int echo) {
  uint64_t distance = 0;

  for (int i = 0; i < SAMPLE_WINDOW_SIZE; i++)
  {
    digitalWrite(trigger, LOW);

    delayMicroseconds(2);

    // Send a 10us pulse
    digitalWrite(trigger, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigger, LOW);

    // Distance is [0, 6000]
    long duration = pulseIn(echo, HIGH, 6000);

    if (duration == 0)
    {
      // Failed to read
    }

    // Multiply by speed of sound in air, divide
    distances[i] = duration * 0.034 / 2;
    distance += distances[i];
  }

  return distance / SAMPLE_WINDOW_SIZE;
}

uint64_t distances0[SAMPLE_WINDOW_SIZE] = {};
uint64_t distances1[SAMPLE_WINDOW_SIZE] = {};
uint64_t distances2[SAMPLE_WINDOW_SIZE] = {};
void loop()
{
  uint64_t distance = 0;

  uint64_t distance0 = test(distances0, PIN_TRIG_0, PIN_ECHO_0);
  uint64_t distance1 = test(distances0, PIN_TRIG_0, PIN_ECHO_0);
  uint64_t distance2 = test(distances0, PIN_TRIG_0, PIN_ECHO_0);

  // varName:1234|g
  Serial.printf(">Echo1:%d\n", distance0);
  Serial.printf(">Echo2:%d\n", distance1);
  Serial.printf(">Echo3:%d\n", distance2);

  lastDistance0 = distance0;
  lastDistance1 = distance1;
  lastDistance2 = distance2;

  //Serial.println(distance < detectionThreshold ? 1 : 0);

  delay(50);
}