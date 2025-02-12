import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; 

export function create_lampes(scene, typeBras) {
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
    support.position.set(0, 6.5, -0.6);
    support.rotation.x = -Math.PI / 3;
    support.rotation.y = Math.PI / 9;
    support.castShadow = true;
    let bras;
    // Charger le modèle GLTF (lampe)
    function loadModel(modelPath) {
        console.log(modelPath)
        loader.load(modelPath, (gltf) => {
            if (bras) {
                lampGroup.remove(bras); // Supprimer l'ancien modèle
            }
            bras = gltf.scene; // Charger le modèle 3D
            bras.scale.set(100, 200, 170); // Ajuster l'échelle du modèle

            // Appliquer la couleur gris clair au modèle 3D
            bras.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 }); // Gris clair
                    child.castShadow = true; // Activer les ombres
                }
            });

            // Corriger l'orientation du modèle pour qu'il soit sur sa base
            bras.rotation.x = Math.PI / 2; // Rotation pour l'aligner correctement
            bras.rotation.z= -Math.PI / 2;
            // Positionner la lampe sur le support
            bras.position.set(-0.5, 6.8, -1.3); // Ajuster cette position si nécessaire

            lampGroup.add(bras); // Ajouter la lampe au groupe
        },
    );
}
    let brasPath = null;

    switch (typeBras) {
        case "GRIFF":
            
        case "TEKK":
            brasPath = "./models/source/tekk-s.glb";
            loadModel(brasPath);
            break;
        case "ATINA":
            brasPath = "./models/source/attina.glb";
            loadModel(brasPath);
            break;
        default:
            return null;
    }



    

    // Création de la lumière rectangulaire
    const spotLight = new THREE.RectAreaLight(0xffffaa, 0, 3.5, 0.7);
    spotLight.position.set(2, 4, 0);
    spotLight.lookAt(2, 3, 0);
    lampGroup.add(spotLight);

    // Ajout du support et du groupe principal à la scène
    lampGroup.add(support);
    lampGroup.position.set(0, 0, 0);
    scene.add(lampGroup);

    RectAreaLightUniformsLib.init();

    // Mise à jour de l'intensité de la lumière
    lampGroup.update = function(densiteLumiere) {
        let ledActive = densiteLumiere < 1;
        let intensityFactor = Math.max(0, (0.5 - densiteLumiere) * 2);

        let targetIntensity = Math.max(0.1, intensityFactor);
        const maxIntensity = 2.0;
        let ledIntensity = Math.lerp(ledMaterial.emissiveIntensity, targetIntensity, 0.1);
        ledIntensity = Math.min(ledIntensity, maxIntensity);

        if (ledActive) {
            updateMaterialsForActiveLED(ledIntensity);
        } else {
            updateMaterialsForInactiveLED();
        }
    };

    // Helper function for updating materials when LED is active
    function updateMaterialsForActiveLED(ledIntensity) {
        ledMaterial.emissive.set(0xffff55); 
        ledMaterial.emissiveIntensity = ledIntensity * 1.8;
        brasMaterial.color.set(0xffffaa);
        spotLight.intensity = ledIntensity * 5;
    }

    // Helper function for updating materials when LED is inactive
    function updateMaterialsForInactiveLED() {
        ledMaterial.emissive.set(0x000000);
        ledMaterial.emissiveIntensity = 0;
        brasMaterial.color.set(0xffffff);
        spotLight.intensity = 0;
    }

    // Ajout de la méthode lerp si elle n'existe pas dans votre environnement
    Math.lerp = function(start, end, t) {
        return start + (end - start) * t;
    };

    return { lampe: lampGroup };
}
