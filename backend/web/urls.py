from django.urls import path
from . import views

# Liste des URL patterns pour l'application Django
urlpatterns = [
    path("", views.home, name="home"),  # URL de la page d'accueil, appelle la vue `home` de `views.py` et nomme cette route "home"
    path("map", views.map, name="map"),  # URL pour afficher la carte, appelle la vue `map` de `views.py` et nomme cette route "map"
    path("historique", views.historique, name="historique"),  # URL pour afficher l'historique, appelle la vue `historique` de `views.py` et nomme cette route "historique"
]