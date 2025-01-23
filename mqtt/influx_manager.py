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
        """Trie les valeurs et les enregistre dans le infludb"""
        point = Point("sensor_data") \
        .tag(key2, value2) \
        .tag(key3, value3) \
        .tag(key4, value4) \
        .field("topic_url", topic) 

        point.field("values", json.dumps(values))

        self.influx.write_api.write(bucket="sensors2", record=point)
    