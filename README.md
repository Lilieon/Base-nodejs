# Projet de base Nodejs
Projet de démarrage rapide d'une application node js

# Services disponible
* [Logger](#Logger)
* [Cache Manager](#Cache-Manager)
* [Authentification](#Authentification)
* [Database](#Database)
* [Mailer](#Mailer)

## Logger
Service de gestion des logs.
Deux stratégies disponibles :
 1. En environnement de test, redirection des logs dans le terminal
 2. En environnment de production, enregistrement des logs dans des fichiers (info et error).

## Cache Manager
Service de gestion de cache, utilisé pour stocker des données en cache et y accèder rapidement.

Le servis utilise une application REDIS pour gérer le cache.  
**REDIS doit être installer sur le serveur, le port utilisé (par défaut) est le 6379**

Ce service doit être initialisé avant d'être utilisé :
``` typescript
import * as cacheManager from "./service/cacheManager.service";
cacheManager.initialize();
```

## Authentification
Module d'authentification avec :
  * Méthode de création d'un nouvel utilisateur
  * Méthode de connexion avec email et mot de passe et de déconnexion
  * Middelware de vérification d'authentification
  * Génération d'un token Json de connexion (Access et refresh token)
  * Recréation d'un token d'accès (utilisation du refresh token)

Ce module a besoin d'un système de gestion de cache pour garder en mémoire les refresh token actif. Le module utilise REDIS.
## Database
### Mysql
Module d'interraction avec une base de données mysql :
 * Connexion à une base de données
 * Execution d'une requète

Ce service doit être initialisé avant d'être utilisé :
``` typescript
import * as mysql from "./service/database-mysql";
mysql.initialize();
```

### Sqlite
Module d'interraction avec une base de données sqlite :
 * Connexion à un fichier de base de données
 * Execution d'une requète avec retour de données
 * Execution d'une requète sans retour de données

## Mailer
Module d'envoi d'email.
Le module doit être initialisé :
``` typescript
import * as mail from "./service/mail.service";
mail.initialize();
```