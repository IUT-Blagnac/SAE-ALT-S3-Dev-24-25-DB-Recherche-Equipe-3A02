from dataclasses import dataclass
from datetime import datetime, time, timezone
import json
from typing import Optional
import pytz
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS

from backend import settings
from webapi.models import SensorType

@dataclass
class ListCapteur:
    capteur = []
    start_time = datetime
    end_time = datetime


@dataclass(frozen=True)
class CapteurResult:
    time : datetime
    time_fr : str
    value : float
    field : str
    key1 : str 
    value1 : str
    key2 : str 
    value2 : str
    key3 : str
    value3 : str

    def get_value_by_key(self, key: str) -> Optional[str]:
        """Retourne la valeur associée à une clé spécifique."""
        if self.key1 == key:
            return self.value1
        elif self.key2 == key:
            return self.value2
        elif self.key3 == key:
            return self.value3
        return None


    def afficher(self):
        texte = f"time: {self.time_fr}\nvalue: {self.value}\nfield: {self.field}\nroom_id: {self.room_id}\nsensor_type: {self.sensor_type}\n----------------"
        print(texte)

    def compare_to_other(self, other) -> bool:
        """
        Compare cette instance avec une autre instance de CapteurResult,
        en ignorant les champs 'time' et 'time_fr', ainsi que value.

        :param other: Une autre instance de CapteurResult
        :return: True si les champs (sauf time et time_fr et value) sont identiques, False sinon
        """
        if not isinstance(other, CapteurResult):
            raise TypeError("La comparaison est uniquement possible avec une autre instance de CapteurResult.")
        
        return (
            self.field == other.field and
            self.value1 == other.value1 and
            self.value2 == other.value2 and
            self.value3 == other.value3
        )

    def compare_to_list(self, other_list) -> bool:
        """
        Compare cette instance avec une liste d'autre instance de CapteurResult,
        en ignorant les champs 'time' et 'time_fr'.

        :param other_list: Une liste d'autre instance de CapteurResult
        :return: True si les champs (sauf time et time_fr) sont identiques, False sinon
        """
        result = False
        for other in other_list:
            result = self.compare_to_other(other=other)
            if result: return result
        return result

    def get_same(self, other_list):
        """
        Compare cette instance avec une liste d'autre instance de CapteurResult,
        en ignorant les champs 'time' et 'time_fr'.

        :param other_list: Une liste d'autre instance de CapteurResult
        :return: True si les champs (sauf time et time_fr) sont identiques, False sinon
        """
        result = False
        for other in other_list:
            result = self.compare_to_other(other=other)
            if result: return other
        return self

