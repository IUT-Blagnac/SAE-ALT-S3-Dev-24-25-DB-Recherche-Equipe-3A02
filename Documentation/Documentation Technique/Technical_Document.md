# Documentation Technique - Recherches DashBoard

## Sommaire
- [Documentation Technique - Recherches DashBoard](#documentation-technique---recherches-dashboard)
  - [Sommaire](#sommaire)
  - [I. Introduction](#i-introduction)
  - [II. Présentation de l'application](#ii-présentation-de-lapplication)
    - [1. Cas d'utilisation](#1-cas-dutilisation)
    - [2. Diagramme de classes](#2-diagramme-de-classes)
  - [III. Architecture](#iii-architecture)
    - [1. Architecture de l'application](#1-architecture-de-lapplication)
  - [IV. Fonctionnalités de l'application](#iv-fonctionnalités-de-lapplication)

![Logo IUT](../images/Logo_IUT.png)

---

## I. Introduction

Cette application web a été développée pour le bâtiment de recherche afin de permettre aux chercheurs de surveiller l'état des capteurs des différentes salles. L'application s'inscrit dans un contexte de recherche où une surveillance précise des conditions environnementales est essentielle pour garantir la validité des expériences.



## II. Présentation de l'application

### 1. Cas d'utilisation

L'application permet aux chercheurs de :
- Naviguer sur la carte interactive du bâtiment
- Consulter les données en temps réel des capteurs par salle
- Visualiser l'état des portes (ouvert/fermé)
- Analyser l'historique des données via des graphiques
- Filtrer les données selon la salle, le type de données et une période donnée  
<br>

![Cas d'utilisation](../images/uc.svg)


## III. Architecture

### 3.1. Architecture de l'application

L’architecture de l’application repose sur plusieurs modules interconnectés :
- Un système MQTT pour la collecte des données
- Une base de données InfluxDB pour le stockage des données sous forme de séries temporelles
- Un backend Django pour le traitement (récupérer et filtrer les données) servant de liason entre la BD et le frontend
- Une interface frontend interactive pour la visualisation
<br>

![Shema de l'architecture](../images/archi.png)

### 3.2. Schéma de la base de donnée

### 3.3. Présentation de l'api django

L’API Django, développée avec Django Ninja, expose plusieurs endpoints permettant d’accéder aux données stockées dans InfluxDB.

Principaux endpoints :
- GET /sensors/data/ : Récupère les données des capteurs avec filtres possibles (salle, type de capteur, période).
GET /sensors/rooms/ : Liste les salles disponibles et leurs capteurs associés.
GET /doors/status/ : Retourne l’état actuel des portes sur la carte interactive.
L’API permet ainsi au frontend de récupérer en temps réel les informations nécessaires à l'affichage des graphiques et de la carte interactive.



## IV. Fonctionnalités de l'application

### 4.1 Carte interactive
#### 4.1.1 Visualisation de la carte
- Affichage du plan du bâtiment
- Interaction avec les salles via des clics
- Pop-ups d'information pour chaque salle
- Indication visuelle de l'état des portes

#### 4.1.2 Visualisation des données en temps réel
- Température
- Humidité
- État des portes
- Mise à jour automatique des données



### 4.2 Interface d'historique
#### 4.2.1 Système de filtres
- Sélection de salle
- Type de capteur
- Période temporelle

#### 4.2.2 Visualisation graphique
- Affichage des graphiques des données sélectionnées