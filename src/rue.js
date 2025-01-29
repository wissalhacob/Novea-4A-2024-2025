import * as THREE from 'three'; // Importation de toutes les fonctionnalités nécessaires de Three.js
import {create_panneaux_sol} from './panneaux_sol'

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

    // Créer un modèle de lampadaire 
    function createLampPost(x, z) {
      const group = new THREE.Group();
      
      const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 16);
      const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 0.25;
      base.castShadow = true;
      group.add(base);
  
      const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
      const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 4;
      pole.castShadow = true;
      group.add(pole);

      // Ajout du panneau solaire
      const { solarPanel, updateSolarPanelInclinaison } = create_panneaux_sol(scene);
      group.add(solarPanel);
      group.position.set(0, 0, 0);  // Assurez-vous d'un bon positionnement
    
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

  // Retourner la fonction pour mettre à jour l'inclinaison des panneaux solaires et les LEDs
  return {  leds };
}