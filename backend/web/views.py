from django.shortcuts import render
from services.influxdb_client_django import CapteurResult, InfluxDB

db = InfluxDB()

def home(request):
    return render(request, "map.html")

def map(request):
    return render(request, "map.html")

def historique(request):
    data = db.get_type_and_salle()
    salles = data["room"]
    typeDeDonne = data["type"]

    context = {
        'salles': [{"value" : f'{salle}', 'label' : f'{salle}'} for salle in salles],
        'types_données': [{'value' : f'{t}', 'label' : f'{t}'} for t in typeDeDonne],
        }
    return render(request, 'historique.html', context)

