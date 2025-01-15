# Utiliser une image de base Python
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances nécessaires pour Python et Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs && apt-get clean

# Installer Tailwind CSS via npm
RUN npm install -g tailwindcss

# Copier les fichiers de configuration du projet
COPY backend/requirements.txt /app/

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt



# Copier tout le code source du backend
COPY backend /app/

RUN python manage.py tailwind install

RUN npm config set cache /app/.npm-cache --global

# Exposer le port pour Django
EXPOSE 8000

# Commande par défaut pour démarrer le serveur Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
