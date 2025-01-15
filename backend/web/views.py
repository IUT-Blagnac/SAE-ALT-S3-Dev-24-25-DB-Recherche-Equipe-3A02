from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, "map.html")

def map(request):
    return render(request, "map.html")

def historique(request):
    context = {
        'salles': [
            {'value': 'C101', 'label': 'C101'},
            {'value': 'C102', 'label': 'C102'},
            {'value': 'C103', 'label': 'C103'},
            {'value': 'C104', 'label': 'C104'},
            {'value': 'C105', 'label': 'C105'},
            {'value': 'C106', 'label': 'C106'},
            {'value': 'C107', 'label': 'C107'},
            {'value': 'C108', 'label': 'C108'},
        ],
        'types_données': [
            {'value': 'température', 'label': 'température 1'},
            {'value': 'humidité', 'label': 'humidité'},
            {'value': 'contact', 'label': 'contact'},
        ],
    }
    return render(request, 'historique.html', context)

