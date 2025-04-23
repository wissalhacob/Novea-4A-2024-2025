import * as THREE from 'three';
import { createScene } from './scene'; 
import { createRoad } from './rue';

import { create_person} from './person';
import { create_car } from './car';
// Fonction principale qui initialise la scène
function main() {
    const { scene, camera, renderer } = createScene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    createRoad(scene);
    create_person(scene);
    create_car(scene);

    const { 
        mixers, 
        updateCatAnimations, 
        updateLadyAnimation, 
        updateLady2Animation,
        updateBoyAnimation,
        updateTreeAnimations
    } = createRoad(scene);

    const clock = new THREE.Clock();
    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Mise à jour de toutes les animations
        try {
            // // Animations des mixers (pour les modèles GLTF animés)
            // if (mixers && Array.isArray(mixers)) {
            //     mixers.forEach(mixer => {
            //         if (mixer && typeof mixer.update === 'function') {
            //             mixer.update(delta);
            //         }
            //     });
            // }

            // // Animations spécifiques
            // if (typeof updateCatAnimations === 'function') {
            //     updateCatAnimations(delta);
            // }

            // if (typeof updateLadyAnimation === 'function') {
            //     updateLadyAnimation(delta);
            // }

            // if (typeof updateLady2Animation === 'function') {
            //     updateLady2Animation(delta);
            // }

            // if (typeof updateBoyAnimation === 'function') {
            //     updateBoyAnimation(delta);
            // }

            // if (typeof updateTreeAnimations === 'function') {
            //     updateTreeAnimations(delta);
            // }
          
            // renderer.render(scene, camera);
            // requestAnimationFrame(animate);
            
        } catch (error) {
            console.error("Error in animation loop:", error);
        }


    }


    animate();
}    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

   
<<<<<<< HEAD
=======

// Exécuter l'application
>>>>>>> 616841cf5fec9086d5c6d119f43f0aaaf13343b5
main();