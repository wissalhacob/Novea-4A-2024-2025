import * as THREE from 'three'; // Importation de toutes les fonctionnalités nécessaires de Three.js
import { create_panneaux_sol } from './panneaux_sol';
import { create_lampes } from './lampes';

export function createRoad(scene) {
  const textureLoader = new THREE.TextureLoader();

  // Création de la route
  const roadGeometry = new THREE.BoxGeometry(12, 0.1, 50);

  // Charger la texture de la route
  const roadTexture = textureLoader.load('/models/source/route_texture.png');

  // Ajuster la taille de la texture pour qu'elle recouvre toute la largeur sans répétition
  roadTexture.wrapS = THREE.RepeatWrapping;
  roadTexture.wrapT = THREE.RepeatWrapping;

  // Pour étirer la texture sur la géométrie sans répétition
  roadTexture.minFilter = THREE.LinearFilter;
  roadTexture.magFilter = THREE.LinearFilter;

  // Ajuster la texture pour la faire s'étirer sur toute la route
  roadTexture.repeat.set(1, 1);  // Cette ligne empêche la répétition sur la surface

  // Utiliser la texture pour le matériau de la route
  const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });

  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.y = 0.05;
  road.receiveShadow = true;
  scene.add(road);

  // Création du sol
  const groundGeometry = new THREE.BoxGeometry(100, 0.1, 100);
  const groundTexture = textureLoader.load('/models/source/ground_texture.png'); // Charger la texture du sol
  groundTexture.repeat.set(10, 10);  // Ajuster la répétition de la texture du sol
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping; // Assurer la répétition de la texture
  const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture }); // Appliquer la texture au sol

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  scene.add(ground);

  function createLampPost(x, z) {
    const group = new THREE.Group();
  
    const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 30);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
  
    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 4;
    pole.castShadow = true;
    pole.receiveShadow = true;
    group.add(pole);
  
    // Assurez-vous que le panneau solaire et la lampe peuvent également projeter des ombres
    const { solarPanel } = create_panneaux_sol(scene);
    solarPanel.castShadow = true;
    solarPanel.receiveShadow = true;
    group.add(solarPanel);
  
    const { lampe } = create_lampes(scene);
    lampe.castShadow = true;
    lampe.receiveShadow = true;
    group.add(lampe);
  
    group.position.set(x, 0, z);
    return { group }; // Retourner aussi le groupe pour la manipulation
  }
  

  // Ajouter un lampadaire à chaque côté de la route et stocker les LED
  const lampPosts = [];

  for (let i = -20; i <= 20; i += 10) {
    const { group, led } = createLampPost(-5, i);
    scene.add(group);
    group.castShadow=true
    lampPosts.push(group);

    const { group: groupRight } = createLampPost(5, i);
    scene.add(groupRight);
    lampPosts.push(groupRight);
  }
}
