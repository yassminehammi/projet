# Pet Shop - DevOps Project

## Description

Pet Shop est une application Python conteneurisée permettant de gérer une boutique d'accessoires et de nourriture pour animaux.

## Architecture

```text
Utilisateur
     |
     v
Application Flask (Port 3000)
     |
     v
PostgreSQL
     |
     v
Docker Compose
     |
     v
GitHub Actions
     |
     v
Docker Hub
     |
     v
Uptime Kuma + Discord
```

## Prérequis

- Git
- Docker Desktop
- Docker Compose
- Compte GitHub
- Compte Docker Hub

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/yassminehammi/projet.git
cd projet
```

Lancer les services :

```bash
docker compose up -d
```

Vérifier les conteneurs :

```bash
docker ps
```

## Vérification

Tester l'application :

```bash
curl http://localhost:3000/health
```

Résultat attendu :

```json
{"status":"healthy"}
```

## Monitoring

Uptime Kuma :

```text
http://localhost:3001
```

Sonde surveillée :

```text
http://host.docker.internal:3000/health
```

Notifications envoyées sur Discord.
## Pipeline CI/CD

Le pipeline est défini dans :

```text
.github/workflows/ci.yml
```

### Étape 1 : Validation du code

```bash
python -m py_compile app.py
```

Cette étape vérifie l'absence d'erreurs de syntaxe Python.

### Étape 2 : Connexion Docker Hub

Authentification via les secrets GitHub :

```text
DOCKER_USERNAME
DOCKER_PASSWORD
```

### Étape 3 : Build Docker

```bash
docker build -t yassminehammi/projet-app:${{ github.sha }} .
```

Création automatique d'une image Docker.

### Étape 4 : Push Docker Hub

```bash
docker push yassminehammi/projet-app:${{ github.sha }}
```

Publication de l'image dans Docker Hub.
## Reproduire le projet

1. Cloner le dépôt :

```bash
git clone https://github.com/yassminehammi/projet.git
```

2. Accéder au projet :

```bash
cd projet
```

3. Démarrer l'application :

```bash
docker compose up -d
```

4. Vérifier les conteneurs :

```bash
docker ps
```

5. Tester le Health Check :

```bash
curl http://localhost:3000/health
```
Test protection main