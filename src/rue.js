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
    
      // Base du lampadaire
    const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 16); // Créer une base pour le lampadaire (cylindre)
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25; // Positionner la base juste au-dessus du sol
    base.castShadow = true;
    group.add(base); // Ajouter la base au groupe
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

    
   

    group.position.set(x, 0, z);
    return group;
    }
     // Fonction pour mettre à jour l'inclinaison des panneaux solaires
  function updateSolarPanelInclinaison(angle) {
    scene.traverse((child) => {
      if (child instanceof THREE.Group && child.children.length > 0) {
        // Vérifie si c'est le groupe du panneau solaire
        child.children.forEach((object) => {
          if (object instanceof THREE.Mesh && object.geometry.type === "BoxGeometry") {
            // Mettre à jour seulement l'inclinaison du panneau solaire
            if (object.rotation) {
              object.rotation.x = THREE.MathUtils.degToRad(angle);  // Convertir en radians
            }
          }
        });
      }
    });
  }

    // Ajouter un lampadaire à chaque côté de la route
    for (let i = -20; i <= 20; i += 10) {
    const lampPostLeft = createLampPost(-5, i);
    scene.add(lampPostLeft);

    const lampPostRight = createLampPost(5, i);
    scene.add(lampPostRight);
    }
    
      // Retourner la fonction pour mettre à jour l'inclinaison
     return { updateSolarPanelInclinaison };

}