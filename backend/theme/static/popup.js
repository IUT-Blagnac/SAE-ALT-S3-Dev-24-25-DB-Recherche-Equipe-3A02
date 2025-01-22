import { getAllSensors, getSensorsByRoom } from './fetcher.js';

// Récupère les données des capteurs depuis l'API
async function getSensorData() {
    try {
        return await getAllSensors();
    } catch (error) {
        console.error('Erreur :', error);
        return {};
    }
}

// Récupère les données des capteurs pour une salle
function getRoomData(data, roomId) {
    if (data[roomId] && data[roomId].sensors) {
        return data[roomId].sensors;
    }
    return [];
}

// permet de récupérer la dernière valeur d'un champ spécifique
function getLatestValue(roomData, field) {
    const sensorData = roomData.find(sensor => sensor.field === field);
    return sensorData ? sensorData.value : null;
}

// Permet de récupérer les données pour une salle
async function fetchData(roomName) {

    // récupère les données
    const sensorData = await getSensorData();
    const roomData = getRoomData(sensorData, roomName);
    
    const realData = {
        temperature: getLatestValue(roomData, 'temperature'),
        humidity: getLatestValue(roomData, 'humidity')
    };

    // valeurs de test pour le développement ou si les données réelles ne sont pas disponibles
    const testData = {
        temperature: '22°C',
        humidity: '45%'
    };

    // on formate les données pour les afficher
    const formattedData = {
        temperature: realData.temperature ? `${realData.temperature}°C` : testData.temperature,
        humidity: realData.humidity ? `${realData.humidity}%` : testData.humidity
    };

    return formattedData;
}

// on affiche les données dans la fenêtre popup
async function showPopup(element) {
    const popup = document.getElementById('popup');
    const roomName = element.getAttribute('data-room');

    // on récupère les données
    const data = await fetchData(roomName);

    // modification des éléments de la fenêtre popup
    document.getElementById('popup-title').innerText = `Données en ${roomName}`;
    document.getElementById('temp-value').innerText = data.temperature;
    document.getElementById('humidity-value').innerText = data.humidity;

    // on positionne la fenêtre popup
    const rect = element.getBoundingClientRect();
    popup.style.top = `${rect.top + window.scrollY + element.offsetHeight}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    // fenetre popup visible
    popup.style.display = 'block';
}

// on cache la popup quand on clique sur le bouton de fermeture
function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

// on ferme la popup si on clique en dehors

document.addEventListener('click', (event) => {
    const popup = document.getElementById('popup');
    const isClickInside = popup.contains(event.target) || 
                         event.target.classList.contains('trigger-btn') || 
                         event.target.hasAttribute('data-room');
    if (!isClickInside) {
        hidePopup();
    }
});

// attribution de la fonction showPopup aux boutons déclencheurs
document.querySelectorAll('.trigger-btn').forEach(button => {
    button.addEventListener('click', () => showPopup(button));
});

// même chose pour les salles sur svg
document.querySelectorAll('path[data-room]').forEach(path => {
    path.addEventListener('click', () => showPopup(path));
});

// attribution de la fonction hidePopup au bouton de fermeture
document.querySelector('.close-btn').addEventListener('click', hidePopup);
