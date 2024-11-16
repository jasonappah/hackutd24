import requests
import cv2
from serial import Serial

BACKEND_HOST = "http://TBD:TBD"
CAMERA_ID = 0
SERIAL_PORT = "/dev/ttyACM0"

capture = cv2.VideoCapture(CAMERA_ID)

def take_picture() -> bytes | None:
  """
  Takes a picture using the camera and returns the image as a JPG.
  """
  ret, frame = capture.read()
  if not ret:
      print("Failed to capture frame")
      return None
  
  _, jpg = cv2.imencode('.jpg', frame)
  bytes = jpg.tobytes()

  return bytes

take_picture()

def serial_listen():
  # sample serial message rcvd by pi 4 for sending occupancy to hub: "0 0 0\n"
  # 3 values for each seat (left, center, right)
  # 0 means seat is unoccupied, 1 means seat is occupied
  with Serial(SERIAL_PORT, 9600) as ser:
    while True:
      data = ser.readline()
      print(data)

serial_listen()
  
