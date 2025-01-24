let salleSelect = null;
let typeSelect = [];
let datedeDebut = null;
let datedeFin = null;
let parametres_type = null;
let parametres_salle = null;

let visible = false;

// ecoute des clics
document.addEventListener("DOMContentLoaded", function () {
    get_parametre();
    let requete = document.getElementById("requete-api");
    requete.style.display =  "none";

    // Écouter les clics sur les salles
    document.querySelectorAll("input[name='filter1[]']").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const salleValue = event.target.value;
        const isChecked = event.target.checked;
        salleSelect = salleValue;
        if (isChecked) {
            let requete_fixe = document.getElementById("fixed-text");
            requete_fixe.style.display = "block";
            visible = true;

            effectuerRequete();
        }
        else {
            const allCanvases = document.querySelectorAll('canvas');
            allCanvases.forEach((canvas) => deleteCanva(canvas.id));  
            let requete = document.getElementById("requete-api");
            requete.style.display =  "none";
            let requete_fixe = document.getElementById("fixed-text");
            requete_fixe.style.display = "none";
            visible = false;
        }   
      });
    });
  
    // Écouter les clics sur les types de données
    document.querySelectorAll("input[name='filter2[]']").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const typeDonneeValue = event.target.value;
        const isChecked = event.target.checked;
        if (isChecked && !typeSelect.includes(typeDonneeValue)) {
            typeSelect.push(typeDonneeValue);
        } else {
            let index = typeSelect.indexOf(typeDonneeValue);

            if (index !== -1) {
                typeSelect.splice(index, 1);
            }
        }
        effectuerRequete();
      });
    });
  
    // Écouter la sélection des dates
    document.querySelector("input[name='date_debut']").addEventListener("change", (event) => {
      const dateDebut = event.target.value;
      datedeDebut = dateDebut;
      console.log(datedeDebut)
      effectuerRequete();
    });
  
    document.querySelector("input[name='date_fin']").addEventListener("change", (event) => {
      const dateFin = event.target.value;
      datedeFin = dateFin;
      console.log(datedeFin);
      effectuerRequete();
    });
  });

document.addEventListener("DOMContentLoaded", function () {
// Récupérer toutes les cases des salles
const salleCheckboxes = document.querySelectorAll("input[name='filter1[]']");

// un seul bouton cliquable a la fois
salleCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
        // Décochez toutes les autres cases sauf celle sélectionnée
        salleCheckboxes.forEach((otherCheckbox) => {
        if (otherCheckbox !== event.target) {
            otherCheckbox.checked = false;
        }
        });
    }
    });
});
});
  
// menu deroulants
document.addEventListener("DOMContentLoaded", function () {
document.querySelectorAll(".accordion-button").forEach((button) => {
    button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const content = document.getElementById(targetId);
    const icon = button.querySelector("svg");

    content.classList.toggle("hidden");
    button.classList.toggle("bg-gray-700");
    content.classList.toggle("bg-gray-700");
    icon.classList.toggle("rotate-180");
    });
});
});

let conversion = {
    "température" : "temperature",
    "humidité" : "humidity",
    "contact" : "contact"
}

function effectuerRequete() {
    if (!visible) return;

    if (salleSelect && typeSelect) {
        const constructrequete = createRequestUrl();
        displayRequestUrl(constructrequete);
        fetchSensorData(constructrequete);
    }
}

function createRequestUrl() {
    let url = `http://localhost:8000/api/sensors/${salleSelect}`;
    const params = createParams();
    
    if (params.length > 0) {
        url += `?${params.join("&")}`;
    }
    
    return url;
}

function createParams() {
    const params = [];

    typeSelect.forEach((element) => {
        params.push(`field=${element}`);
    });

    if (datedeDebut) {
        params.push(`start_time=${datedeDebut}`);
    }
    if (datedeFin) {
        params.push(`end_time=${datedeFin}`);
    }

    return params;
}

function displayRequestUrl(url) {
    const requete = document.getElementById("requete-api");
    requete.style.display = "block";
    requete.textContent = url;
}

function fetchSensorData(url) {
    fetch(url)
        .then(handleResponse)
        .then(processData)
        .catch(handleError);
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

function processData(data) {
    console.log("Données reçues :", data);
    const sensors = extractSensors(data);
    const groupedFields = groupSensors(sensors);
    console.log("Champs regroupés :", groupedFields);
    updateChart(groupedFields);
}

function extractSensors(data) {
    const key = Object.keys(data)[0];
    return key && data[key]?.sensors ? data[key].sensors : [];
}

function groupSensors(sensors) {
    return sensors.reduce((acc, sensor) => {
        const { field, value, timestamp } = sensor;
        initializeFieldAccumulator(acc, field);
        const dateLocale = formatDate(timestamp);
        const result = formatValue(field, value);
        acc[field][0].push(result);
        acc[field][1].push(dateLocale);
        return acc;
    }, {});
}

function initializeFieldAccumulator(acc, field) {
    if (!acc[field]) {
        acc[field] = [[], []]; // [valeurs, dates françaises]
    }
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function formatValue(field, value) {
    if (field === "contact"){
        return value ? 1 : 0; // soit 1 true, 0 false
    }
    return value;
}

function handleError(error) {
    console.error("Erreur lors de la récupération des données :", error);
    updateChart({}); // Appeler avec un objet vide pour afficher le message d'erreur
}


function get_parametre() {
    fetch("http://localhost:8000/api/parametres/").then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Transformer la réponse en JSON
    })
    .then((data) => {
        console.log(data);
        parametres_salle = data['room'];
        parametres_type = data['type'];
    })

}

