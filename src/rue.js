import * as THREE from 'three'; // Importation de toutes les fonctionnalités nécessaires de Three.js

export function createRoad(scene) {
    // géométrie de route 
    const roadGeometry = new THREE.BoxGeometry(12, 0.1, 50);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.y = 0.05;
    road.receiveShadow = true;
    scene.add(road);

    // Créer un sol 
    const groundGeometry = new THREE.BoxGeometry(100, 0.1, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Créer un modèle de lampadaire 
    function createLampPost(x, z) {
    const group = new THREE.Group();

    // Poteau du lampadaire
    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 4;
    pole.castShadow = true;
    group.add(pole);

    // Panneau solaire
    const solarPanelGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const solarPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x123456 });
    const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
    solarPanel.position.set(0, 8, 0);
    solarPanel.rotation.x = -Math.PI / 6;
    solarPanel.castShadow = true;
    group.add(solarPanel);

    // Batterie (base du lampadaire)
    const batteryGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const batteryMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const battery = new THREE.Mesh(batteryGeometry, batteryMaterial);
    battery.position.set(0, 0.25, 0);
    battery.castShadow = true;
    group.add(battery);

    group.position.set(x, 0, z);
    return group;
    }

    // Ajouter un lampadaire à chaque côté de la route
    for (let i = -20; i <= 20; i += 10) {
    const lampPostLeft = createLampPost(-5, i);
    scene.add(lampPostLeft);

    const lampPostRight = createLampPost(5, i);
    scene.add(lampPostRight);
    }

}