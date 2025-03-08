import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function create_lampes(scene, typeBras, longueur, formeLumiere) {
    const loader = new GLTFLoader();
    const lampGroup = new THREE.Group(); // Groupe principal

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
        case "4":
            support.position.set(0, 8.5, -0.6);
            break;
        case "6":
            support.position.set(0, 10.5, -0.6);
            break;
        case "7":
            support.position.set(0, 11.5, -0.6);
            break;
        case "8":
            support.position.set(0, 12.5, -0.6);
            break;
        default:
            support.position.set(0, 8.5, -0.6);
            break;
    }

    support.rotation.x = -Math.PI / 3;
    support.rotation.y = Math.PI / 9;
    support.castShadow = true;
    
    let bras;
    let modelPath = null;

    switch (typeBras) {
        case "GRIFF_S":
            modelPath = "./models/source/griff.glb";
            break;
        case "GRIFF_XL":
            modelPath = "./models/source/griff.glb";
            break;
        case "TEKK_S":
            modelPath = "./models/source/tekk-s.glb";
            break;
        case "TEKK_M":
            modelPath = "./models/source/tekk-s.glb";
            break;
        case "ATINA":
            modelPath = "./models/source/attina.glb";
            break;
        default:
            return null;
    }

    loader.load(modelPath, (gltf) => {
        if (bras) {
            lampGroup.remove(bras);
        }
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

        switch (longueur) {
            case "4":
                bras.position.set(-0.3, 8.2, -1);
                break;
            case "6":
                bras.position.set(-0.3, 10.2, -1);
                break;
            case "7":
                bras.position.set(-0.3, 11.2, -1);
                break;
            case "8":
                bras.position.set(-0.3, 12.2, -1);
                break;
            default:
                bras.position.set(-0.3, 8.2, -1);
                break;
        }

        lampGroup.add(bras);
    });

    // **Création des lumières selon la forme sélectionnée**
    const rectLight = new THREE.RectAreaLight(0xffffaa, 10, 3, 1);
    const spotLight = new THREE.SpotLight(0xffffaa, 8, 10, Math.PI / 4, 0.5, 2);

    updateLightPosition(rectLight, spotLight, formeLumiere);
    
    lampGroup.add(rectLight);
    lampGroup.add(spotLight);
    lampGroup.add(support);
    lampGroup.position.set(0, 0, 0);
    scene.add(lampGroup);

    RectAreaLightUniformsLib.init();

    function updateLightPosition(rectLight, spotLight, formeLumiere) {
        if (!rectLight || !spotLight) return;

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

            default:
                rectLight.position.set(0, 6, -3);
                rectLight.width = 2;
                rectLight.height = 6;
                rectLight.lookAt(0, 3, -4);
                
                spotLight.position.set(0, 6, -3);
                spotLight.angle = Math.PI / 5;
                spotLight.target.position.set(0, 2, -4);
                break;
        }

        spotLight.target.updateMatrixWorld();
    }

    lampGroup.update = function(densiteLumiere) {
        let intensityFactor = Math.max(0, (0.5 - densiteLumiere) * 2);

        let targetIntensity = Math.max(0.1, intensityFactor);
        const maxIntensity = 2.0;
        let ledIntensity = Math.lerp(ledMaterial.emissiveIntensity, targetIntensity, 0.1);
        ledIntensity = Math.min(ledIntensity, maxIntensity);

        rectLight.intensity = ledIntensity * 8;
        spotLight.intensity = ledIntensity * 5;
    };

    Math.lerp = function(start, end, t) {
        return start + (end - start) * t;
    };

    return { lampe: lampGroup };
}
