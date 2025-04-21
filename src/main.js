import * as THREE from 'three';
import { createScene } from './scene'; 
import { createRoad } from './rue';
import { create_person } from './person';
import { create_car } from './car';

function main() {
    // Initialisation de la scène
    const { scene, camera, renderer } = createScene();

    // Création des éléments de la rue avec leurs animations
    const { 
        mixers, 
        updateCatAnimations, 
        updateLadyAnimation, 
        updateLady2Animation,
        updateBoyAnimation,
        updateTreeAnimations,updateFlamingoAnimations
    } = createRoad(scene);

    // Ajout des éléments supplémentaires
    create_person(scene);
    create_car(scene);

    // Configuration de la lumière ambiante
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Gestion du redimensionnement
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Boucle d'animation
    const clock = new THREE.Clock();
    
    function animate() {
        const delta = clock.getDelta();

        // Mise à jour de toutes les animations
        try {
            // Animations des mixers (pour les modèles GLTF animés)
            if (mixers && Array.isArray(mixers)) {
                mixers.forEach(mixer => {
                    if (mixer && typeof mixer.update === 'function') {
                        mixer.update(delta);
                    }
                });
            }

            // Animations spécifiques
            if (typeof updateCatAnimations === 'function') {
                updateCatAnimations(delta);
            }

            if (typeof updateLadyAnimation === 'function') {
                updateLadyAnimation(delta);
            }

            if (typeof updateLady2Animation === 'function') {
                updateLady2Animation(delta);
            }

            if (typeof updateBoyAnimation === 'function') {
                updateBoyAnimation(delta);
            }

            if (typeof updateTreeAnimations === 'function') {
                updateTreeAnimations(delta);
            }
            if (updateFlamingoAnimations) {
                updateFlamingoAnimations(delta);
            }
            // Rendu de la scène
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
            
        } catch (error) {
            console.error("Error in animation loop:", error);
        }
    }

    // Démarrer l'animation
    animate();

    // Gestion des erreurs de chargement
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });
}

// Démarrer l'application
main();