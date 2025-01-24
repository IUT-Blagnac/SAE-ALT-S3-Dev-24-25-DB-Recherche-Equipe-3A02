// Importation de fetcher
// import { getAllSensors, getSensorsByRoom } from './fetcher.js'

// Importation de fetch simulator
import { getAllSensors } from './fetch-simulator.js'

// Permet de récupérer les données des capteurs depuis l'API
// async function getJson(){
//     try {
//         const response = await fetch(`${apiURL}/sensors`)
//         return await response.json()
//     } catch (error) {
//         console.error('Erreur :', error)
//         return {}
//     }
// }

// Permet de récupérer les données fake
async function getJson() {
    return await getAllSensors()
}

// on définit les angles de rotation et les décalages pour chaque porte lorsqu'elle est fermée
const doorInfo = {
    'C101': { angle: -30.5, offsetX: 11, offsetY: 1.89 },
    'C102': { angle: 30, offsetX: -10, offsetY: 1.8 },
    'C103': { angle: 30, offsetX: -10, offsetY: 1.8 },
    'C104': { angle: 30.05, offsetX: -10, offsetY: 1.8 },
    'C105': { angle: 30, offsetX: 1.8, offsetY: 11 },
    'C106': { angle: 29.9, offsetX: 1.86, offsetY: 10 },
    'C107': { angle: 30, offsetX: 10, offsetY: -1.95 },
    'C108': { angle: -30, offsetX: -2, offsetY: 11 },
};

// Permet de mettre à jour les couleurs et les rotations des portes en fonction de leur status
async function updateDoorStatus() {
    try {
        // on récupère les données
        const sensorData = await getJson();
        
        // on récupère tous les paths correspondant à ceux des portes dans le SVG
        const doorPaths = document.querySelectorAll('path[data-door]');
        
        doorPaths.forEach(path => updatePathStyle(path, sensorData));
    } catch (err) {
        console.error('Erreur :', err);
    }
}

function updatePathStyle(path, sensorData) {
    const roomId = path.getAttribute('data-door');
    
    // verification si la salle a des données et ensuite recherche des capteurs dans la salle
    if (!sensorData[roomId]?.sensors) {
        resetPathStyle(path);
        return;
    }

    const doorSensor = sensorData[roomId].sensors.find(
        sensor => sensor.type === 'door_sensor' && sensor.field === 'contact'
    );

    if (doorSensor) {
        const isOpen = doorSensor.value === false;
        updatePathColor(path, isOpen);
        updatePathTransform(path, roomId, isOpen);
    } else {
        resetPathStyle(path);
    }
}

function updatePathColor(path, isOpen) {
    path.setAttribute('fill', isOpen ? 'gray' : 'black');
}

function updatePathTransform(path, roomId, isOpen) {
    if (!isOpen && doorInfo[roomId]) {
        const config = doorInfo[roomId];
        const bbox = path.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        path.setAttribute('transform', 
            `translate(${config.offsetX}, ${config.offsetY}) ` +
            `rotate(${config.angle}, ${centerX}, ${centerY})`);
    } else {
        path.setAttribute('transform', '');
    }
}

function resetPathStyle(path) {
    path.setAttribute('fill', 'white');
    path.setAttribute('transform', '');
}


// Permet de faire l'update de status de porte à l'initialisation de la page et ensuite toutes les 10 secondes
function initializeUpdateDoorStatus() {
    updateDoorStatus()
        return setInterval(updateDoorStatus, 10000)
}

// export des fonctios au cas ou vous voulez les appeller autre part
export {
    updateDoorStatus,
    initializeUpdateDoorStatus
}

// on appelle la fonction pour l'initialisation
initializeUpdateDoorStatus()