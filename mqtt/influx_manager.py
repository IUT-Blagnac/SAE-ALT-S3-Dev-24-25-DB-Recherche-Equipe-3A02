import json
from influxdb_client import Point
from datetime import datetime
from influx_config import influx_db
from typing import Dict
import requests
import os;


API_URL = os.getenv('APP_API', '')

class SensorManager:
    def __init__(self):
        self.influx = influx_db

    def write_sensor_data(self, topic, key2, value2, key3, value3, key4, value4, values):
        """
        Trie les données des capteurs et les écrit dans InfluxDB.

        :param topic: URL ou chemin associé au capteur.
        :param key2: Nom du premier tag pour catégoriser les données (par ex. "location").
        :param value2: Valeur associée au tag `key2`.
        :param key3: Nom du deuxième tag pour catégoriser les données (par ex. "sensor type").
        :param value3: Valeur associée au tag `key3`.
        :param key4: Nom du troisième tag pour catégoriser les données (par ex. "unit").
        :param value4: Valeur associée au tag `key4`.
        :param values: Données brutes à écrire, sous forme de dictionnaire.
        """
        point = Point("sensor_data") \
        .tag(key2, value2) \
        .tag(key3, value3) \
        .tag(key4, value4) \
        .field("topic_url", topic) 

        point.field("values", json.dumps(values))

        self.influx.write_api.write(bucket="sensors2", record=point)
    