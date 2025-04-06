import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; 
import { userData } from 'three/tsl';
import { animationActive } from './person.js';
import { animationActiveCar } from './car.js';
function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return -1; 
    let [hours, minutes] = timeStr.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
}
export function create_lampes(scene, typeBras, longueur, formeLumiere) {
    const loader = new GLTFLoader();
    const lampGroup = new THREE.Group(); 

    
    let brasMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.3
    });

    let ledMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffaa,
        emissive: 0x000000,
        emissiveIntensity: 0
    });

    let led;
    const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.3, 7);
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    
    switch (longueur) {
        case "4": support.position.set(0, 8.5, -0.6); break;
        case "6": support.position.set(0, 10.5, -0.6); break;
        case "7": support.position.set(0, 11.5, -0.6); break;
        case "8": support.position.set(0, 12.5, -0.6); break;
        default: support.position.set(0, 8.5, -0.6); break;
    }

    support.rotation.x = -Math.PI / 3;
    support.rotation.y = Math.PI / 9;
    support.castShadow = true;

    let bras;
    let modelPath = null;

    switch (typeBras) {
        case "GRIFF_S":
            modelPath = "./models/source/griff.glb";
            loader.load(modelPath, (gltf) => {
                if (bras) { lampGroup.remove(bras); }
                bras = gltf.scene;
                bras.scale.set(70, 100, 70);
                bras.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
                        child.castShadow = true;
                    }
                });
                bras.rotation.x = Math.PI / 2;
                bras.rotation.z = -Math.PI / 2;
                bras.position.set(-0.3, longueur == "4" ? 8.2 : longueur == "6" ? 10.2 : longueur == "7" ? 11.2 : 12.2, -1);
                lampGroup.add(bras);
            });
            break;

        case "GRIFF_XL":
            modelPath = "./models/source/griff.glb";
            loader.load(modelPath, (gltf) => {
                if (bras) { lampGroup.remove(bras); }
                bras = gltf.scene;
                bras.scale.set(80, 100, 50);
                bras.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
                        child.castShadow = true;
                    }
                });
                bras.rotation.x = Math.PI / 2;
                bras.rotation.z = -Math.PI / 2;
                bras.position.set(-0.3, longueur == "4" ? 8.4 : longueur == "6" ? 10.4 : longueur == "7" ? 11.4 : 12.4, -0.9);
                lampGroup.add(bras);
            });
            break;

        case "TEKK_S":
            modelPath = "./models/source/tekk-s.glb";
            loader.load(modelPath, (gltf) => {
                if (bras) { lampGroup.remove(bras); }
                bras = gltf.scene;
                bras.scale.set(70, 200, 170);
                bras.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
                        child.castShadow = true;
                    }
                });
                bras.rotation.x = Math.PI / 2;
                bras.rotation.z = -Math.PI / 2;
                bras.position.set(-0.3, longueur == "4" ? 9 : longueur == "6" ? 11 : longueur == "7" ? 12 : 13, -1.8);
                lampGroup.add(bras);
            });
            break;

        case "TEKK_M":
            modelPath = "./models/source/tekk-s.glb";
            loader.load(modelPath, (gltf) => {
                if (bras) { lampGroup.remove(bras); }
                bras = gltf.scene;
                bras.scale.set(90, 200, 140);
                bras.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
                        child.castShadow = true;
                    }
                });
                bras.rotation.x = Math.PI / 2;
                bras.rotation.z = -Math.PI / 2;
                bras.position.set(-0.3, longueur == "4" ? 8.9 : longueur == "6" ? 10.9 : longueur == "7" ? 11.9 : 12.9, -1.8);
                lampGroup.add(bras);
            });
            break;

        case "ATINA":
            modelPath = "./models/source/attina.glb";
            loader.load(modelPath, (gltf) => {
                if (bras) { lampGroup.remove(bras); }
                bras = gltf.scene;
                bras.scale.set(40, 50, 50);
                bras.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
                        child.castShadow = true;
                    }
                });
                bras.rotation.x = Math.PI / 2;
                bras.rotation.z = -Math.PI / 2;
                bras.position.set(-0.3, longueur == "4" ? 8.5 : longueur == "6" ? 10.5 : longueur == "7" ? 11.5 : 12.5, -1.8);
                lampGroup.add(bras);
            });
            break;

        default:
            return null;
    }
    let currentTime = "00:00"; 
    let timeDisplayElement = document.getElementById('timeDisplay');
    

    
    let rectLight = new THREE.RectAreaLight(0xffffaa,0,  3, 1);  
    
    let spotLight = new THREE.SpotLight(0xffffaa, 10, 10, Math.PI / 4, 0.5, 2);  
    let startTimeInMinutes = 420; // 07:00
    let endTimeInMinutes = 1140; // 19:00



 

    switch (formeLumiere) {
        case "Devant":
            rectLight.position.set(0, 6, -3);
            rectLight.width = 2;
            rectLight.height = 10;
            rectLight.lookAt(0, 3, -4);

            spotLight.position.set(0, 6, -3);
            spotLight.angle = Math.PI / 5;
            spotLight.target.position.set(0, 2, -4);
            break;

        case "Excentré":
            rectLight.position.set(0, 6, -3);
            rectLight.width = 2;
            rectLight.height = 6;
            rectLight.lookAt(0, 3, -4);

            spotLight.position.set(0, 6, -3);
            spotLight.angle = Math.PI / 5;
            spotLight.target.position.set(0, 2, -4);
            break;

        case "Côté":
                // Lumière côté gauche
                rectLight.position.set(-2, 5, -2);
                rectLight.width = 3;
                rectLight.height = 3;
                rectLight.lookAt(-3, 3, -3);

                spotLight.position.set(-2, 6, -2);
                spotLight.angle = Math.PI / 4;
                spotLight.target.position.set(-3, 3, -3);

                // Lumière côté droit
                const rectLightRight = new THREE.RectAreaLight(0xffffaa, 10, 3, 3);
                rectLightRight.position.set(2, 5, -2);  
                rectLightRight.lookAt(3, 3, -3);       

                const spotLightRight = new THREE.SpotLight(0xffffaa, 10, 10, Math.PI / 4, 0.5, 2);
                spotLightRight.position.set(2, 6, -2);
                spotLightRight.target.position.set(3, 3, -3);

                lampGroup.add(rectLightRight);
                lampGroup.add(spotLightRight);
                break;

        case "Centré":
            rectLight.position.set(0, 5, 0);
            rectLight.width = 4;
            rectLight.height = 4;
            rectLight.lookAt(0, 3, 0);

            spotLight.position.set(0, 6, 0);
            spotLight.angle = Math.PI / 3;
            spotLight.target.position.set(0, 3, 0);
            break;
    }

    
    lampGroup.add(rectLight);
    lampGroup.add(spotLight);
    lampGroup.add(support);
    lampGroup.userData.rectLight = rectLight;
    scene.add(lampGroup);

    return { lampe: lampGroup };
}
