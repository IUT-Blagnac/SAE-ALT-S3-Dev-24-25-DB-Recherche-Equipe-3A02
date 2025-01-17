
// Récupère les données des capteurs depuis l'API locale
// En cas d'erreur, renvoie un tableau vide pour éviter les crashs
async function getSensorData() {
    try {
        const response = await fetch('http://localhost:8000/api/sensors');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return [];
    }
}

// Permet de garder que les données qui correspondent à la salle sélectionnée
function filterRoomData(data, roomId) {
    const filteredData = [];
    for (const sensor of data) {
        if (sensor.room_id === roomId) {
            filteredData.push(sensor);
        }
    }
    return filteredData;
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
    const roomData = filterRoomData(sensorData, roomName);
    
    const realData = {
        temperature: getLatestValue(roomData, 'temperature'),
        humidity: getLatestValue(roomData, 'humidity'),
        co2: getLatestValue(roomData, 'co2'),
        eco2: getLatestValue(roomData, 'eco2')
    };

    // Valeurs par défaut au cas où les capteurs ne renvoient rien
    const testData = {
        temperature: '22°C',
        humidity: '45%',
        co2: '400 ppm',
        eco2: '450 ppm'
    };

    // On ajoute les unités de mesure aux valeurs récupérées
    const formattedData = {
        temperature: realData.temperature ? `${realData.temperature}°C` : testData.temperature,
        humidity: realData.humidity ? `${realData.humidity}%` : testData.humidity,
    };

    return formattedData;
}

// Permet de faire l'affichage de la fenêtre popup avec les informations de la salle
async function showPopup(element) {
    const popup = document.getElementById('popup');
    const roomName = element.getAttribute('data-room');

    // On va chercher les dernières données disponibles
    const data = await fetchData(roomName);

    // On update le view avec les nouvelles données
    document.getElementById('popup-title').innerText = `Données en ${roomName}`;
    document.getElementById('temp-value').innerText = data.temperature;
    document.getElementById('humidity-value').innerText = data.humidity;


    // On positionne la fenêtre popup juste à côté de l'élément cliqué
    const rect = element.getBoundingClientRect();
    popup.style.top = `${rect.top + window.scrollY + element.offsetHeight}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    // On rend la fenêtre visible
    popup.style.display = 'block';
}

// Masque la fenêtre popup quand on veut la fermer
function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Ferme automatiquement la popup si on clique en dehors
// Mais la garde ouverte si on clique sur un bouton ou dans la popup
document.addEventListener('click', (event) => {
    const popup = document.getElementById('popup');
    const isClickInside = popup.contains(event.target) || 
                         event.target.classList.contains('trigger-btn') || 
                         event.target.hasAttribute('data-room');
    if (!isClickInside) {
        hidePopup();
    }
});

// Configure les boutons pour qu'ils affichent les données quand on clique dessus
document.querySelectorAll('.trigger-btn').forEach(button => {
    button.addEventListener('click', () => showPopup(button));
});

// Fait la même chose pour les zones cliquables sur le plan
document.querySelectorAll('path[data-room]').forEach(path => {
    path.addEventListener('click', () => showPopup(path));
});

// Ajoute la fonction de fermeture au bouton × de la popup
document.querySelector('.close-btn').addEventListener('click', hidePopup);