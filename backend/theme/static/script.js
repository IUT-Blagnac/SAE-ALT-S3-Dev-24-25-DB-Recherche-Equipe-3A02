var salleSelect = null;
var typeSelect = [];
var datedeDebut = null;
var datedeFin = null;

// ecoute des clics
document.addEventListener("DOMContentLoaded", function () {
    // Écouter les clics sur les salles
    document.querySelectorAll("input[name='filter1[]']").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const salleValue = event.target.value;
        const isChecked = event.target.checked;
        salleSelect = salleValue;
        effectuerRequete();
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

conversion = {
    "température" : "temperature",
    "humidité" : "humidity",
    "contact" : "contact"
}
// 
// function effectuerRequete() {
//     if (salleSelect && typeSelect) {
//         console.log("requete possible");
//         var constructrequete = "http://localhost:8000/api/sensors/"+salleSelect;
//         if (typeSelect.length != 0 || datedeDebut || datedeFin) {
//             constructrequete += "?"
//         }
//         typeSelect.forEach(function(element) {
//             debut = "";
//             if (constructrequete[constructrequete.length - 1] != "?") {
//                 debut = "&";
//             }
//             constructrequete += debut+"field="+conversion[element];
//         });    
//         if (datedeDebut) {
//             debut = "";
//             if (constructrequete[constructrequete.length - 1] != "?") {
//                 debut = "&";
//             }
//             constructrequete += debut+"start_time="+datedeDebut;
//         }
//         if (datedeFin) {
//             debut = "";
//             if (constructrequete[constructrequete.length - 1] != "?") {
//                 debut = "&";
//             }
//             constructrequete += debut+"&end_time="+datedeFin;
//         }
//         console.log(constructrequete);


    
    
//     } 
// }

function effectuerRequete() {
    if (salleSelect && typeSelect) {
        console.log("Requête possible");
        let constructrequete = `http://localhost:8000/api/sensors/${salleSelect}`;
        const params = [];

        // Ajouter les champs sélectionnés
        typeSelect.forEach((element) => {
            params.push(`field=${conversion[element]}`);
        });

        // Ajouter les dates si présentes
        if (datedeDebut) {
            params.push(`start_time=${datedeDebut}`);
        }
        if (datedeFin) {
            params.push(`end_time=${datedeFin}`);
        }

        // Ajouter les paramètres à l'URL
        if (params.length > 0) {
            constructrequete += `?${params.join("&")}`;
        }

        console.log(constructrequete);

        // Effectuer la requête
        fetch(constructrequete)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Transformer la réponse en JSON
            })
            .then((data) => {
                console.log("Données reçues :", data);

                // Récupérer la clé dynamique (par exemple, C104)
                const key = Object.keys(data)[0];
                const sensors = key && data[key]?.sensors ? data[key].sensors : [];

                // Regrouper les valeurs et dates en format français par champ
                const groupedFields = sensors.reduce((acc, sensor) => {
                    const { field, value, timestamp } = sensor;
                
                    // Initialiser les listes doubles si elles n'existent pas
                    if (!acc[field]) {
                        acc[field] = [[], []]; // [valeurs, dates françaises]
                    }
                
                    // Convertir le timestamp en format français
                    const dateLocale = new Date(timestamp).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    });
                
                    // Ajouter la valeur transformée et la date formatée
                    acc[field][0].push(field === "contact" ? (value ? 1 : 0) : value); // 1 pour true, 0 pour false
                    acc[field][1].push(dateLocale); // Liste des dates formatées
                
                    return acc;
                }, {});
                

                console.log("Champs regroupés :", groupedFields);

                // Mettre à jour le graphique avec les données regroupées
                updateChart(groupedFields);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des données :", error);
                updateChart({}); // Appeler avec un objet vide pour afficher le message d'erreur
            });
    }
}


function updateChart(groupedFields) {
    const canvas = document.getElementById('myLineChart');
    const message = document.getElementById('noDataMessage');

    if (Object.keys(groupedFields).length === 0) {
        // Aucun résultat : afficher le message et cacher le graphique
        canvas.style.display = "none";
        message.style.display = "block";
        return;
    }

    // Si des données sont disponibles : afficher le graphique et cacher le message
    canvas.style.display = "block";
    message.style.display = "none";

    // Réinitialiser les datasets et labels du graphique existant
    myLineChart.data.labels = []; // Réinitialiser les labels

    myLineChart.data.datasets = Object.keys(groupedFields).map((field) => {
        // Détecter si le champ est "contact" pour appliquer un style spécifique
        if (field === "contact") {
            return {
                label: "Contact (1 = Fermé, 0 = Ouvert)",
                data: groupedFields[field][0], // 1 ou 0
                borderColor: "rgba(255, 0, 0, 1)", // Rouge pour distinction
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                tension: 0, // Ligne droite
                stepped: true, // Indiquer des changements d'état par des segments
            };
        }

        return {
            label: field.charAt(0).toUpperCase() + field.slice(1), // Nom du champ (capitalisé)
            data: groupedFields[field][0], // Les valeurs (ex: temperature)
            borderColor: getRandomColor(), // Couleur de ligne unique
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Couleur d'arrière-plan
            tension: 0.4, // Courbe lissée
        };
    });

    // Ajouter les labels (dates formatées en français)
    myLineChart.data.labels = groupedFields[Object.keys(groupedFields)[0]][1];

    // Mettre à jour le graphique
    myLineChart.update();
}

// Fonction utilitaire pour générer des couleurs aléatoires
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}


// graphique
const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4, // Ajoute une courbe aux lignes
    }]
  };

const config = {
type: 'line',
data: data,
options: {
    responsive: true, // Rendre le graphique responsive
    plugins: {
    legend: {
        position: 'top', // Position de la légende
    },
    title: {
        display: true,
        text: 'Chart.js Line Chart' // Titre du graphique
    }
    },
    scales: {
    x: {
        title: {
        display: true,
        text: 'Date et heure'
        }
    },
    y: {
        title: {
        display: true,
        text: 'Valeurs'
        }
    }
    }
}
};

const ctx = document.getElementById('myLineChart').getContext('2d');
const myLineChart = new Chart(ctx, config);
