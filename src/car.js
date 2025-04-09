import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Chargement du module pour importer des modèles GLTF

// Fonction pour créer une voiture animée dans la scène
export let animationActiveCar= false;
export let positionZCar=null;
function showSpinner() {
    const spinner = document.getElementById('spinner-overlay');
    spinner.style.display = 'flex';
    spinner.classList.remove('hidden');
  }
  
  function hideSpinner() {
    const spinner = document.getElementById('spinner-overlay');
    if (spinner) {
        spinner.classList.add('hidden');
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 300); // Correspond à la durée de la transition
    }
}
export function create_car(scene) {
    showSpinner();
    const loader = new GLTFLoader(); // Création du chargeur GLTF
    let modelGroup = null; // Groupe pour gérer la voiture
    let model = null; // Référence au modèle de voiture
    let clock = new THREE.Clock(); // Horloge pour suivre le temps écoulé entre les frames
     // Contrôle si l'animation est active ou non

    // Chemin vers le fichier GLTF de la voiture
    const modelPath = 'models/source/ferrari.glb';
    
    // Chargement du modèle GLTF
    loader.load(
        modelPath,
        (gltf) => {
            try {
            model = gltf.scene; // Chargement du modèle 3D
            model.position.set(-2, 0, 25); // Position de départ au début du parcours (plus loin sur l'axe Z)
            model.scale.set(2, 2, 2); // Ajustement de l'échelle du modèle

            // Création d'un groupe pour faciliter la gestion
            modelGroup = new THREE.Group();
            modelGroup.add(model); // Ajout du modèle dans le groupe
            scene.add(modelGroup); // Ajout du groupe à la scène
            // Initialement, rendre le modèle invisible
            modelGroup.visible = false;
            // Fonction pour animer la voiture
            function animateCar() {
                if (animationActiveCar && modelGroup.visible) { // Vérifie si l'animation est active et visible
                    const delta = clock.getDelta(); // Temps écoulé depuis la dernière frame

                    // Déplacement de la voiture sur l'axe Z dans le sens inverse
                    model.position.z -= delta * 5; // La voiture se déplace vers le début du parcours

                    // Réinitialisation de la position à la fin du parcours
                    if (model.position.z < -20) { // Lorsque la voiture atteint la fin du parcours
                        model.position.z = 25; // Réinitialisation au début du parcours (plus loin sur Z)
                    }
                    positionZCar=model.position.z;
                    console.log(positionZCar);
                }
                requestAnimationFrame(animateCar); // Boucle d'animation
            }

        
            animateCar(); // Démarrage de l'animation
        } catch (error) {
            console.error('Error processing model:', error);
        } finally {
            hideSpinner();
        }
        },
        undefined,
        (error) => {
            console.error('Error loading the model:', error); // Gestion des erreurs de chargement
            hideSpinner();
        }
    );

    // Gestion du bouton pour afficher/masquer la voiture
    const toggleButton = document.getElementById('toggleCar'); // Bouton pour contrôler l'affichage
    toggleButton.addEventListener('click', () => {
        showSpinner();
                setTimeout(() => {
        if (modelGroup) {
            if (!modelGroup.visible) { // Si la voiture est cachée
                model.position.set(-2, 0, 25); // Réinitialisation de la position (plus loin sur l'axe Z)
                clock = new THREE.Clock(); // Réinitialisation de l'horloge
                animationActiveCar = true; // Relance de l'animation
            } else { // Si la voiture est visible
                animationActiveCar = false; // Arrêt de l'animation
            }
            modelGroup.visible = !modelGroup.visible; // Inversion de la visibilité
        }
        hideSpinner();
                }, 50);
    });


}
