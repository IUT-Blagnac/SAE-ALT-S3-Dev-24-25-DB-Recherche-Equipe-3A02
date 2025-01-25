from django.urls import path
from .views import router, router2;
from ninja import NinjaAPI


# Création d'une instance de NinjaAPI
api = NinjaAPI()

# Ajout de routeurs pour organiser les endpoints par catégories
api.add_router("/sensors", router, tags=["sensors"])  # Associe le routeur `router` à l'URL `/sensors`
api.add_router("/sensors_types", router2, tags=["sensors_types"])  # Associe `router2` à `/sensors_types`

# Définition des patterns d'URL pour le projet
urlpatterns = [
    path("", api.urls),  # Associe toutes les URLs de l'instance NinjaAPI à la racine du projet
]