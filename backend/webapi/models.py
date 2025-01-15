from django.db import models

# Create your models here.


class SensorType(models.Model):
    """
    Modèle représentant un type de capteur.
    
    Un type de capteur inclut son nom (e.g. capteur de température),
    une liste de champs qu'il mesure (e.g. température, humidité),
    et une description du capteur.
    """
    name = models.CharField(max_length=100, unique=True)
    fields = models.JSONField()  # Liste des champs comme JSON
    description = models.TextField()

    def __str__(self):
        return self.name