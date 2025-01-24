import { getAllSensors } from './fetcher.js';

// Dictionnaire des unités
const typeUnite = {
    temperature: '°C',
    humidity: '%',
};

// Permet de récuperer les données des capteurs depuis l'API
async function getSensorData() {
    try {
        return await getAllSensors();
    } catch (error) {
        console.error('Erreur :', error);
        return {};
    }
}

// Permet de récuperer les données des capteurs pour une salle
function getRoomData(data, roomId) {
    if (data[roomId]?.sensors) {
        return data[roomId].sensors;
    }
    return [];
}

// permet de récupérer la dernière valeur d'un champ spécifique
function getLatestValue(roomData, field) {
    const sensorData = roomData.find(sensor => sensor.field === field);
    return sensorData ? sensorData.value : null;
}

// permet de récupérer l'heure de la dernière valeur reçue
function getLatestTimestamp(roomData) {
    const latestTimestamp = roomData.reduce((latest, sensor) => {
        const sensorTimestamp = new Date(sensor.timestamp).getTime();
        return sensorTimestamp > latest ? sensorTimestamp : latest;
    }, 0);

    // renvoie la l'heure de la dernière valeur reçue
    return latestTimestamp ? new Date(latestTimestamp).toLocaleString('fr-FR') : null;
}

// Permet de formatter une valeur avec son unité correspondante
function formatValue(value, field) {

    // valeur null ou undefined alors on retourne '--'
    if (value === null || value === undefined) {
        return '--';
    }
    
    // on ajoute l'unité correspondante
    const unite = typeUnite[field] || '';
    return `${value}${unite}`;
}

// Permet de récupérer les données pour une salle
async function fetchData(roomName) {
    
    // récupère les données
    const sensorData = await getSensorData();
    const roomData = getRoomData(sensorData, roomName);
    
    const realData = {
        temperature: getLatestValue(roomData, 'temperature'),
        humidity: getLatestValue(roomData, 'humidity'),
        timestamp: getLatestTimestamp(roomData)
    };

    // formate les données avec leurs unités
    const formattedData = {
        temperature: formatValue(realData.temperature, 'temperature'),
        humidity: formatValue(realData.humidity, 'humidity'),
        timestamp: formatValue(realData.timestamp, 'timestamp')
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
        // On update le view avec les nouvelles données lorsque le pop-up n'est pas fixe
        document.getElementById('popup-title').innerText = `Données en ${roomName}`;
        document.getElementById('temp-value').innerText = data.temperature;
        document.getElementById('humidity-value').innerText = data.humidity;
        document.getElementById('last-data-recieved-value').innerText = data.timestamp;

        // On positionne la fenêtre popup juste à côté de l'élément cliqué
        const rect = element.getBoundingClientRect();
        popup.style.top = `${rect.top + window.scrollY + element.offsetHeight}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

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
            popup.style.top = `${event.pageY + 10}px`;
            popup.style.left = `${event.pageX + 10}px`;
            element.removeEventListener('mousemove', mouseMoveHandler);
        });
    }
}

// Masque la fenêtre popup quand on quitte une zone
function hidePopupOnHover() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    popup.classList.remove('fixed');
}

// Mets à jour la position de la popup
function updatePopupPosition(event, popup) {
    const popupOffset = 10; // Décalage pour éviter que la popup soit directement sous le curseur
    popup.style.top = `${event.pageY + popupOffset}px`;
    popup.style.left = `${event.pageX + popupOffset}px`;
}

// Configuration des événements pour les zones sur SVG
document.querySelectorAll('path[data-room]').forEach(path => {
    path.addEventListener('mouseenter', () => showPopupOnHover(path));
});

// Ferme automatiquement la popup si on clique en dehors
document.addEventListener('click', (event) => {
    const popup = document.getElementById('popup');
    const isClickInside = popup.contains(event.target) || 
                         event.target.classList.contains('trigger-btn') || 
                         event.target.hasAttribute('data-room');
    if (!isClickInside) {
        hidePopupOnHover();
    }
});

// Ajoute la fonction de fermeture au bouton × de la popup
document.querySelector('.close-btn').addEventListener('click', () => hidePopupOnHover());