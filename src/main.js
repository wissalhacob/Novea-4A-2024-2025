// Importation des fonctions nécessaires
import * as THREE from 'three';
import { createScene } from './scene'; 
import { createRoad } from './rue';
import { create_lumiere_ui } from './lumiere_settings';
import { create_sky_with_clouds } from './sky';
import { create_person, create_person_coté } from './person';
import { create_car } from './car';



// Fonction principale qui initialise la scène
function main() {
    const { scene, camera, renderer } = createScene();
    createRoad(scene);
    create_lumiere_ui(scene)
    create_sky_with_clouds(scene); // Ajoute la gestion du Soleil et de la Lune
    create_person(scene);
    create_car(scene);
    document.getElementById("startCycle").addEventListener("click", function () {
      params.autoCycle = !params.autoCycle;
  });

    // Fonction d'animation en boucle
    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    function animateCycle() {
        if (params.autoCycle) {
            params.heure += params.vitesseCycle;
            if (params.heure >= 24) params.heure = 0;
            updateLights();
            updateLampPostLights(((params.heure - 6) / 24) * Math.PI * 2, params.heure);
        }
        requestAnimationFrame(animateCycle);
    }
    

    // Démarrer l'animation
    animate();
}

// Exécuter l'application
main();