import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';

export function create_person(scene) {
    const loader = new GLTFLoader();
    let modelGroup = null; // Group to hold the person and animation
    let model = null; // Reference to the person model
    let mixer = null; // Animation mixer reference
    let clock = new THREE.Clock(); // Clock for animation updates
    let animationActive = true; // Controls whether animation is active

    // Path to the person model
    const modelPath = 'models/source/personne.glb';

    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene;
            model.position.set(3, 0, -20); // Start position of the person
            model.scale.set(3, 3, 3); // Adjust scale if needed

            // Create a group to manage the model
            modelGroup = new THREE.Group();
            modelGroup.add(model);
            scene.add(modelGroup);

            // Create the animation mixer
            mixer = new AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]); // Load the first animation
            action.play();

            // Animation and movement function
            function animatePerson() {
                if (animationActive && modelGroup.visible) {
                    const delta = clock.getDelta(); // Time elapsed since the last frame
                    mixer.update(delta); // Update the walking animation

                    // Move the person along the Z axis
                    model.position.z += delta * 5; // Adjust speed as needed

                    // Reset position when reaching the end of the road
                    if (model.position.z > 25) {
                        model.position.z = -20; // Reset to the start of the road
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

    // Handle the toggle button to show/hide the person
    const toggleButton = document.getElementById('togglePerson');
    toggleButton.addEventListener('click', () => {
        if (modelGroup) {
            if (!modelGroup.visible) {
                // Reset position and resume animation when showing the person
                model.position.set(3, 0, -20); // Reset to start position
                clock = new THREE.Clock(); // Reset the clock to avoid skipped time
                animationActive = true; // Resume animation
            } else {
                // Pause the animation when hiding the person
                animationActive = false;
            }
            modelGroup.visible = !modelGroup.visible; // Toggle visibility
        }
    });
}
