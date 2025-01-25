
// Données fakes pour effectuer des tests
const fakeData = {
    sensors: {
        "unknown": {
            "sensors": [
                { "name": "unknown", "type": "unknown", "field": "values", "timestamp": "2025-01-21T10:12:10.659Z", "value": 1737454329921 }
            ]
        },
        "C002": { "sensors": [{ "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T22:05:30.413Z", "value": true }] },
        "C101": { "sensors": [{ "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T21:37:50.210Z", "value": false }] },
        "C102": { "sensors": [{ "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T22:20:06.822Z", "value": true }] },
        "C103": { "sensors": [{ "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T22:05:30.413Z", "value": true }] },
        "C104": {
            "sensors": [
                { "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T19:17:59.542Z", "value": true },
                { "name": "ZTH02", "type": "th_sensor", "field": "humidity", "timestamp": "2025-01-15T21:37:50.131Z", "value": 31 },
                { "name": "ZTH02", "type": "th_sensor", "field": "temperature", "timestamp": "2025-01-15T21:37:50.131Z", "value": 20.9 }
            ]
        },
        "C105": { "sensors": [{ "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T21:37:50.210Z", "value": true }] },
        "C106": {
            "sensors": [
                { "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T21:37:49.978Z", "value": true },
                { "name": "ZTH02", "type": "th_sensor", "field": "humidity", "timestamp": "2025-01-15T21:40:46.628Z", "value": 25 },
                { "name": "ZTH02", "type": "th_sensor", "field": "temperature", "timestamp": "2025-01-15T21:40:46.628Z", "value": 59 }
            ]
        },
        "C107": { "sensors": [{ "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T21:37:50.058Z", "value": true }] },
        "C108": { "sensors": [{ "name": "TS0203", "type": "door_sensor", "field": "contact", "timestamp": "2025-01-15T22:05:30.413Z", "value": true }] }
    },
    sensorTypes: {
        "th_sensor": { 
            "fields": ["temperature", "humidity"], 
            "description": "Un capteur de temperature" 
        }, 
        "door_sensor": { 
            "fields": ["contact"], 
            "description": "Un capteur de porte" 
        }
    }
}

// Permet de récupérer toutes data de sensors
async function getAllSensors() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeData.sensors)
        }, 100)
    })
}

// Permet de récupérer les sensors pour une salle
async function getSensorsByRoom(roomId, sensorId, sensorType, field, startTime, endTime) {
    return new Promise((resolve) => {
        setTimeout(() => {

            // on retourne les données de la salle si elles existent sinon un objet vide
            const roomData = fakeData.sensors[roomId] || {}
            resolve(roomData)
        }, 100)
    })
}

// Permet de chercher la liste des types de sensor
async function getSensorTypes() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeData.sensorTypes)
        }, 100)
    })
}

// Export des fonctions
export {
    getAllSensors,
    getSensorsByRoom,
    getSensorTypes
}