from django.urls import path
from .views import router, router2, get_salles_and_types;
from ninja import NinjaAPI

api = NinjaAPI()

api.add_router("/sensors", router, tags=["sensors"])
api.add_router("/sensors_types", router2, tags=["sensors_types"])

urlpatterns = [
    path("", api.urls),  
    path("parametres/", get_salles_and_types, name="salle_and_types"),
]