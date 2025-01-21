// Permet de récuperer toutes les données des capteurs depuis l'API locale
async function getAllSensors() {
    try {
        const response = await fetch('http://localhost:8000/api/sensors');
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error :', error);
        return {};
    }
}