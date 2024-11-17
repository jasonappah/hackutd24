import requests
import cv2
from serial import Serial
from secret import BACKEND_HOST, OLLAMA_HOST
import base64
CAMERA_ID = 0
SERIAL_PORT = "/dev/ttyACM0"

capture = cv2.VideoCapture(CAMERA_ID)
#TUrn on auto focus
# capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
# capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

def take_picture(save_image:bool=False) -> bytes | None:
  """
  Takes a picture using the camera and returns the image as a JPG.
  """
  for i in range(10):
    capture.read()
  
  ret, frame = capture.read()
  if not ret:
      print("Failed to capture frame")
      return None
  
  _, jpg = cv2.imencode('.jpg', frame)
  
  if save_image:
    cv2.imwrite("image.jpg", frame)
  
  #Save the image as base64
  bytes = jpg.tobytes()
  base64_bytes = base64.b64encode(bytes)

  return base64_bytes

def serial_listen():
  # sample serial message rcvd by pi 4 for sending occupancy to hub: "0 0 0\n"
  # 3 values for each seat (left, center, right)
  # 0 means seat is unoccupied, 1 means seat is occupied
  with Serial(SERIAL_PORT, 9600) as ser:
    while True:
      data = ser.readline()
      occupied = data.split(" ")
      if max(occupied) == 1:
        #Take the picture
        pic_bytes = take_picture()
        requests.post(f"{BACKEND_HOST}/upload", files={"image": pic_bytes})

      print(data)

def server_testing():
  pic_base64bytes = take_picture(save_image=True)
  print(requests.post(BACKEND_HOST,
                      json={
                        "image":pic_base64bytes
                      })
        )

def local_testing():
  pic_base64bytes = take_picture(save_image=True)
  
  prompt = """
  You are looking for items that customer might forget (wallets, keyschain, keys, backpacks, jackets, drinks, foods, airpods, etc... ), or there might not be any items left behind. 
  Describe all the items and their color that you see the customers may have left behind.
  Do not describe the environment or an object that likely is not their(couches, seats, chairs)
  Return just the newline delimiter separated list of items that you see, but if you see nothing left behind, return only "nothing".
  Sample return if there are items detected:
    - Green Jackets
    - White airpods
  Sample return if there are no items detected:
    - Nothing
  """
  
  print(requests.post(OLLAMA_HOST, 
    json={
      "model":"llama3.2-vision",
      "prompt":prompt,
      "temperature":0.5,
      "top_p":0.8,
      "top_k": 60,
      "stream": False,
      "images": [pic_base64bytes]
    }
    
    ).json()["response"])

server_testing()