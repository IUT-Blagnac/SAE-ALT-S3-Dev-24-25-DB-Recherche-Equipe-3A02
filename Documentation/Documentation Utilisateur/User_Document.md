
# Documentation Utilisateur - Recherches DashBoard

## Sommaire
- [Documentation Utilisateur - Recherches DashBoard](#documentation-utilisateur---recherches-dashboard)
  - [Sommaire](#sommaire)
  - [I. Introduction](#i-introduction)
  - [II. Présentation de l'Application](#ii-présentation-de-lapplication)
  - [III. Installation de l'Application](#iii-installation-de-lapplication)
  - [IV. Navigation dans l'Application](#iv-navigation-dans-lapplication)


_Créé par : Naïla Bon et Ophélie Winterhoff_

_A destination de : Cassandre Vey, Esther Pendaries et Rémi Boulle_

![Logo IUT](../images/Logo_IUT.png)

---

## I. Introduction
Ce document a été rédigé dans le cadre de la création d'une application permettant de suivre l'état des capteurs installés dans le bâtiment de recherches de l'IUT de Blagnac, du point de vue de l'utilisateur.

## II. Présentation de l'Application
L'application offre la possibilité de surveiller en temps réel, ou à un moment précis, l'état des capteurs du bâtiment de recherches de l'IUT de Blagnac. Ces capteurs mesurent plusieurs paramètres : **Température**, **Humidité**, **État des ouvertures et fermetures des portes** dans les différentes salles du bâtiment.


## III. Installation de l'Application
**Prérequis :**
- **Docker** et **Docker Compose** doivent être préalablement installés sur la machine
- **InfluxDB** sera automatiquement déployé via Docker

**Instructions d'installation**
1. Clonez le repository :
   
   ```bash
   git clone https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02.git
2. Allez dans le répertoire du projet : 
   
   ```bash
   cd SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02
3. Lancez les conteneurs Docker : 

    ```bash
    docker-compose up
4. L'application sera accessible aux adresses suivantes : 
    
    - **Frontend :** http://localhost:8000
    - **API :** http://localhost:8000/api

## IV. Navigation dans l'Application
**Fonctionnalités**

1. Page avec la carte : 
   - Navigation sur la carte interactive
   - Zoom sur des zones spécifiques
   - Affichage des informations sur les salles via des pop-up 
   - Accès à la page historique grâce au bouton situé en bas de la page
  
2. Page Historique
    - Sélection des salles
    - Choix des types de capteurs
    - Sélection des plages de dates
    - Affichage des données sous forme de graphiques 

**Description de ces fonctionnalités**

--_Rajouter des images des fonctionnalités_--
 
---

**Support et Assistance :** Si vous rencontrez un problème, veuillez contacter le support de l'application. 
