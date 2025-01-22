import { getAllSensors } from './fetcher.js';

// Récupère les données des capteurs depuis l'API
async function getSensorData() {
    try {
        return await getAllSensors();
    } catch (error) {
        console.error('Erreur :', error);
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

// Permet de récupérer la dernière valeur d'un champ spécifique
function getLatestValue(roomData, field) {
    const sensorData = roomData.find(sensor => sensor.field === field);
    return sensorData ? sensorData.value : null;
}

// Fonction qui met à jour la couleur des capteurs de porte
async function updateDoorSensorColors() {
    const sensorData = await getSensorData();

    // Sélectionner tous les éléments <path> associés à des capteurs de porte
    document.querySelectorAll('path[data-room]').forEach(path => {
        const roomName = path.getAttribute('data-room');
        const roomData = getRoomData(sensorData, roomName);

        // Obtenir la dernière valeur du capteur de contact (field: 'contact')
        const contactValue = getLatestValue(roomData, 'contact');

        // Changer la couleur en fonction de la valeur du capteur
        if (contactValue === true) {
            path.setAttribute('fill', 'red');  // Porte ouverte (true)
        } else if (contactValue === false) {
            path.setAttribute('fill', 'green');  // Porte fermée (false)
        } else {
            path.setAttribute('fill', 'yellow');  // Pas de données (null)
        }
    });
}

// Mettre à jour les couleurs des capteurs de porte dès que la page est chargée
document.addEventListener('DOMContentLoaded', updateDoorSensorColors);
