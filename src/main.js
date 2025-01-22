import { createScene } from './scene';
import { createRoad } from './rue'; // Importer la fonction createRoad
import { create_lumiere_ui } from './lumiere_settings';

import {create_person} from './person';
import {create_person_coté} from './person';
import {create_car} from './car';
// Fonction principale qui initie et gère le rendu de la scène.
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

  create_person(scene)
  create_person_coté(scene)
  create_car(scene)
  // Fonction d'animation appelée en boucle pour rendre la scène en continu.
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate(); // Démarre l'animation
}

main();
