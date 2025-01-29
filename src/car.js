import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Chargement du module pour importer des modèles GLTF

// Fonction pour créer une voiture animée dans la scène
export function create_car(scene) {
    const loader = new GLTFLoader(); // Création du chargeur GLTF
    let modelGroup = null; // Groupe pour gérer la voiture
    let model = null; // Référence au modèle de voiture
    let clock = new THREE.Clock(); // Horloge pour suivre le temps écoulé entre les frames
    let animationActive = true; // Contrôle si l'animation est active ou non

    // Chemin vers le fichier GLTF de la voiture
    const modelPath = 'models/source/ferrari.glb';

    // Chargement du modèle GLTF
    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene; // Chargement du modèle 3D
            model.position.set(-2, 0, 25); // Position de départ au début du parcours (plus loin sur l'axe Z)
            model.scale.set(2, 2, 2); // Ajustement de l'échelle du modèle

            // Création d'un groupe pour faciliter la gestion
            modelGroup = new THREE.Group();
            modelGroup.add(model); // Ajout du modèle dans le groupe
            scene.add(modelGroup); // Ajout du groupe à la scène

            // Fonction pour animer la voiture
            function animateCar() {
                if (animationActive && modelGroup.visible) { // Vérifie si l'animation est active et visible
                    const delta = clock.getDelta(); // Temps écoulé depuis la dernière frame

                    // Déplacement de la voiture sur l'axe Z dans le sens inverse
                    model.position.z -= delta * 5; // La voiture se déplace vers le début du parcours

                    // Réinitialisation de la position à la fin du parcours
                    if (model.position.z < -20) { // Lorsque la voiture atteint la fin du parcours
                        model.position.z = 25; // Réinitialisation au début du parcours (plus loin sur Z)
                    }
                }
                requestAnimationFrame(animateCar); // Boucle d'animation
            }

            animateCar(); // Démarrage de l'animation
        },
        undefined,
        (error) => {
            console.error('Error loading the model:', error); // Gestion des erreurs de chargement
        }
    );

    // Gestion du bouton pour afficher/masquer la voiture
    const toggleButton = document.getElementById('toggleCar'); // Bouton pour contrôler l'affichage
    toggleButton.addEventListener('click', () => {
        if (modelGroup) {
            if (!modelGroup.visible) { // Si la voiture est cachée
                model.position.set(-2, 0, 25); // Réinitialisation de la position (plus loin sur l'axe Z)
                clock = new THREE.Clock(); // Réinitialisation de l'horloge
                animationActive = true; // Relance de l'animation
            } else { // Si la voiture est visible
                animationActive = false; // Arrêt de l'animation
            }
            modelGroup.visible = !modelGroup.visible; // Inversion de la visibilité
        }
    });
}
