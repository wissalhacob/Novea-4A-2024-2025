// Importation des modules nécessaires pour la scène 3D
import * as THREE from 'three'; // Bibliothèque principale de Three.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Loader pour charger les fichiers GLTF/GLB
import { AnimationMixer } from 'three'; // Utilisé pour gérer les animations

// Fonction pour créer et gérer une personne animée qui marche sur la route
export function create_person(scene) {
    const loader = new GLTFLoader(); // Initialisation du GLTFLoader pour charger le modèle
    let modelGroup = null; // Groupe pour regrouper le modèle et l'animation
    let model = null; // Référence au modèle 3D
    let mixer = null; // Animation mixer pour gérer les animations du modèle
    let clock = new THREE.Clock(); // Horloge pour gérer le temps entre les frames
    let animationActive = true; // Contrôle si l'animation est active

    // Chemin du modèle 3D de la personne
    const modelPath = 'models/source/personne.glb';

    // Chargement du modèle
    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene; // Accès à la scène du modèle
            model.position.set(3, 0, -20); // Position initiale de la personne sur la route
            model.scale.set(3, 3, 3); // Mise à l'échelle du modèle

            // Création d'un groupe pour gérer le modèle
            modelGroup = new THREE.Group();
            modelGroup.add(model);
            scene.add(modelGroup); // Ajout du groupe à la scène

            // Initialisation du mixer d'animation pour gérer les clips d'animation
            mixer = new AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]); // Chargement de la première animation
            action.play(); // Lancement de l'animation

            // Fonction pour animer la personne
            function animatePerson() {
                if (animationActive && modelGroup.visible) {
                    const delta = clock.getDelta(); // Temps écoulé depuis la dernière frame
                    mixer.update(delta); // Mise à jour de l'animation

                    // Déplacement du modèle le long de l'axe Z
                    model.position.z += delta * 5; // Vitesse de déplacement ajustable

                    // Réinitialisation de la position si la personne dépasse la fin de la route
                    if (model.position.z > 25) {
                        model.position.z = -20; // Retour au point de départ
                    }
                }
                requestAnimationFrame(animatePerson); // Appel de l'animation à la prochaine frame
            }

            animatePerson(); // Lancement de l'animation de la personne
        },
        undefined,
        (error) => {
            console.error('Error loading the model:', error); // Gestion des erreurs de chargement
        }
    );

    // Gestionnaire de clic pour afficher/masquer la personne
    const toggleButton = document.getElementById('togglePerson');
    toggleButton.addEventListener('click', () => {
        if (modelGroup) {
            if (!modelGroup.visible) {
                // Réinitialiser la position et redémarrer l'animation lors de l'affichage
                model.position.set(3, 0, -20); // Position initiale
                clock = new THREE.Clock(); // Réinitialisation de l'horloge
                animationActive = true; // Reprise de l'animation
            } else {
                // Mise en pause de l'animation lors du masquage
                animationActive = false;
            }
            modelGroup.visible = !modelGroup.visible; // Basculer la visibilité
        }
    });
}

// Fonction pour créer une personne animée qui marche sur le côté de la route
export function create_person_coté(scene) {
    const loader = new GLTFLoader(); // Initialisation du loader
    let modelGroup = null; // Groupe pour le modèle et l'animation
    let model = null; // Référence au modèle
    let mixer = null; // Gestionnaire d'animation
    let clock = new THREE.Clock(); // Horloge pour les mises à jour
    let animationActive = true; // Contrôle si l'animation est active

    // Chemin du modèle 3D de la personne
    const modelPath = 'models/source/personne2.glb';

    // Chargement du modèle
    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene; // Accès au modèle chargé
            model.position.set(10, 0, -20); // Position initiale de la personne
            model.scale.set(1.5, 1.5, 1.5); // Mise à l'échelle

            // Création d'un groupe pour le modèle
            modelGroup = new THREE.Group();
            modelGroup.add(model);
            scene.add(modelGroup); // Ajout du groupe à la scène

            // Initialisation du mixer d'animation
            mixer = new AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]); // Chargement de la première animation
            action.play(); // Lancement de l'animation

            // Fonction pour animer la personne
            function animatePerson() {
                if (animationActive && modelGroup.visible) {
                    const delta = clock.getDelta(); // Temps écoulé depuis la dernière frame
                    mixer.update(delta); // Mise à jour de l'animation

                    // Déplacement le long de l'axe Z
                    model.position.z += delta * 5;

                    // Réinitialisation de la position
                    if (model.position.z > 25) {
                        model.position.z = -20;
                    }
                }
                requestAnimationFrame(animatePerson);
            }

            animatePerson(); // Lancement de l'animation
        },
        undefined,
        (error) => {
            console.error('Error loading the model:', error); // Gestion des erreurs
        }
    );

    // Gestionnaire de clic pour afficher/masquer la personne
    const toggleButton = document.getElementById('togglePerson2');
    toggleButton.addEventListener('click', () => {
        if (modelGroup) {
            if (!modelGroup.visible) {
                model.position.set(10, 0, -20); // Réinitialisation de la position
                clock = new THREE.Clock(); // Réinitialisation de l'horloge
                animationActive = true; // Reprise de l'animation
            } else {
                animationActive = false; // Mise en pause de l'animation
            }
            modelGroup.visible = !modelGroup.visible; // Basculer la visibilité
        }
    });
}
