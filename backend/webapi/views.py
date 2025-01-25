from .models import SensorType
from typing import List, Optional
from django.http import JsonResponse
from ninja import Router, Schema, Query, Path 
from services.influxdb_client_django import CapteurResult, InfluxDB
from dateutil.parser import isoparse

# Définition du schéma de sortie pour les types de capteurs
class SensorTypeOut(Schema):
    fields: list  # Liste des champs spécifiques au capteur
    description: str  # Description du type de capteur

# Initialisation du client InfluxDB
db = InfluxDB()

# Création des routeurs pour définir les routes de l'API
router = Router()
router2 = Router()



@router.get("", response={200: dict[str, dict]})
def get_all_last_sensors(request):
    """
    Récupère les dernières données de tous les capteurs.
    Regroupe les capteurs par pièce (room_data).
    """
    db.get(return_object=True)
    results = db.get_all_last()

    room_data = {}

    for data in results:
        

        sensor = {
            data.key3: data.value3,
            data.key2: data.value2,
            "field": data.field,
            "timestamp": data.time,  
            "value": data.value
        }

        if data.value1 not in room_data:
            room_data[data.value1] = {"sensors": []}

        room_data[data.value1]["sensors"].append(sensor)

    return room_data

@router.get("mqtt/{path:path}", response={200: dict})
def get_sensor_data(request, path: str):
    """
    Route dynamique pour gérer des URL de type 
    Les paramètres sont extraits dynamiquement du chemin.
    """
    path_parts = path.split("/")
    if path_parts[1] == "*":
        path_parts[1] = ""

    if path_parts[3] == "*":
        path_parts[3] = ""

    if path_parts[5] == "*":
        path_parts[5] = ""

    result = db.get(key1=path_parts[0], value1=path_parts[1], key2=path_parts[2], value2=path_parts[3], key3=path_parts[4], value3=path_parts[5], return_object=True)
    if not result:
        return {}

    room_data = {}

    if not result:
        return {}

    room_data = {}

    for data in result:
        sensor = {
            data.key3: data.value3,
            data.key2: data.value2,
            "field": data.field,
            "timestamp": data.time,  
            "value": data.value
        }

        if data.value1 not in room_data:
            room_data[data.value1] = {"sensors": []}

        room_data[data.value1]["sensors"].append(sensor)

    return room_data 



@router.get("/rooms", response={200: dict[str, dict]})
def get_data_by_rooms(
    request,
    room_ids: List[str] = Query(...), 
    sensor_id: List[str] = Query(default=None),
    sensor_type: List[str] = Query(default=None),
    field: List[str] = Query(None),
    start_time: str = None,
    end_time: str = None
):
    """
    Récupère les données des capteurs pour les pièces spécifiées.
    Les filtres incluent capteur, type, champ, et plages de temps.
    """
    start_time_dt = ""
    end_time_dt = ""

    if start_time:
        start_time_dt = isoparse(start_time).isoformat()
    if end_time:
        end_time_dt = isoparse(end_time).isoformat()
    

    rooms_data = {}

    for room_id in room_ids:
        result = db.get(
            value1=room_id,
            value2=sensor_id,
            value3=sensor_type,
            start_time=start_time_dt,
            end_time=end_time_dt,
            field=field,
            return_object=True
        )

        if not result:
            continue

        room_data = {
            "sensors": []
        }

        for data in result:
            sensor = {
            data.key3: data.value3,
            data.key2: data.value2,
            "field": data.field,
            "timestamp": data.time,  
            "value": data.value
            }
            room_data["sensors"].append(sensor)
        
        rooms_data[room_id] = room_data

    return rooms_data


    

@router.get("/{room_id}", response={200: dict[str, dict]})
def get_data_by_rooom(request, room_id: str, sensor_id: list[str] = Query(default=None),sensor_type: list[str] = Query(default=None), field: list[str] = Query(None), start_time: str = None, end_time: str = None):
    """
    Récupère les données des capteurs pour une pièce donnée, avec des filtres optionnels.
    """

    start_time_dt = ""
    end_time_dt = ""
    

    if start_time:
        start_time_dt = isoparse(start_time).isoformat()  
    if end_time:
        end_time_dt = isoparse(end_time).isoformat() 
    
    print(f"tout les parametres : room_id : {room_id}\nsensor_id : {sensor_id}\nsensor_type : {sensor_type}\nstart_time_dt : {start_time_dt}\nend_time_dt : {end_time_dt}\nfield : {field}")

    result = db.get(value1=room_id, value2=sensor_type, value3=sensor_id, start_time=start_time_dt, end_time=end_time_dt, return_object=True)

    if not result:
        return {}

    room_data = {}

    for data in result:
        

        
        sensor = {
            data.key3: data.value3,
            data.key2: data.value2,
            "field": data.field,
            "timestamp": data.time,  
            "value": data.value
        }

        if data.value1 not in room_data:
            room_data[data.value1] = {"sensors": []}

        if field == None or data.field in field:
            room_data[data.value1]["sensors"].append(sensor)
        

    return room_data 


@router2.get("", response={200: dict[str, SensorTypeOut]})
def get_sensor_types(request):
    """
    Récupère tous les types de capteurs depuis la base de données.
    
    Renvoie un dictionnaire avec les types de capteurs, leurs champs 
    et leurs descriptions.
    """
    sensor_types = SensorType.objects.all()
    response_data = {}
    
    for sensor in sensor_types:
        response_data[sensor.name] = {
            "fields": sensor.fields,
            "description": sensor.description
        }
    
    return JsonResponse(response_data)