class InfluxDB:
    def __init__(self):
        self.client = None

        self.config = {
            "url":settings.INFLUXDB_CONFIG["url"],
            "token":settings.INFLUXDB_CONFIG["token"],
            "org":settings.INFLUXDB_CONFIG["org"],
            "bucket":settings.INFLUXDB_CONFIG["bucket"]
        }
        self.connexion(
            self.config["url"],
            self.config["token"],
            self.config["org"],
            self.config["bucket"]
        )

    def __call__(self, flux_query):
        """
        flux_query : String, code Flux
        Exécute une requête Flux et retourne les résultats.
        Retourne None si une erreur survient.
        """
        try:
            self.reconnect()  # S'assure que la connexion est active
            result = self.query_api.query(org=self.config["org"], query=flux_query)
            data = [{"time": record.get_time(), "value": record.get_value(), "fields": record.values} for table in result for record in table.records]
            return data
        except Exception as error:
            print("Requête échouée : ", error)
            return None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()

    def connexion(self, url, token, org, bucket):
        """
        Connecte l'instance au serveur InfluxDB.
        """
        self.config = {
            "url": url,
            "token": token,
            "org": org,
            "bucket": bucket
        }
        try:
            self.client = InfluxDBClient(
                url=url,
                token=token,
                org=org
                
            )
            self.write_api = self.client.write_api(write_options=SYNCHRONOUS)
            self.query_api = self.client.query_api()
            print("Connexion réussie")
        except Exception as error:
            print("Erreur lors de la connexion :", error)

    def reconnect(self):
        """
        Réouvre la connexion si elle est fermée.
        """
        if self.client is None:
            try:
                self.connexion(
                    self.config["url"],
                    self.config["token"],
                    self.config["org"],
                    self.config["bucket"]
                )
                print("Connexion rétablie")
            except Exception as error:
                print("Erreur lors de la reconnexion :", error)

    def write_data(self, measurement, data):
        """
        Écrit des données dans le bucket InfluxDB.
        :param measurement: Nom de la mesure
        :param data: Données au format dictionnaire
        """
        try:
            point = {
                "measurement": measurement,
                "tags": data.get("tags", {}),
                "fields": data["fields"],
                "time": data.get("time")  # Optionnel
            }
            self.write_api.write(bucket=self.config["bucket"], org=self.config["org"], record=point)
            print("Données écrites avec succès")
        except Exception as error:
            print("Erreur lors de l'écriture des données :", error)

    def is_true(self, flux_query):
        """
        Retourne True si la requête Flux ne renvoie pas de résultats, False sinon.
        """
        data = self(flux_query)
        return not data  # True si la liste est vide

    def close(self):
        """
        Ferme la connexion au client InfluxDB.
        """
        if self.client is not None:
            self.client.close()
            print("Connexion fermée")

    def format_list(self, values):
        """
        Convertit une liste Python en une liste Flux avec des guillemets doubles.
        """
        return "[" + ", ".join([f'"{value}"' for value in values]) + "]"

    def is_instance_filter_link(self, pf_key, pf_value, pf_all_query):
        if isinstance(pf_value, str):
            pf_value = [pf_value]
        if pf_key != None:
            res_filter = f'|> filter(fn: (r) => contains(value: r["{pf_key}"], set: {self.format_list(pf_value)}))'
        else:
            res_filter = f'|> filter(fn: (r) => contains(value: r["_field"], set: {self.format_list(pf_value)}))'


        pf_all_query += f"\n{res_filter}"
        return pf_all_query

    def get(self, key1="room", key2="sensor", key3="id", value1=[], value2=[], value3=[],
        field=[], start_time=None, end_time=None, last=False, return_object=False) -> dict:
        """
        Récupère les données depuis InfluxDB avec des filtres personnalisés et permet de choisir les champs à retourner.
        """
        all_query = """from(bucket: "sensors2")
    |> range(start: 0)        
    |> filter(fn: (r) => r["_measurement"] == "sensor_data")"""



        if not (key1 and key2 and key3):
            query = 'from(bucket: "sensors2") |> range(start: 0) |> filter(fn: (r) => r._field == "topic_url")'
            result = self.query_api.query(query)
            key1, key2, key3 = result[0].split("/")
    
        print(key1)
        if value1:
            all_query = self.is_instance_filter_link(key1, value1, all_query)
        if value2:
            all_query = self.is_instance_filter_link(key2, value2, all_query)
        if value3:
            all_query = self.is_instance_filter_link(key3, value3, all_query)
        if field:
            all_query = self.is_instance_filter_link(None, field, all_query)
        if start_time and end_time:
            range_filter = f'|> range(start: {start_time}Z, stop: {end_time}Z)'
            all_query = all_query.replace('|> range(start: 0)', range_filter)
        if last:
            all_query += '\n|> last()'
        if return_object: 
            print(all_query)       
            result = self(all_query)
            if(not result):
                return {}
            self._last_result = self.transform_json_to_dataclass(result)
            return self._last_result

        print(all_query)
        return self(all_query)
        
    def transform_json_to_dataclass(self, data_entry):
        contenu = json.load(data_entry) if isinstance(data_entry, str) else data_entry
                    
        dataclass_tab = []
        
        for item in contenu:
            topic_keys = item['fields'].get('topic_url').split("/")
            time = item['time']
            paris_tz = pytz.timezone("Europe/Paris")
            time_in_paris = time.astimezone(paris_tz)
            
            # Récupérer le type de capteur
            sensor_type = item['fields'].get(topic_keys[1], 'unknown')
            
            try:
                sensor_config = SensorType.objects.get(name=sensor_type)
                # Plus besoin de json.loads() car fields est déjà une liste
                measurement_fields = sensor_config.fields
                
                # Récupérer les valeurs du capteur
                sensor_values = json.loads(item['fields'].get('_value', '{}'))
                
                # Créer une entrée pour chaque mesure
                for field in measurement_fields:
                    if field in sensor_values:
                        try:
                            data = CapteurResult(
                                time=item['time'],
                                time_fr=time_in_paris.strftime("%Y-%m-%d %H:%M:%S"),
                                value=sensor_values[field],
                                field=field,
                                key1=topic_keys[0],
                                key2=topic_keys[1],
                                key3=topic_keys[2],
                                value1=item['fields'].get(topic_keys[0], 'unknown'),
                                value2=sensor_type,
                                value3=item['fields'].get(topic_keys[2], 'unknown')
                            )
                            dataclass_tab.append(data)
                        except KeyError as e:
                            print(f"Erreur dans les données : champ manquant {e}")
                            continue
                        
            except SensorType.DoesNotExist:
                # Si le capteur n'est pas multi-mesures, comportement original
                try:
                    data = CapteurResult(
                        time=item['time'],
                        time_fr=time_in_paris.strftime("%Y-%m-%d %H:%M:%S"),
                        value=item['fields'].get('_value', 0),
                        field=item['fields'].get('_field', 'unknown'),
                        key1=topic_keys[0],
                        key2=topic_keys[1],
                        key3=topic_keys[2],
                        value1=item['fields'].get(topic_keys[0], 'unknown'),
                        value2=sensor_type,
                        value3=item['fields'].get(topic_keys[2], 'unknown')
                    )
                    dataclass_tab.append(data)
                except KeyError as e:
                    print(f"Erreur dans les données : champ manquant {e}")
                    continue
        
        return dataclass_tab 

    def get_all_last(self, resultat: list[CapteurResult]=None) -> list[CapteurResult]:
        """
        Conserve uniquement les éléments uniques dans la liste basée sur les champs
        autres que 'time' et 'time_fr', en gardant la version la plus récente (basée sur 'time').
        
        :param resultat: Une liste d'instances de CapteurResult.
        :return: Une liste d'instances uniques de CapteurResult avec le plus récent pour chaque cas.
        """
        all_differents = []

        if resultat is None:
            resultat = self._last_result

        for item in resultat:
            existing = item.get_same(all_differents)  # Trouve un élément similaire dans la liste
            if existing == item:  # Si aucun élément similaire n'existe
                all_differents.append(item)
            else:  # Si un élément similaire existe, compare les dates
                if item.time > existing.time:  # Si l'élément actuel est plus récent
                    all_differents.remove(existing)  # Retirer l'ancien élément
                    all_differents.append(item)  # Ajouter le plus récent

        return all_differents
    
    def get_type_and_salle(self):
        objects = self.get(return_object=True)
        salles = []
        type_data = []

        for object in objects:
            print(object)
            if object.get_value_by_key("room") not in salles and object.get_value_by_key("room") not in ["F999", "unknown"]:
                salles.append(object.get_value_by_key("room"))
            if object.field not in type_data and object.field not in ["json_values", "values"]:
                type_data.append(object.field)

        return {"room" : salles, "type" : type_data}
