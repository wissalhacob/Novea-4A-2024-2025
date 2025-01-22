import { createScene } from './scene';
import { createRoad } from './rue'; // Importer la fonction createRoad
import { create_lumiere_ui } from './lumiere_settings';

function main() {
  const { scene, camera, renderer } = createScene();

  // Créer la route et ajouter les lampadaires
  const { updateSolarPanelInclinaison, leds } = createRoad(scene);

  create_lumiere_ui(scene);

  // Interface utilisateur pour l'inclinaison du panneau solaire
  const inclinaisonSelect = document.getElementById('inclinaison');
  inclinaisonSelect.addEventListener('change', (event) => {
    const angle = parseInt(event.target.value); // Récupère l'inclinaison sélectionnée
    updateSolarPanelInclinaison(angle); // Met à jour l'inclinaison du panneau solaire
  });

  // Interface utilisateur pour l'intensité de la LED
  const intensityControl = document.getElementById('intensityControl');
  intensityControl.addEventListener('input', (event) => {
    const intensity = event.target.value; // Récupère la valeur du curseur (0-10)
    
    // Modifier l'intensité de la LED en ajustant la propriété emissive
    leds.forEach(led => {
      led.material.emissive = new THREE.Color(intensity / 10, intensity / 10, 0); // Couleur de la LED qui brille en fonction de l'intensité
    });
  });

  // Fonction d'animation
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate(); // Démarre l'animation
}

main();
