import os
from dotenv import load_dotenv
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS

# Chargement des variables d'environnement
load_dotenv()

class InfluxDBConfig:
    def __init__(self):
        self.url = os.getenv('INFLUXDB_URL', 'http://localhost:8086')
        self.token = os.getenv('INFLUXDB_TOKEN', 'your-token-here')
        self.org = os.getenv('INFLUXDB_ORG', 'your-org-here')
        self.bucket = os.getenv('INFLUXDB_BUCKET', 'your-bucket-here')
        
        self._client = None
        self._write_api = None
        self._query_api = None

    def connect(self):
        """Établit la connexion avec InfluxDB si elle n'existe pas déjà"""
        if self._client is None:
            self._client = InfluxDBClient(
                url=self.url,
                token=self.token,
                org=self.org
            )
            self._write_api = self.client.write_api(write_options=SYNCHRONOUS)
            self._query_api = self.client.query_api()
        return self._client

    @property
    def client(self):
        """Retourne le client InfluxDB, le crée si nécessaire"""
        if self._client is None:
            self.connect()
        return self._client

    @property
    def write_api(self):
        """Retourne l'API d'écriture"""
        if self._write_api is None:
            self.connect()
        return self._write_api

    @property
    def query_api(self):
        """Retourne l'API de requête"""
        if self._query_api is None:
            self.connect()
        return self._query_api

    def close(self):
        """Ferme la connexion à InfluxDB"""
        if self._client:
            self._client.close()
            self._client = None
            self._write_api = None
            self._query_api = None


influx_db = InfluxDBConfig()