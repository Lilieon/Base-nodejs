# Projet de base Nodejs
Projet de démarrage rapide d'une application node js

# Services disponible
* Logger
* Authentification

## Logger
Service de gestion des logs.
Deux stratégies disponibles :
 1. En environnement de test, redirection des logs dans le terminal
 2. En environnment de production, enregistrement des logs dans des fichiers (info et error).

## Authentification
Module d'authentification avec :
  * Méthode de création d'un nouvel utilisateur
  * Méthode de connexion avec email et mot de passe
  * Middelware de vérification d'authentification
  * Génération d'un token Json de connexion (Access et refresh token)
  * Gestion de session utilisateur

## Database
### Mysql
Module d'interraction avec une base de données mysql :
 * Connexion à une base de données
 * Execution d'une requète

### Sqlite
Module d'interraction avec une base de données sqlite :
 * Connexion à un fichier de base de données
 * Execution d'une requète avec retour de données
 * Execution d'une requète sans retour de données