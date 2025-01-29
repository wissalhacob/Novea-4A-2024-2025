import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function create_person(scene) {
    const loader = new GLTFLoader();
    let modelGroup = null;
    let model = null;
    let clock = new THREE.Clock();
    let animationActive = true;
    let step = 0; // Variable pour simuler le mouvement des jambes

    let leftLeg, rightLeg, leftKnee, rightKnee, leftArm, rightArm;

    const modelPath = 'models/source/personne2.glb';

    loader.load(
        modelPath,
        (gltf) => {
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
                }
                requestAnimationFrame(animatePerson);
            }

            animatePerson();
        },
        undefined,
        (error) => {
            console.error('Error loading the model:', error);
        }
    );

    // Gestion affichage/masquage via la case à cocher
    const toggleCheckbox = document.getElementById('togglePerson');
    toggleCheckbox.addEventListener('change', () => {
        if (modelGroup) {
            if (toggleCheckbox.checked) {
                model.position.set(3, 0, -20);
                clock = new THREE.Clock();
                animationActive = true;
            } else {
                animationActive = false;
            }
            modelGroup.visible = toggleCheckbox.checked;
        }
    });
}
