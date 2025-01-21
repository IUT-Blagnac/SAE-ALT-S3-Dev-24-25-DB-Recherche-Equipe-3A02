// Récupère les données des capteurs depuis l'API locale
// En cas d'erreur, renvoie un objet vide pour éviter les crashs
async function getSensorData() {
    try {
        const response = await fetch('http://localhost:8000/api/sensors');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return {};
    }
}

// Récupère les données des capteurs pour une salle spécifique
function getRoomData(data, roomId) {
    if (data[roomId] && data[roomId].sensors) {
        return data[roomId].sensors;
    }
    return [];
}

// Cherche la dernière valeur disponible pour un type de mesure spécifique
// Par exemple: température, humidité, etc.
function getLatestValue(roomData, field) {
    const sensorData = roomData.find(sensor => sensor.field === field);
    return sensorData ? sensorData.value : null;
}

// Fonction principale qui récupère soit les données réelles des capteurs,
// soit des données de test si les capteurs ne répondent pas
async function fetchData(roomName) {
    // On essaie d'abord de récupérer les vraies données
    const sensorData = await getSensorData();
    const roomData = getRoomData(sensorData, roomName);
    
    const realData = {
        temperature: getLatestValue(roomData, 'temperature'),
        humidity: getLatestValue(roomData, 'humidity')
    };

    // Valeurs par défaut au cas où les capteurs ne renvoient rien
    const testData = {
        temperature: '22°C',
        humidity: '45%'
    };

    // On ajoute les unités de mesure aux valeurs récupérées
    const formattedData = {
        temperature: realData.temperature ? `${realData.temperature}°C` : testData.temperature,
        humidity: realData.humidity ? `${realData.humidity}%` : testData.humidity
    };

    return formattedData;
}

// Gère l'affichage de la fenêtre popup avec les informations de la salle
async function showPopupOnHover(element) {
    const popup = document.getElementById('popup');
    const roomName = element.getAttribute('data-room');

    // On va chercher les dernières données disponibles
    const data = await fetchData(roomName);

    if (!popup.classList.contains('fixed')){
        // On update le view avec les nouvelles données
    document.getElementById('popup-title').innerText = `Données en ${roomName}`;
    document.getElementById('temp-value').innerText = data.temperature;
    document.getElementById('humidity-value').innerText = data.humidity;

    // On rend la fenêtre visible
    popup.style.display = 'block';

    updatePopupPosition(element, popup);

    const mouseMoveHandler = (event) => {
        if (!popup.classList.contains('fixed')){
            updatePopupPosition(event, popup);
        }
    };

    element.addEventListener('mousemove', mouseMoveHandler);

    element.addEventListener('mouseleave', () => {
        if (!popup.classList.contains('fixed')) {
            hidePopupOnHover();
        }
        element.removeEventListener('mousemove', mouseMoveHandler);
    });

    element.addEventListener('click', (event) => {
        event.stopPropagation();
        popup.classList.add('fixed');
        popup.style.top = `${event.pageY + 10}`;
        popup.style.left = `${event.pageX + 10}`;
        element.removeEventListener('mousemove', mouseMoveHandler);
    });
    }
}

// Masque la fenêtre popup quand on quitte une zone
function hidePopupOnHover() {
    document.getElementById('popup').style.display = 'none';
    popup.classList.remove('fixed');
}

// Configure les zones cliquables pour afficher la popup au survol
document.querySelectorAll('path[data-room]').forEach(path => {
    path.addEventListener('mouseenter', () => showPopupOnHover(path));
});

// Ferme automatiquement la popup si on clique en dehors
// Mais la garde ouverte si on clique sur un bouton ou dans la popup
document.addEventListener('click', (event) => {
    const popup = document.getElementById('popup');
    const isClickInside = popup.contains(event.target) || 
                         event.target.classList.contains('trigger-btn') || 
                         event.target.hasAttribute('data-room');
    if (!isClickInside) {
        hidePopupOnHover();
    }
});

// Mets à jour la position de la popup
function updatePopupPosition(event, popup) {
    const popupOffset = 10; // Décalage pour éviter que la popup soit directement sous le curseur
    popup.style.top = `${event.pageY + popupOffset}px`;
    popup.style.left = `${event.pageX + popupOffset}px`;
}

// Ajoute la fonction de fermeture au bouton × de la popup
document.querySelector('.close-btn').addEventListener('click', () => hidePopupOnHover());