// graphiques
function generateCanva(canvasId) {
    // Création de l'élément canvas
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.width = 400;
    canvas.height = 200;
    canvas.style.display = 'none';
    canvas.style.margin = '20px 0'; // Espace entre les graphiques
    canvas.style.marginTop = "5rem";
    canvas.style.border = '1px solid #ddd';
    canvas.style.borderRadius = '8px';

    // Ajout du wrapper dans le DOM
    document.getElementById("canva-container").appendChild(canvas);

    const downloadButton = document.createElement('button');
    downloadButton.id = "button"+canvasId;
    downloadButton.textContent = 'Télécharger le graphique';
    downloadButton.style.marginTop = '10px';
    downloadButton.style.display = 'block';

    downloadButton.addEventListener('click', () => {
        downloadChartWithBackground(canvasId, `${canvasId}.png`);
    });

    canvas.parentNode.appendChild(downloadButton);

}



function deleteCanva(canvasId) {
    // Sélectionner le canvas par son ID
    const canvas = document.getElementById(canvasId);

    // Vérifier si le canvas existe
    if (canvas) {
        // Trouver le bouton de téléchargement associé
        const downloadButton = document.getElementById("button" + canvasId);

        // Supprimer le canvas du DOM
        canvas.parentNode.removeChild(canvas);

        // Supprimer le bouton de téléchargement s'il existe
        if (downloadButton) {
            downloadButton.parentNode.removeChild(downloadButton);
        }

        // Trouver le separator associé via l'attribut data-associated-canvas
        const separator = document.querySelector(`.separator[data-associated-canvas="${canvasId}"]`);

        // Supprimer le separator s'il existe
        if (separator) {
            separator.parentNode.removeChild(separator);
        }
    } else {
        console.warn(`Canvas avec l'id "${canvasId}" n'existe pas.`);
    }
}


function updateChart(groupedFields) {
    const message = document.getElementById('noDataMessage');

    // Supprimer tous les canvas existants
    const allCanvases = document.querySelectorAll('canvas');
    allCanvases.forEach((canvas) => deleteCanva(canvas.id));

    // Créer des canvas pour chaque type dans groupedFields
    Object.keys(groupedFields).forEach((field) => {
        generateCanva(field);
    });

    // Si aucun champ n'est disponible, afficher un message et retourner
    if (Object.keys(groupedFields).length === 0) {
        message.style.display = 'block';
        return;
    }

    message.style.display = 'none';

    // Configurer et afficher les graphiques dynamiquement
    Object.entries(groupedFields).forEach(([field, data]) => {
        const canvas = document.getElementById(field);
        if (canvas) {
            canvas.style.display = 'block';
            const ctx = canvas.getContext('2d');

            const chartData = {
                labels: data[1], // Labels (ex : date et heure)
                datasets: [
                    {
                        label: field.charAt(0).toUpperCase() + field.slice(1), // Nom dynamique
                        data: data[0], // Données
                        borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`, // Couleur aléatoire
                        backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.2)`,
                        tension: 0.4, // Courbe lissée par défaut
                    },
                ],
            };

            const chartConfig = {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: `${field}`,
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date et heure',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Valeurs',
                            },
                        },
                    },
                },
            };

            if (canvas.chartInstance) {
                canvas.chartInstance.destroy();
            }

            canvas.chartInstance = new Chart(ctx, chartConfig);
        }
    });

    // Gérer les séparateurs dynamiquement
    const visibleCanvases = Array.from(document.querySelectorAll('canvas')).filter(
        (canvas) => canvas.style.display === 'block'
    );

    visibleCanvases.forEach((canvas, index) => {
        const separator = document.querySelector(`.separator[data-associated-canvas="${canvas.id}"]`);
        if (separator && index < visibleCanvases.length - 1) {
            separator.style.display = 'block';
        }
    });
}

// Fonction utilitaire pour générer des couleurs aléatoires
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}


function downloadChartWithBackground(canvasId, filename = 'chart.png') {
    const originalCanvas = document.getElementById(canvasId);
    if (!originalCanvas) {
        console.error(`Canvas avec l'ID "${canvasId}" introuvable.`);
        return;
    }

    // Créer un canvas temporaire pour ajouter un fond blanc
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;

    // Dessiner un fond blanc
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Dessiner le contenu du graphique par-dessus le fond blanc
    tempCtx.drawImage(originalCanvas, 0, 0);

    // Télécharger l'image
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = filename;
    link.click();
}
