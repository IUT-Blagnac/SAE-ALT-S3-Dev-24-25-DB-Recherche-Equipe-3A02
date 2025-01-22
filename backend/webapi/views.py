from .models import SensorType
from typing import List, Optional
from django.http import JsonResponse
from ninja import Router, Schema, Query, Path 
from services.influxdb_client_django import CapteurResult, InfluxDB
from dateutil.parser import isoparse

class SensorTypeOut(Schema):
    fields: list
    description: str

db = InfluxDB()

router = Router()
router2 = Router()

@router.get("", response={200: dict[str, dict]})
def get_all_last_sensors(request):
    db.get(return_object=True)
    results = db.get_all_last()

    room_data = {}

    for data in results:
        room_id = data.room_id

        sensor = {
            "name": data.sensor_id,
            "type": data.sensor_type,
            "field": data.field,
            "timestamp": data.time,  
            "value": data.value
        }

        if room_id not in room_data:
            room_data[room_id] = {"sensors": []}

        room_data[room_id]["sensors"].append(sensor)

    return room_data

@router.get("/{path:path}", response={200: dict})
def get_sensor_data(request, path: str):
    """
    Route dynamique pour gérer des URL de type 
    Les paramètres sont extraits dynamiquement du chemin.
    """
    # Découper le chemin en segments
    path_parts = path.split("/")
    params = {path_parts[i]: path_parts[i + 1] for i in range(0, len(path_parts), 2) if i + 1 < len(path_parts)}

    # Récupérer les filtres
    room_id = params.get("room")
    sensor_type = params.get("sensors")
    sensor_id = params.get("id")

    # Simuler une requête à la base de données (remplacez par votre logique réelle)
    result = db.get(room_id=room_id, sensor_id=sensor_id, sensor_type=sensor_type)

    if not result:
        return {}

    room_data = {}

    for data in result:
        # Récupérer les informations depuis les données retournées
        fields = data.get("fields", {})
        room_id = fields.get("room_id", "unknown_room")

        sensor = {
            "name": fields.get("sensor_id", "unknown_sensor"),
            "type": fields.get("sensor_type", "unknown_type"),
            "field": fields.get("_field", "unknown_field"),
            "timestamp": data.get("time"),
            "value": fields.get("_value"),
        }

        # Ajouter les capteurs à la salle correspondante
        if room_id not in room_data:
            room_data[room_id] = {"sensors": []}

        room_data[room_id]["sensors"].append(sensor)

    return room_data



@router.get("/rooms", response={200: dict[str, dict]})
def get_data_by_rooms(
    request,
    room_ids: List[str] = Query(...),  # Liste des room_ids obligatoires
    sensor_id: List[str] = Query(default=None),
    sensor_type: List[str] = Query(default=None),
    field: List[str] = Query(None),
    start_time: str = None,
    end_time: str = None
):
    start_time_dt = ""
    end_time_dt = ""

    if start_time:
        start_time_dt = isoparse(start_time).isoformat()
    if end_time:
        end_time_dt = isoparse(end_time).isoformat()
    
    print(f"Paramètres : room_ids : {room_ids}\nsensor_id : {sensor_id}\nsensor_type : {sensor_type}\nstart_time_dt : {start_time_dt}\nend_time_dt : {end_time_dt}\nfield : {field}")

    rooms_data = {}

    for room_id in room_ids:
        result = db.get(
            room_id=room_id,
            sensor_id=sensor_id,
            sensor_type=sensor_type,
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
                "name": data.sensor_id,
                "type": data.sensor_type,
                "field": data.field,
                "timestamp": data.time,
                "value": data.value
            }
            room_data["sensors"].append(sensor)
        
        rooms_data[room_id] = room_data

    return rooms_data


    

@router.get("/{room_id}", response={200: dict[str, dict]})
def get_data_by_room(request, room_id: str, sensor_id: list[str] = Query(default=None),sensor_type: list[str] = Query(default=None), field: list[str] = Query(None), start_time: str = None, end_time: str = None):

    start_time_dt = ""
    end_time_dt = ""

    if start_time:
        start_time_dt = isoparse(start_time).isoformat()  # Convertir en datetime puis en isoformat
    if end_time:
        end_time_dt = isoparse(end_time).isoformat() 
    
    print(f"tout les parametres : room_id : {room_id}\nsensor_id : {sensor_id}\nsensor_type : {sensor_type}\nstart_time_dt : {start_time_dt}\nend_time_dt : {end_time_dt}\nfield : {field}")

    result = db.get(room_id=room_id, sensor_id=sensor_id, sensor_type=sensor_type, start_time=start_time_dt, end_time=end_time_dt, field=field, return_object=True)

    if not result:
        return {}

    room_data = {
        room_id: {
            "sensors": []
        }
    }

    for data in result:
        sensor = {
            "name": data.sensor_id,  
            "type": data.sensor_type,  
            "field": data.field,
            "timestamp": data.time,  
            "value": data.value  
        }
        room_data[room_id]["sensors"].append(sensor)
    
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