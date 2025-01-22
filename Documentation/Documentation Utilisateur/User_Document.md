
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

### Ajout d'une nouvelle salle dans le fichier SVG et l'application
**Fichier SVG :**

Il faut ouvrir Figma et créer un nouveau projet et faites un clique-glisser et déposer le fichier SVG dans le nouveau projet figma.

Dirigez-vous sur la layer3. Prennez l'outil "Stylo" et faites la délimitaion de la salle. Il est important de cliquer pour faire des points et non glisser, car glisser fait des arcs et non des lignes. Pour ajouter le nom/numéro de la salle, mettez vous sur layer2 et ajouter du texte en utilisant l'outil "texte". Vous pouvez également changer le style pour mieux correspondre à vos attentes avec les outils se trouvant dans la barre à droite.


Ensuite, vous faites "exporter" et vois choisissez le format SVG. Ouvrez le fichier SVG avec Notepad++ ou votre application bloc-note et remplacer la balise <svg></svg> dans le code ('SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/backend/theme/template/map.html') avec. 

En bas de code, vous allez touver une balise <g></g> ayant pour id 'layer3'. Ce couche désigne tous les délimitations d'espaces. Dans la ligne n'ayant pas de caractère "id=salleC\[numeroSalle]Region" ni de "data-room=C\[numeroSalle]", ajoutez ces deux propriétés en suivant les exemples des autres salles.
 
---

**Support et Assistance :** Si vous rencontrez un problème, veuillez contacter le support de l'application. 
