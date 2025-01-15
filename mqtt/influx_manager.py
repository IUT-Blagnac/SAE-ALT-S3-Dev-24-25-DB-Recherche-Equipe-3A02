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
        self.SENSOR_TYPES = self.fetch_sensor_types()
        self.all_fields = self.collect_all_fields() 


    def collect_all_fields(self):
        """Collecte tous les champs définis dans SENSOR_TYPES."""
        all_fields = set()  
        for sensor_info in self.SENSOR_TYPES.values():
            all_fields.update(sensor_info.get("fields", []))
        return list(all_fields)  

    def fetch_sensor_types(self):
        """Récupere tout les types de sensors depuis django"""
        response = requests.get(API_URL + "/sensors_types")
        if response.status_code == 200:
            return response.json()
        raise Exception(f"Failed to fetch sensor types: {response.status_code}")

    def detect_sensor_type(self, values: dict) -> str:
        """Detecte le type de capteur"""
        for sensor_type, sensor_info in self.SENSOR_TYPES.items():
            fields = sensor_info["fields"]  # Liste des champs attendus pour ce capteur
            if all(field in values for field in fields):
                return sensor_type  # Retourner le type de capteur si les champs sont tous présents
        return 'generic_sensor' 

    def write_sensor_data(self, sensor_id, room_id,  values):
        """Trie les valeurs et les enregistre dans le infludb"""
        filtered_values = {key: value for key, value in values.items() if key in self.all_fields}
        sensor_type = self.detect_sensor_type(filtered_values)
        print(sensor_type)
        point = Point("sensor_data") \
        .tag("sensor_id", sensor_id) \
        .tag("room_id", room_id) \
        .tag("sensor_type", sensor_type)

        print(filtered_values)
    
        for field_name, value in filtered_values.items():
            point.field(field_name, value)
        self.influx.write_api.write(bucket="sensors", record=point)
    