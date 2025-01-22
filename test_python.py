from dataclasses import dataclass
from datetime import datetime, time, timezone
import pytz
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS
import os 
import json

INFLUXDB_CONFIG = {
    "url": "https://influxdb.endide.com",  # URL de l'instanceù InfluxDB
    "token": "QFKdKWJHe9ir4doaKlPBFKpxl7JUGR14YMDa-wjcKQ18aw_0b2hZaRDypBoXKjHvKpU9eWzXuZf9eCnbupklyw==",  # Jeton d'accès (InfluxDB v2+)
    "org": "sae",  # Organisation (InfluxDB v2+)
    "bucket": "sensors",  # Bucket cible
}

@dataclass
class listCapteur:
    capteur : list
    start_time : datetime
    end_time : datetime
    tri_value : str
    tri_parametre : str

@dataclass(frozen=True)
class CapteurResult:
    time : datetime
    time_fr : str
    value : float
    field : str
    room_id : str 
    sensor_id : str 
    sensor_type : str

    def afficher(self):
        texte = f"time: {self.time_fr}\nvalue: {self.value}\nfield: {self.field}\nroom_id: {self.room_id}\nsensor_type: {self.sensor_type}\n----------------"
        print(texte)

    def compare_to_other(self, other) -> bool:
        """
        Compare cette instance avec une autre instance de CapteurResult,
        en ignorant les champs 'time' et 'time_fr'.

        :param other: Une autre instance de CapteurResult
        :return: True si les champs (sauf time et time_fr) sont identiques, False sinon
        """
        if not isinstance(other, CapteurResult):
            raise TypeError("La comparaison est uniquement possible avec une autre instance de CapteurResult.")
        
        return (
            self.value == other.value and
            self.field == other.field and
            self.room_id == other.room_id and
            self.sensor_id == other.sensor_id and
            self.sensor_type == other.sensor_type
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
            "url":INFLUXDB_CONFIG["url"],
            "token":INFLUXDB_CONFIG["token"],
            "org":INFLUXDB_CONFIG["org"],
            "bucket":INFLUXDB_CONFIG["bucket"]
        }
        self.connexion(
            self.config["url"],
            self.config["token"],
            self.config["org"],
            self.config["bucket"]
        )

        self._last_result = None

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

    def get(self, room_id=[], sensor_id=[], sensor_type=[], field=[], start_time=None, end_time=None, last=False, return_object=False) -> dict:
        """
        Récupère les données depuis InfluxDB avec des filtres personnalisés et permet de choisir les champs à retourner.
        """
        all_query = """from(bucket: "sensors")
    |> range(start: 0)        
    |> filter(fn: (r) => r["_measurement"] == "sensor_data")"""

        if room_id:
            if isinstance(room_id, str):
                room_id = [room_id]
            room_filter = f'|> filter(fn: (r) => contains(value: r["room_id"], set: {self.format_list(room_id)}))'
            all_query += f"\n{room_filter}"
        if sensor_id:
            if isinstance(sensor_id, str):
                sensor_id = [sensor_id]
            sensor_filter = f'|> filter(fn: (r) => contains(value: r["sensor_id"], set: {self.format_list(sensor_id)}))'
            all_query += f"\n{sensor_filter}"
        if sensor_type:
            if isinstance(sensor_type, str):
                sensor_type = [sensor_type]
            type_filter = f'|> filter(fn: (r) => contains(value: r["sensor_type"], set: {self.format_list(sensor_type)}))'
            all_query += f"\n{type_filter}"
        if field:
            if isinstance(field, str):
                field = [field]
            field_filter = f'|> filter(fn: (r) => contains(value: r["_field"], set: {self.format_list(field)}))'
            all_query += f"\n{field_filter}"
        if start_time and end_time:
            range_filter = f'|> range(start: {start_time}, stop: {end_time})'
            all_query = all_query.replace('|> range(start: 0)', range_filter)
        if last:
            all_query += f'\n|> last()'
        if return_object:        
            result = self(all_query)
            self._last_result = self.transform_json_to_dataclass(result)
            return self._last_result

        return self(all_query)
    
    def transform_json_to_dataclass(self, data_entry):
        if isinstance(data_entry, str):
            contenu = json.loads(data_entry) 
        else:
            contenu = data_entry

        dataclass_tab = []
        for item in contenu:

            time = item['time']
            paris_tz = pytz.timezone("Europe/Paris")
            time_in_paris = time.astimezone(paris_tz)

            try:
                data = CapteurResult(
                    time=item['time'],  # Assurez-vous que 'time' est déjà au format datetime
                    time_fr=time_in_paris.strftime("%Y-%m-%d %H:%M:%S"),
                    value=item['fields'].get('_value', 0),  # Valeur par défaut si absent
                    field=item['fields'].get('_field', 'unknown'),
                    room_id=item['fields'].get('room_id', 'unknown'),
                    sensor_id=item['fields'].get('sensor_id', 'unknown'),
                    sensor_type=item['fields'].get('sensor_type', 'unknown')
                )
            except KeyError as e:
                print(f"Erreur dans les données : champ manquant {e}")
                continue

            dataclass_tab.append(data)
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
    
    def get_capteur_by_list(self, parametre_tri : str, liste_capteur, start_time=None, end_time=None):
        dictionnaire_capteur = {}

        for capteur in liste_capteur:
            param_attribut = getattr(capteur, parametre_tri)
            if param_attribut not in dictionnaire_capteur:
                dictionnaire_capteur[param_attribut] = listCapteur(
                    capteur=[capteur],
                    start_time=start_time,
                    end_time=end_time,
                    tri_value=param_attribut,
                    tri_parametre=parametre_tri
                )
            else:
                dictionnaire_capteur[param_attribut].capteur += [capteur]
        
        return dictionnaire_capteur

    def get_type_and_salle(self):
        objects = self.get(return_object=True)
        salles = []
        type_data = []

        for object in objects:
            if object.room_id not in salles and object.room_id not in ["F999", "unknown"]:
                salles.append(object.room_id)
            if object.field not in type_data and object.field not in ["json_values", "values"]:
                type_data.append(object.field)

        return {"room" : salles, "type" : type_data}

client = InfluxDB()
result = client.get_type_and_salle()

print(len(result))
print(result)



