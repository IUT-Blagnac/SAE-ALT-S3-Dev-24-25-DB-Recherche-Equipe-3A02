import os
import re
import json
import paho.mqtt.client as mqtt
from influx_manager import SensorManager
from api_manager import manager
import asyncio

BROKER = os.getenv('MQTT_BROKER', '')
PORT = int(os.getenv('MQTT_PORT', 1883))
TOPIC = os.getenv('MQTT_TOPIC', '')
USERNAME = os.getenv('MQTT_USER', '')
PASSWORD = os.getenv('MQTT_PASSWORD', '')

influx_manager = SensorManager()

def on_connect(client, userdata, flags, reason_code, properties=None):
    """Handler executer une fois que le broker est connecté"""
    if reason_code == 0:
        print("Connected to MQTT broker")
        client.subscribe(TOPIC)
    else:
        print(f"Failed to connect, return code {reason_code}")

def on_message(client, userdata, msg):
    """Handler executer a chaque fois que un message est envoyer"""
    try:
        topic = msg.topic
        payload = msg.payload.decode()
        print(f"Received MQTT message: {topic} -> {payload}")
        
        match = re.search(r"([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)", topic)
        if not match:
            print("Message ignoré : topic ne correspond pas au format attendu.")
            return
        
        key1, value1, key2, value2, key3, value3 = match.groups()  

        try:
            values = json.loads(payload)
        except json.JSONDecodeError:
            print("Message ignoré : payload non valide.")
            return

        influx_manager.write_sensor_data(key1, value1, key2, value2, key3, value3, values)
        print(f"Données insérées pour sensor_id={value1}, room_id={value2}")

    except Exception as e:
        print(f"Erreur lors du traitement du message MQTT : {e}")

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.enable_logger()
mqtt_client.username_pw_set(USERNAME, PASSWORD)
mqtt_client.tls_set()
mqtt_client.connect(BROKER, PORT, 60)

def start_mqtt():
    """Execute le client mqtt"""
    mqtt_client.loop_forever()
