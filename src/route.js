// Importation des modules nécessaires de Three.js.
// `THREE` est le module principal contenant les éléments 3D fondamentaux (scène, caméra, renderer, etc.).
import * as THREE from 'three';

// Importation du module GLTFLoader, une extension de Three.js utilisée pour charger des modèles 3D au format GLTF/GLB.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Définition de la fonction `createRoad`, utilisée pour ajouter un modèle 3D (une route) à une scène existante.
export function createRoad(scene) { 
  // Création d'une instance du chargeur GLTFLoader.
  const loader = new GLTFLoader();

  // Chargement du modèle 3D à partir du chemin spécifié.
  loader.load(
    './models/source/g.glb', // Chemin relatif vers le fichier GLB (modèle 3D de la route).

    // Callback appelée lorsque le modèle est chargé avec succès.
    (gltf) => {
      console.log('Model loaded:', gltf.scene); // Affiche dans la console les détails du modèle chargé.
      
      const road = gltf.scene; // Récupération de la scène du modèle (le groupe contenant tous ses objets).
      road.scale.set(0.1, 0.1, 0.1); // Ajustement de l'échelle du modèle (réduction de sa taille).
      road.position.set(0, 0, 0); // Positionnement du modèle à l'origine de la scène.

      scene.add(road); // Ajout du modèle (la route) à la scène principale.
    },

    // Callback optionnelle pour suivre la progression du chargement (non utilisée ici).
    undefined,

    // Callback appelée en cas d'erreur lors du chargement du modèle.
    (error) => {
      console.error('Error loading model:', error); // Affiche un message d'erreur dans la console.
    }
  );
}
