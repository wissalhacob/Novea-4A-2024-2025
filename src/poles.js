import * as THREE from 'three';

// Fonction pour créer le panneau solaire et son inclinaison
export function create_pole(scene, longueur) {
    let poleGeometry;
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Définir la géométrie du poteau en fonction de la longueur
    switch (longueur) {
        case "4":
            poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 12, 16);
            break;
        case "6":
            poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 16, 16);
            break;
        case "7":
            poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 17.4, 16);
            break;
        case "8":
            poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 19.7, 16);
            break;
        default:
            poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 12, 16);  
            break;
    }
    
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 4;  // Position par défaut du poteau (à ajuster si nécessaire)
    pole.castShadow = true;
    pole.receiveShadow = true;
    scene.add(pole);

    return { pole };
}
