import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; 


export function create_lampes(scene, typeBras, longueur, formeLumiere) {
    const loader = new GLTFLoader();
    const lampGroup = new THREE.Group(); 

    const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.3, 7);
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    lampGroup.userData.arrows = []; 
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
    const showVectors = document.getElementById('showVectors').checked;
    const yPos = longueur == "4" ? 9 : longueur == "6" ? 11 : longueur == "7" ? 12: 13;

    // Création initiale des vecteurs si la checkbox est cochée
    if (showVectors) {
        createLightVectors(new THREE.Vector3(0, yPos, -2), 2, 4);
    }

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

let rectLight = new THREE.RectAreaLight(0xffffaa, 0, 3, 1);  
let spotLight = new THREE.SpotLight(0xffffaa, 10, 10, Math.PI / 4, 0.5, 2);


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
                rectLight.position.set(-2, 5, -2);
                rectLight.width = 3;
                rectLight.height = 3;
                rectLight.lookAt(-3, 3, -3);

                spotLight.position.set(-2, 6, -2);
                spotLight.angle = Math.PI / 4;
                spotLight.target.position.set(-3, 3, -3);

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


    function createLightVectors(center, width, height, count = 8) {
        // Nettoyer les anciennes flèches
        if (lampGroup.userData.arrows) {
            lampGroup.userData.arrows.forEach(arrow => {
                lampGroup.remove(arrow);
            });
            lampGroup.userData.arrows = [];
        }

        const arrows = [];
        const yOffset = -3;

    
        // Calcul des directions en fonction de la forme de lumière
        switch (formeLumiere) {
            case "Devant":
                // Forme semi-rectangulaire (rectangle aux bords arrondis)
                for (let i = 0; i < count; i++) {
                    // Répartition le long d'un rectangle arrondi
                    const ratio = i / (count - 1);
                    let x, z;
                    
                    if (ratio < 0.25) {
                        // Côté haut (progressif de gauche à droite)
                        x = center.x - width * 0.5 + (ratio / 0.25) * width;
                        z = center.z - height;
                    } else if (ratio < 0.5) {
                        // Côté droit (progressif de haut en bas)
                        x = center.x + width * 0.5;
                        z = center.z - height + ((ratio - 0.25) / 0.25) * height * 2;
                    } else if (ratio < 0.75) {
                        // Côté bas (progressif de droite à gauche)
                        x = center.x + width * 0.5 - ((ratio - 0.5) / 0.25) * width;
                        z = center.z + height;
                    } else {
                        // Côté gauche (progressif de bas en haut)
                        x = center.x - width * 0.5;
                        z = center.z + height - ((ratio - 0.75) / 0.25) * height * 2;
                    }
            
                    const toPoint = new THREE.Vector3(x, center.y - 3, z);
                    const direction = new THREE.Vector3().subVectors(toPoint, center).normalize();
                    const length = center.distanceTo(toPoint);
                    
                    const arrow = new THREE.ArrowHelper(direction, center, length, 0xffcc00, 0.3, 0.2);
                    arrows.push(arrow);
                }
                break;
    
            case "Excentré":
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2;
                    const x = center.x + width * Math.cos(angle);
                    const z = center.z + height * Math.sin(angle) + 2; // +2 pour décaler vers l'arrière
                    const toPoint = new THREE.Vector3(x, center.y + yOffset, z);
                    const direction = new THREE.Vector3().subVectors(toPoint, center).normalize();
                    const length = center.distanceTo(toPoint);
                    const arrow = new THREE.ArrowHelper(direction, center, length, 0xffcc00, 0.3, 0.2);
                    arrows.push(arrow);
                            }
                            break;
    
            case "Centré":
                // Vecteurs répartis uniformément dans toutes les directions (mais vers le bas)
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2;
                    const x = center.x + width * Math.cos(angle);
                    const z = center.z + height * Math.sin(angle);
                    const toPoint = new THREE.Vector3(x, center.y - 3, z);
                    const direction = new THREE.Vector3().subVectors(toPoint, center).normalize();
                    const length = center.distanceTo(toPoint);
                    const arrow = new THREE.ArrowHelper(direction, center, length, 0xffcc00, 0.3, 0.2);
                    arrows.push(arrow);
                }
                break;
    
                case "Côté":
    const source = new THREE.Vector3(center.x, center.y, center.z);
    const length = 2.5;
    
    // Paramètres de la diffusion
    const verticalAngle = Math.PI/6; // 30° vers le bas
    const horizontalSpread = Math.PI/3; // 60° d'ouverture totale
    const vectorsPerSide = 5; // Vecteurs par côté

    // Rotation de 90° pour une orientation latérale
    const rotationMatrix = new THREE.Matrix4().makeRotationY(Math.PI/2);

    // Création des deux côtés opposés (gauche/droite)
    for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < vectorsPerSide; i++) {
            const ratio = (i / (vectorsPerSide - 1)) * 2 - 1; // De -1 à 1
            
            // Direction de base (vers l'avant et le bas)
            const direction = new THREE.Vector3(
                0,
                -Math.sin(verticalAngle),
                -Math.cos(verticalAngle)
            );
            
            // Application de la rotation de 90°
            direction.applyMatrix4(rotationMatrix);
            
            // Ajustement pour le côté gauche/droit
            direction.x *= side;
            
            // Application de l'éventail horizontal
            direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), ratio * horizontalSpread/2);
            
            const arrow = new THREE.ArrowHelper(
                direction.clone().normalize(),
                source,
                length,
                0xffcc00,
                0.3,
                0.2
            );
            arrows.push(arrow);
        }
    }
    break;
        }
    
        lampGroup.userData.arrows = arrows;
        arrows.forEach(arrow => lampGroup.add(arrow));
    }

    // Gestion de l'événement de la checkbox
    document.getElementById('showVectors').addEventListener('change', function() {
        if (this.checked) {
            createLightVectors(new THREE.Vector3(0, yPos, -2), 2, 4);
        } else {
            // Supprimer toutes les flèches
            if (lampGroup.userData.arrows) {
                lampGroup.userData.arrows.forEach(arrow => {
                    lampGroup.remove(arrow);
                });
                lampGroup.userData.arrows = [];
            }
        }
    });
    
    lampGroup.add(rectLight);
    lampGroup.add(spotLight);
    lampGroup.add(support);
    lampGroup.userData.rectLight = rectLight;
    lampGroup.userData.spotLight = spotLight;
    scene.add(lampGroup);

    return { lampe: lampGroup };
}
