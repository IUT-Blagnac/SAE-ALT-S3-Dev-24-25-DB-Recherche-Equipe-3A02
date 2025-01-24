# SAÉ 3.01 2023-2024

[comment]: <> (/!\ A MODIFIER !!!)
[comment]: <> (:baseURL: https://github.com/IUT-Blagnac/sae3-01-template)

[comment]: <> (TIP: Pensez à mettre à jour les infos dans ce fichier pour que les badges pointent sur les résultats effectifs de vos intégrations continue ou sur la bonne licence logicielle.)

**Ce dépôt présente le projet à développer dans le cadre de la SAÉ 3.01 du BUT2 Informatique de l'IUT de Blagnac.**

[![Quality Gate Status](https://sonarqube.endide.com/api/project_badges/measure?project=saerecherche&metric=alert_status&token=sqb_42450a8aee8dd783bac82122f9c36dd4b062a832)](https://sonarqube.endide.com/dashboard?id=saerecherche)

## Table de matière

- [SAÉ 3.01 2023-2024](#saé-301-2023-2024)
  - [Table de matière](#table-de-matière)
  - [Équipe](#équipe)
  - [Gestion de projet et Qualité](#gestion-de-projet-et-qualité)
  - [Contexte général](#contexte-général)
    - [Liens utiles](#liens-utiles)
  - [Réalisations](#réalisations)
    - [Installation de notre application](#installation-de-notre-application)
    - [Aborescence](#aborescence)
  - [retour GPO](#retour-gpo)
    - [retour Backlog produit](#retour-backlog-produit)
    - [retour sprint 1](#retour-sprint-1)
    - [communication](#communication)
    - [retour RB](#retour-rb)


## Équipe

L'équipe de ce projet est constitué de 7 personnes. Voici leurs noms, rôles, et répartition du travail :

| Nom du membre de l'équipe | Rôle dans l'équipe | Répartition de travail |
|---------------------------|--------------------|------------------------|
|[Ophélie WINTERHOFF](https://github.com/ophewinx) | Cheffe d'équipe, Développeuse | 13.33% |
|[Zachary IVARS](https://github.com/Traimix05) | Product Owner, Développeur | 13.33% |
|[Yahya MAGAZ](https://github.com/Magaz-Yahya) | SCRUM Master, Développeur | 13.33% |
|[Naila BON](https://github.com/naila-bon) | Développeuse | 13.33% |
|[Adrien FAURÉ](https://github.com/AirbnbEcoPlus) | Développeur | 20.00% | 
|[Esteban GARNIL](https://github.com/estbanGarnil) | Développeur | 13.33% |
|[Mete YALÇIN](https://github.com/MetelsCoding) | Développeur| 13.33% |


Tutrice & tuteur enseignant.e.s de l'équipe : [Cassandre Vey](cassandre.vey@irit.fr), [Remi Boulle](remi.boulle@univ-tlse2.fr) & [Esther Pendaries](esther.pendaries@univ-tlse2.fr)

## Gestion de projet et Qualité

Chaque sprint (une semaine et demi) nous livrons une nouvelle version de notre application (release).
Nous utilisons pour cela les fonctionnalités de GitHub pour les [Releases](https://docs.github.com/en/repositories/releasing-projects-on-github).

- Version courante : [v0.0.1]()
- Lien vers la doc technique : [Documentation Technique](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Documentation/Doc%20Technique/Technical_Document.md)
- Lien vers la doc utilisateur : [Documentation Utilisateur](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Documentation/Documentation%20Utilisateur/User_Document.md)
- Liste des User Stories avec leurs (User Stories/Todo/In progress/In review/Done) et % restant :

  | User Story | Lien vers User Story | Étape de réalisation | % restant |
  |------------|----------------------|----------------------|-----------|
  | Visualisation en temps réel de l'état des salles | [US1](https://github.com/orgs/IUT-Blagnac/projects/296/views/1?pane=issue&itemId=93015121&issue=IUT-Blagnac%7CSAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02%7C2) | ToDo | 100% |
  |Consultation de l'historique de l'état des salles | [US2](https://github.com/orgs/IUT-Blagnac/projects/296/views/1?pane=issue&itemId=93017220&issue=IUT-Blagnac%7CSAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02%7C3) | ToDo | 100% |
  
- Tests unitaires et [cahier de tests](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Documentation/Cahier%20de%20tests/Test_Book.md)
- Indicateurs de qualité du code (dette technique) :
- Lien vers [Backlog](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/issues)
- Liste des Sprints :
  - [Sprint 1](https://github.com/orgs/IUT-Blagnac/projects/296)
  - (Sprint 2)[https://github.com/orgs/IUT-Blagnac/projects/306]
- Liste des ODJs et leurs CRs :

  | Ordres du Jour | Compte-rendus |
  |----------------|---------------|
  | [ODJ 07-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/07-01-2025/Ordre%20Du%20Jour%2007-01-2025.pdf) | [CR 07-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/07-01-2025/CR%20Re%CC%81union%2007-01-2025.pdf)|
  | [ODJ 14-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/14-01-2025/Ordre%20Du%20Jour%2014-01-2025.pdf) | [CR 14-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/14-01-2025/CR%20Re%CC%81union%2014-01-2025.pdf)|
  | [ODJ 16-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/16-01-2025/Ordre%20Du%20Jour%2016-01-2025.pdf) | [CR 16-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/16-01-2025/CR%20Re%CC%81union%2016-01-2025.pdf)|
  | [ODJ 17-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/17-01-2025/Ordre%20Du%20Jour%2017-01-2025.pdf) | [CR 17-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/17-01-2025/CR%20Re%CC%81union%2017-01-2025.pdf)|
  | [ODJ 22-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/22-01-2025/Ordre%20Du%20Jour%2022-01-2025.pdf) | [CR 22-01-2025](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/master/Gestion%20de%20projet/22-01-2025/CR%20Re%CC%81union%2022-01-2025.pdf)|


## Contexte général

Il nous a été demandé de faire un site web ainsi qu'une API pour le bâtiment de recherche. Ce site web regroupe les informations de différents capteurs (température, humidité, l'état d'une porte, ...) des différentes salles dans le bâtiment C. Nous devons présenter ces informations de manière explicite et compréhensible, grâce à une carte interactive du bâtiment de recherche affichant les données en temps réels. Mais aussi, nous devons afficher un historique sous forme de graphiques pour démontrer l'évolution sur une une période, ainsi que d'autres demandes et fonctionnalités.

L'éxistant est constitué de seulement un base de données InfluxDB.

Les contraintes sont :
  - utilisation d'une base de données InfluxDB
  - création d'une API supplémentaire permettant de faire des requêtes et du filtrage sur les données
  - utilisation du langage de programmation `Python` afin de faciliter sa modification ultérieurement


### Liens utiles

- Le [cours Moodle](https://webetud.iut-blagnac.fr/course/view.php?id=841) sur la SAE
- Le dépôt [template](https://github.com/IUT-Blagnac/sae3-01-template) qui sert de base à tous les dépôts étudiants.
- Le lien [classroom](https://classroom.github.com/a/OUF7gxEa) si besoin.
- Le lien [documentation](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/tree/master/Documentation)

## Réalisations 

TIP: Mettez ici toutes les informations nécessaire à l'utilisation de votre dépôt (comment on installe votre application, où sont les docs, etc.)

### Installation de notre application

### Aborescence
Les documents se trouverons dans un premier temps un répertoir appelé `Documentation`. Dans ce répertoir `Documentation` vous trouverez : 
- un répertoir `Documentation Techinque` contenant toutes les ressources pour la documentation ainsi que le fichier Markdown pour la documentation technique.
- un répertoir `Documentation Utilisateur` contenant toutes les ressources pour la documentation ainsi que le fichier Markdown pour la documentation utilisateur.
- un répertoir `Cahier de tests` contenant toutes les ressources pour la documentation ainsi que le fichier Markdown pour le cahier de tests.

## retour GPO

### retour Backlog produit
Backlog avec 2 US seulement mais bien rédigées.
note 4/5

### retour sprint 1
Dans le projet je dois avoir un dashboard avec 4 colonnes  : US du sprint, tâches à faire, en cours  et terminées et cela pour chaque sprint. Je n'est pas de milestone pour les tâches ou les US. 
J'ai seulement 3 taches dans le sprint 1 assignées alors qu'il est censé être terminé. 
Docs avec seulement les titres.
Pas de release ! (au moins une maquette  à ce stade). 
Pas de cahier de tests.
je noterais le sprint 2 et le sprint 3 car très insuffisant sur ce sprint.

### communication
Pas de CR de réunion ni d'ODJ 
Attention il en faut au moins 2 au cours du projet

### retour RB

Même si c'est Cassandre Vey la PO, merci de faire un point d'étape avec moi dans la semaine avec démo de ce qui est fonctionnel


