# Cahier de tests - Recherches DashBoard

## Sommaire
- [I. Introduction](#i-introduction)
  - [1. Objectif](#1-objectif)
  - [2. Méthodologie basée sur le cas d'utilisation](#2-méthodologie-basée-sur-le-cas-d-utilisation)
- [II. Planification des tests](#ii-planification-des-tests)
  - [1. Stratégie et critères d'acceptation](#1-stratégie-et-critères-d-acceptation)
  - [2. Environnement de test](#2-environnement-de-test)
- [III. Zoom sur les fonctionnalités](#iii-zoom-sur-les-fonctionnalités)
  - [1. Carte interactive](#1-carte-interactive)
    - [1.1 Affichage du plan du bâtiment](#11-affichage-du-plan-du-bâtiment)
    - [1.2 Pop-ups d'information pour chaque salle](#12-pop-ups-d-information-pour-chaque-salle)
    - [1.3 Indication visuelle de l'état des portes](#13-indication-visuelle-de-l-état-des-portes)
  - [2. Interface d'historique](#2-interface-d-historique)
    - [2.1 Affichage de la page historique](#21-affichage-de-la-page-historique)
    - [2.2 Sélection de la salle via un système de filtres](#22-sélection-de-la-salle-via-un-système-de-filtres)
    - [2.3 Visualisation graphique des données sélectionnées](#23-visualisation-graphique-des-données-sélectionnées)
- [IV. Conclusion](#iv-conclusion)

_Créé par : Yahya MAGAZ_

_A destination de : Cassandre Vey, Esther Pendaries et Rémi Boulle_

![Logo IUT](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/Cahier-de-tests/Documentation/images/Logo_IUT.png)

---

## I. Introduction

Ce document présente un site web développé pour afficher des salles de cours interactives. Ce site offre la possibilité de visualiser diverses informations sur chaque salle ainsi que de suivre l'évolution de certaines données en temps réel. L'objectif principal est de fournir une interface simple et intuitive pour consulter les paramètres de la salle et suivre l'historique des variations de ces paramètres.

### 1. Objectif

Le site web permet à l'utilisateur de consulter les données actuelles des salles de cours, telles que la température, l'humidité et l'état des portes (ouverte ou fermée). Une deuxième page, dédiée à l'historique, affiche des graphiques représentant l'évolution de ces paramètres sur une période donnée.

### 2. Méthodologie basée sur le cas d'utilisation

La méthodologie repose sur l'identification des besoins des utilisateurs et la création de deux pages principales : 
- La première page affiche en temps réel les données relatives à chaque salle de cours, telles que la température et l'humidité.
- La deuxième page permet de visualiser l'historique des données pour une date spécifique, en utilisant des graphiques pour montrer les variations de la température, de l'humidité et de l'état des portes au fil du temps.

---

## II. Planification des tests

### 1. Stratégie et critères d'acceptation

- **Critères fonctionnels** : Toutes les fonctionnalités doivent correspondre aux exigences définies dans les spécifications.
- **Critères de performance** : Le temps de réponse des interactions utilisateur ne doit pas dépasser 2 secondes.
- **Critères d'ergonomie** : L'interface doit être claire, intuitive et accessible.

### 2. Environnement de test

- **Navigateur** : Tests effectués sur Chrome, Firefox, Edge et Safari.
- **Base de données** : InfluxDB, SQLite3
- **Serveur de développement** : Django, Guvicorn

---

## III. Zoom sur les fonctionnalités

### 1. Carte interactive

La carte interactive permet de naviguer à travers le bâtiment et d'interagir avec les différentes salles. Voici les fonctionnalités principales de cette carte :

#### 1.1 Affichage du plan du bâtiment

![Affichage du plan du bâtiment](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/Cahier-de-tests/Documentation/images/UcConsultCarte.PNG)

- La carte du bâtiment est affichée, montrant toutes les salles de cours.
- La carte est interactive et réagit au survol de la souris, chaque salle devenant plus visible lorsqu'elle est survolée.

#### 1.2 Pop-ups d'information pour chaque salle

![Pop-up d'information](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/Cahier-de-tests/Documentation/images/UcVoirInfosCapteurs.PNG)

- Lorsqu'un utilisateur clique sur une salle, un pop-up apparaît.
- Le pop-up affiche des informations supplémentaires telles que la température et l'humidité de la salle sélectionnée.

#### 1.3 Indication visuelle de l'état des portes

![Indication de l'état des portes](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/Cahier-de-tests/Documentation/images/UcEtatPortes.PNG)

- Les portes des salles sont indiquées visuellement dans la carte, montrant si elles sont ouvertes ou fermées.
- Un changement d'état visuel est utilisé pour différencier les portes ouvertes des portes fermées.

---

### 2. Interface d'historique

L'interface d'historique permet aux utilisateurs de consulter les données passées et d'analyser les tendances au fil du temps.

#### 2.1 Affichage de la page historique

![Affichage de la page historique](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/Cahier-de-tests/Documentation/images/UcConsultHistorique.PNG)

#### 2.2 Sélection de la salle via un système de filtres

![Sélection de la salle avec filtres](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/Cahier-de-tests/Documentation/images/UcFiltres.PNG)

- Un système de filtres permet à l'utilisateur de sélectionner la salle pour afficher son historique.
- L'utilisateur peut choisir le type de capteur (température, humidité, état des portes) et la période pour laquelle les données doivent être affichées.

#### 2.3 Visualisation graphique des données sélectionnées

![Visualisation graphique](https://github.com/IUT-Blagnac/SAE-ALT-S3-Dev-24-25-DB-Recherche-Equipe-3A02/blob/Cahier-de-tests/Documentation/images/UcAfficherGraphes.PNG)

- Les données historiques sont affichées sous forme de graphiques.
- Les graphiques montrent les variations des données (température, humidité, état des portes) sur la période choisie.

---

## IV. Conclusion

Ce cahier de tests documente les principales fonctionnalités et leur validation pour garantir que le site web répond aux attentes des utilisateurs. En combinant une approche méthodique et des outils adaptés, l'équipe s'assure que l'application est fonctionnelle, intuitive et fiable. Les tests planifiés permettront de détecter et de corriger rapidement d'éventuelles anomalies, assurant ainsi une expérience utilisateur optimale et une conformité avec les objectifs fixés.

