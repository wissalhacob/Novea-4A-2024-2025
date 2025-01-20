import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function createRoad() {
  const loader = new GLTFLoader();
  
  loader.load(
    '/public/models/source/g.glb',  // Le chemin vers votre modèle 3D
    (gltf) => {
      const road = gltf.scene;
      road.scale.set(1, 1, 1);  // Redimensionner si nécessaire
      road.position.set(0, 0, 0);  // Placer la route à la position souhaitée
      scene.add(road);  // Ajouter la route à la scène
    },
    undefined,  // Optionnel : progress callback
    (error) => {
      console.error('Erreur de chargement du modèle : ', error);
    }
  );
}
