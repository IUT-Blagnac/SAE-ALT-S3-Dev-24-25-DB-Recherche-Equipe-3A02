
// URL de base pour l'API
const apiURL = 'http://localhost:8000/api'

// Permet de récupérer tous les capteurs disponibles
async function getAllSensors() {
    try {
        const response = await fetch(`${apiURL}/sensors`)
        return await response.json()
    } catch (error) {
        console.error('Erreur :', error)
        return {}
    }
}

// Permet de récupérer les capteurs pour une salle spécifique
async function getSensorsByRoom(roomId, sensorId, sensorType, field, startTime, endTime) {
    try {
        
        // on construit l'URL de l'API en fonction des paramètres
        let url = `${apiURL}/sensors/${roomId}`
        let params = []
        
        // ajout des paramètres si ils sont définis
        if (sensorId) params.push(`sensor_id=${sensorId}`)
        if (sensorType) params.push(`sensor_type=${sensorType}`)
        if (field) params.push(`field=${field}`)
        if (startTime) params.push(`start_time=${startTime}`)
        if (endTime) params.push(`end_time=${endTime}`)
        
        // si il y a des paramètres on les ajoute à l'URL
        if (params.length > 0) {
            url += '?' + params.join('&')
        }

        const response = await fetch(url)
        return await response.json()
    } catch (err) {
        console.error(`Erreur pour la salle ${roomId}:`, err)
        return {}
    }
}

// Va chercher la liste des types de capteurs disponibles
async function getSensorTypes() {
    try {
        const response = await fetch(`${apiURL}/sensors_types`)
        return await response.json()
    } catch (err) {
        console.error('Erreur :', err)
        return {}
    }
}
