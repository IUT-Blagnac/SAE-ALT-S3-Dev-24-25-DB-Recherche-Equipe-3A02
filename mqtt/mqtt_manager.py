import os
import re
import json
import paho.mqtt.client as mqtt
from influx_manager import SensorManager
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
    """Handler exécuté à chaque fois qu'un message est envoyé"""
    try:
        topic = msg.topic
        payload = msg.payload.decode()
        print(f"Received MQTT message: {topic} -> {payload}")

        # Vérifie d'abord si le payload est un JSON valide
        try:
            values = json.loads(payload)
        except json.JSONDecodeError:
            print("Message ignoré : payload non JSON")
            return


        if not isinstance(values, dict):
            print("Message ignoré : pas un objet JSON")
            return

        # Analyse ensuite le topic
        match = re.search(r"([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)/([^/]+)", topic)
        if not match:
            print("Message ignoré : topic ne correspond pas au format attendu")
            return
        
        key2, value2, key3, value3, key4, value4 = match.groups()[2:8]
        
        # Enregistre uniquement si on arrive jusqu'ici (topic valide et payload JSON)
        influx_manager.write_sensor_data(key2, value2, key3, value3, key4, value4, values)
        print(f"Données insérées pour sensor_id={value2}, room_id={value3}")

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
