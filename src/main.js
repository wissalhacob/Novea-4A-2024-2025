// Importation des fonctions nécessaires
import * as THREE from 'three';
import { createScene } from './scene'; 
import { createRoad } from './rue';

import { create_person} from './person';
import { create_car } from './car';
// Fonction principale qui initialise la scène
function main() {
    const { scene, camera, renderer } = createScene();
    
    createRoad(scene);
    create_person(scene);
    create_car(scene);
    document.getElementById("startCycle").addEventListener("click", function () {
      params.autoCycle = !params.autoCycle;
  });

    // Fonction d'animation en boucle
    function animate() {
        spotLight.lookAt(2, 3, 0);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // Supposons que chaque lampadaire dans le brasGroup est un lampadaire individuel
    brasGroup.forEach(lampadaire => {
    // Récupère les objets liés au lampadaire, comme la lumière (rectLight), le matériau de la LED, etc.
    const spotLight = lampadaire.getObjectByName('spotLight');  // Exemple d'accès à la lumière
    const ledMaterial = lampadaire.getObjectByName('ledMaterial');  // Exemple d'accès au matériau LED
    const brasMaterial = lampadaire.getObjectByName('brasMaterial');  // Matériau du bras
    const heure = params.heure; // Récupère l'heure à partir de l'interface GUI

    // Initialiser le détecteur de présence pour ce lampadaire
    ajouterDetecteurPresence(lampadaire, spotLight, ledMaterial, brasMaterial, getSunAngle, heure);
});

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

            // Mettre à jour les détecteurs de présence
            brasGroup.forEach(lampadaire => {
                lampadaire.update();  // Appeler la méthode de mise à jour de chaque lampadaire
        });
        }
        requestAnimationFrame(animateCycle);
    }
    

    // Démarrer l'animation
    animate();
}

// Exécuter l'application
main();