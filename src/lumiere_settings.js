import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

// Function to add lights and controls to the scene
export function create_lumiere_ui(scene) {
    const gui = new dat.GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '0';
    gui.domElement.style.right = '0';
    gui.domElement.style.zIndex = 15;  // Assurez-vous que le z-index est bien appliqué
    document.body.appendChild(gui.domElement);
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const ambientLightFolder = gui.addFolder('Ambient Light');
    ambientLightFolder.add(ambientLight, 'intensity', 0, 1).name('Intensity');
    ambientLightFolder.addColor(ambientLight, 'color').name('Color');

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLightFolder = gui.addFolder('Directional Light');
    directionalLightFolder.add(directionalLight, 'intensity', 0, 2).name('Intensity');
    directionalLightFolder.add(directionalLight.position, 'x', -50, 50).name('Position X');
    directionalLightFolder.add(directionalLight.position, 'y', 0, 50).name('Position Y');
    directionalLightFolder.add(directionalLight.position, 'z', -50, 50).name('Position Z');
    directionalLightFolder.addColor(directionalLight, 'color').name('Color');

    // Point Light
    const pointLight = new THREE.PointLight(0xff0000, 1, 50);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const pointLightFolder = gui.addFolder('Point Light');
    pointLightFolder.add(pointLight.position, 'x', -50, 50).name('Position X');
    pointLightFolder.add(pointLight.position, 'y', 0, 50).name('Position Y');
    pointLightFolder.add(pointLight.position, 'z', -50, 50).name('Position Z');
    pointLightFolder.add(pointLight, 'intensity', 0, 2).name('Intensity');
    pointLightFolder.addColor(pointLight, 'color').name('Color');

    // Spot Light
    const spotLight = new THREE.SpotLight(0xffaa00, 1, 100, Math.PI / 6);
    spotLight.position.set(10, 15, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const spotLightFolder = gui.addFolder('Spot Light');
    spotLightFolder.add(spotLight.position, 'x', -50, 50).name('Position X');
    spotLightFolder.add(spotLight.position, 'y', 0, 50).name('Position Y');
    spotLightFolder.add(spotLight.position, 'z', -50, 50).name('Position Z');
    spotLightFolder.add(spotLight, 'intensity', 0, 2).name('Intensity');
    spotLightFolder.add(spotLight, 'angle', 0, Math.PI).name('Angle');
    spotLightFolder.addColor(spotLight, 'color').name('Color');
}

