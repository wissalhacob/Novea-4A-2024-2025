import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export let animationActive = false;
export let positionZ =null;
export let positionX = null;
export let positionY = null;
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
        }, 300); 
    }
}
export function create_person(scene) {
    showSpinner();
    const loader = new GLTFLoader();
    let modelGroup = null;
    let model = null;
    let clock = new THREE.Clock();
    let step = 0; // Variable pour simuler le mouvement des jambes

    let leftLeg, rightLeg, leftKnee, rightKnee, leftArm, rightArm;

    const modelPath = '/models/source/personne2.glb';

    loader.load(
        modelPath,
        (gltf) => {
            try {
            model = gltf.scene;
            model.position.set(3, 0, -20);
            model.scale.set(1.5, 1.5, 1.5);

            modelGroup = new THREE.Group();
            modelGroup.add(model);
            scene.add(modelGroup);

            // Initialement, rendre le modèle invisible
            modelGroup.visible = false;

            // Vérifier si le modèle contient un squelette
            model.traverse((child) => {
                if (child.isSkinnedMesh && child.skeleton) {
                    const skeleton = child.skeleton;

                    // Récupérer les os des bras
                    leftArm = skeleton.bones.find((bone) => bone.name.includes("LeftArm"));
                    rightArm = skeleton.bones.find((bone) => bone.name.includes("RightArm"));

                    if (leftArm) leftArm.rotation.x = Math.PI / 2;
                    if (rightArm) rightArm.rotation.x = Math.PI / 2;

                    // Récupérer les os des jambes
                    leftLeg = skeleton.bones.find((bone) => bone.name.includes("LeftLeg"));
                    rightLeg = skeleton.bones.find((bone) => bone.name.includes("RightLeg"));
                    leftKnee = skeleton.bones.find((bone) => bone.name.includes("LeftKnee"));
                    rightKnee = skeleton.bones.find((bone) => bone.name.includes("RightKnee"));
                }
            });

            function animatePerson() {
                if (animationActive && modelGroup.visible) {
                    const delta = clock.getDelta();

                    // Déplacement en Z
                    model.position.z += delta * 5;

                    // Simulation du mouvement des jambes
                    step += delta * 5;
                    const legRotation = Math.sin(step) * 0.3; // Rotation plus naturelle
                    const kneeRotation = Math.sin(step) * 0.3; // Flexion plus légère

                    if (leftLeg && rightLeg) {
                        leftLeg.rotation.x = legRotation;
                        rightLeg.rotation.x = -legRotation;
                    }
                    if (leftKnee && rightKnee) {
                        leftKnee.rotation.x = kneeRotation;
                        rightKnee.rotation.x = -kneeRotation;
                    }

                    // Réinitialisation du parcours
                    if (model.position.z > 25) {
                        model.position.z = -20;
                    }
                    positionZ=model.position.z;
                    positionX = model.position.x;
                    positionY = model.position.y;
                    

                }
                requestAnimationFrame(animatePerson);
            }

            animatePerson();
             // Activer les ombres pour les meshes de la personne
             model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true; // Le modèle va lancer des ombres
                    child.receiveShadow = true; // Le modèle va recevoir des ombres
                }
            });
        } catch (error) {
            console.error('Error processing model:', error);
        } finally {
            hideSpinner();
        }
        },
        undefined,
        (error) => {
            console.error('Error loading the model:', error);
            hideSpinner();
        }
    );

    // Gestion affichage/masquage via la case à cocher
    const toggleCheckbox = document.getElementById('togglePerson');
    if (toggleCheckbox) {
        toggleCheckbox.addEventListener('change', () => {
            showSpinner();
            setTimeout(() => {
                if (modelGroup) {
                    modelGroup.visible = toggleCheckbox.checked;
                    animationActive = toggleCheckbox.checked;
                    if (toggleCheckbox.checked) {
                        model.position.set(3, 0, -20);
                        clock = new THREE.Clock();
                    }
                }
                hideSpinner();
            }, 50);
        });
    }
}
