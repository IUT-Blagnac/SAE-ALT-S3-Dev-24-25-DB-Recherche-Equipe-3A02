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

// Permet de mettre à jour les couleurs et les rotations des portes en fonction de leur status
async function updateDoorStatus() {
    try {
        
        // on récupère les données
        const sensorData = await getJson()
        
        // on récupère tous les paths correspondant à ceux des portes dans le SVG
        const doorPaths = document.querySelectorAll('path[data-door]')
        
        // on parcourt les paths pour mettre à jour les couleurs et les rotations
        doorPaths.forEach(path => {
            const roomId = path.getAttribute('data-door')
            
            // verification si la salle a des données et ensuite recherche des capteurs dans la salle
            if (sensorData[roomId] && sensorData[roomId].sensors) {

                const doorSensor = sensorData[roomId].sensors.find(
                    sensor => sensor.type === 'door_sensor' && sensor.field === 'contact'
                )
                
                // attribution des couleurs en fonction de la valeur du capteur
                if (doorSensor) {
                    path.setAttribute('fill', doorSensor.value === false ? 'gray' : 'black')
                } else {
                    path.setAttribute('fill', 'white')
                }
            } else {
                path.setAttribute('fill', 'white')
            }
        })
    } catch (err) {
        console.error('Erreur :', err)
    }
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