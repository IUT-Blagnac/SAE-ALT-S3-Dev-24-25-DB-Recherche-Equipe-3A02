// Importation de fetch simulator
import { getAllSensors } from './fetcher.js'

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
        let sensorData = {};
        while (Object.keys(sensorData).length === 0) {
            sensorData = await getJson();
            if (Object.keys(sensorData).length === 0) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
 
        // on récupère tous les paths correspondant à ceux des portes dans le SVG
        const doorPaths = document.querySelectorAll('path[data-door]');
        
        // on parcourt les paths pour mettre à jour les couleurs et les rotations
        doorPaths.forEach(path => {
            const roomId = path.getAttribute('data-door')
            
            // verification si la salle a des données et ensuite recherche des capteurs dans la salle
            if (sensorData[roomId]?.sensors) {
                const doorSensor = sensorData[roomId].sensors.find(
                    sensor => sensor.field === 'contact'
                )
                
                // attribution des couleurs en fonction de la valeur du capteur
                if (doorSensor) {
                    const isOpen = doorSensor.value === false;
                    path.setAttribute('fill', isOpen ? 'gray' : 'black');
                    
                    // on récupère le centre du path pour le décalage et la rotation et on applique les valeurs correspondantes
                    const bbox = path.getBBox();
                    const centerX = bbox.x + bbox.width / 2;
                    const centerY = bbox.y + bbox.height / 2;
                    
                    if (!isOpen && doorInfo[roomId]) {
                        const config = doorInfo[roomId];
                        path.setAttribute('transform', 
                            `translate(${config.offsetX}, ${config.offsetY}) ` +
                            `rotate(${config.angle}, ${centerX}, ${centerY})`);
                    } else {
                        path.setAttribute('transform', '');
                    }
                } else {
                    path.setAttribute('fill', 'white');
                    path.setAttribute('transform', '');
                }
            } else {
                path.setAttribute('fill', 'white');
                path.setAttribute('transform', '');
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut des portes :', error);
    }
}

// Permet de faire l'update de status de porte à l'initialisation de la page et ensuite toutes les 10 secondes
function initializeUpdateDoorStatus() {
    updateDoorStatus()
    return setInterval(updateDoorStatus, 10000)
}

// export des fonctions au cas où vous voulez les appeler autre part
export {
    updateDoorStatus,
    initializeUpdateDoorStatus
}

// on appelle la fonction pour l'initialisation
initializeUpdateDoorStatus()