import * as THREE from 'three'; // Importation de Three.js

export function createRoad(scene) {
  // Création de la route
  const roadGeometry = new THREE.BoxGeometry(12, 0.1, 50);
  const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.y = 0.05;
  road.receiveShadow = true;
  scene.add(road);

  // Création du sol
  const groundGeometry = new THREE.BoxGeometry(100, 0.1, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  scene.add(ground);

  // Fonction pour créer un lampadaire
  function createLampPost(x, z) {
    const group = new THREE.Group();

    // Base du lampadaire
    const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
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
    const solarPanelGeometry = new THREE.BoxGeometry(2, 0.01, 1);
    const solarPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x123456 });
    const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
    solarPanel.position.set(0, 8, 0);
    solarPanel.rotation.x = -Math.PI / 6;
    solarPanel.castShadow = true;
    group.add(solarPanel);

    // Ajouter une LED (sphère) au centre du lampadaire
    const ledGeometry = new THREE.SphereGeometry(0.5, 10, 2); // Créer une petite sphère pour la LED
    const ledMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00, // Couleur de base
      emissive: 0x000000, // Pas de lumière initialement
    }); // La LED aura une couleur jaune et une propriété emissive
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(0, 7, 0); // Placer la LED au centre du lampadaire
    led.castShadow = true;
    group.add(led);

    group.position.set(x, 0, z);
    return { group, led }; // Retourner aussi la LED pour la manipulation
  }

  // Ajouter un lampadaire à chaque côté de la route et stocker les LED
  const lampPosts = [];
  const leds = [];
  for (let i = -20; i <= 20; i += 10) {
    const { group, led } = createLampPost(-5, i);
    scene.add(group);
    lampPosts.push(group);
    leds.push(led);

    const { group: groupRight, led: ledRight } = createLampPost(5, i);
    scene.add(groupRight);
    lampPosts.push(groupRight);
    leds.push(ledRight);
  }

  // Fonction pour mettre à jour l'inclinaison des panneaux solaires
  function updateSolarPanelInclinaison(angle) {
    scene.traverse((child) => {
      if (child instanceof THREE.Group && child.children.length > 0) {
        child.children.forEach((object) => {
          if (object instanceof THREE.Mesh && object.geometry.type === "BoxGeometry") {
            object.rotation.x = THREE.MathUtils.degToRad(angle); // Convertir en radians
          }
        });
      }
    });
  }

  // Retourner la fonction pour mettre à jour l'inclinaison des panneaux solaires et les LEDs
  return { updateSolarPanelInclinaison, leds };
}
