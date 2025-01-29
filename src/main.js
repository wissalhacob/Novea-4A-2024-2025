// Importation des fonctions nécessaires
import * as THREE from 'three';
import { createScene } from './scene'; 
import { createRoad } from './rue';
import { create_lumiere_ui } from './lumiere_settings';
import { create_person, create_person_coté } from './person';
import { create_car } from './car';

// Fonction principale qui initialise la scène
function main() {
    const { scene, camera, renderer } = createScene();
    
    createRoad(scene);
    create_lumiere_ui(scene);
    create_person(scene);
    create_person_coté(scene);
    create_car(scene);


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

    // Démarrer l'animation
    animate();
}

// Exécuter l'application
main();