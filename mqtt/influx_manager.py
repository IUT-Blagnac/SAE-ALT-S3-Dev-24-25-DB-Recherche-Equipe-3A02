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

  

    def write_sensor_data(self, sensor_id_key, sensor_id, room_id_key, room_id, sensor_type_key, sensor_type,  values):
        """Trie les valeurs et les enregistre dans le infludb"""
        point = Point("sensor_data") \
        .tag(sensor_id_key, sensor_id) \
        .tag(room_id_key, room_id) \
        .tag(sensor_id_key, sensor_type)

        point.field("values", values)

        self.influx.write_api.write(bucket="sensors", record=point)
    