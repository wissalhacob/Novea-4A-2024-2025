import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createRoad(scene) {
  const jsonUrl = '/overpass/data.json';

  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Données OSM chargées:', data);

      // Extraire les segments de route
      const roadData = data.elements.filter(el => el.type === 'way' && el.tags && el.tags.highway === 'service' && el.tags.name === 'Rue Johann Grégor Mendel');
      console.log('Segments de routes récupérés:', roadData);

      // Récupérer les identifiants de nœuds et les géométries associées
      const nodeMap = new Map();
      let centralLat = null;
      let centralLon = null;

      roadData.forEach(segment => {
        const nodeIds = segment.nodes;
        const geometries = segment.geometry;
        console.log('Identifiants de nœuds récupérés:', nodeIds);
        console.log('Géométrie associée:', geometries);

        // Trouver la géométrie du premier nœud de la rue principale (par exemple, le premier nœud de la rue Johann Grégor Mendel)
        if (!centralLat && !centralLon && geometries.length > 0) {
          centralLat = geometries[0].lat;  // Latitude du premier nœud
          centralLon = geometries[0].lon;  // Longitude du premier nœud
        }

        // Créer un mappage entre les nœuds et leurs géométries
        for (let i = 0; i < nodeIds.length; i++) {
          const nodeId = nodeIds[i];
          const geometry = geometries[i];
          nodeMap.set(nodeId, { lat: geometry.lat, lon: geometry.lon });
        }
      });

      console.log('NodeMap:', nodeMap);

      // Initialiser le GLTFLoader
      const loader = new GLTFLoader();
      
      // Charger le modèle 3D une seule fois
      loader.load('./models/source/g.glb', (gltf) => {
        console.log('Modèle chargé:', gltf.scene);
        
        const roadModel = gltf.scene;  // Le modèle chargé
        roadModel.scale.set(0.1, 0.1, 0.1);  // Ajuster l'échelle du modèle

        // Conversion des coordonnées latitude/longitude en coordonnées 3D
        // Conversion des coordonnées latitude/longitude en coordonnées 3D avec un facteur d'échelle plus grand
        const convertTo3D = (lat, lon) => {
          const latScale = 5000;  // Augmenter le facteur d'échelle pour la latitude
          const lonScale = 5000;  // Augmenter le facteur d'échelle pour la longitude

          // Calculer les différences par rapport à la rue principale (origine)
          const x = (lon - centralLon) * lonScale;
          const z = (lat - centralLat) * latScale;
          const y = 0; // Altitude, ajustez selon vos besoins

          // Debugging : afficher les coordonnées calculées
          console.log(`Position calculée : Latitude ${lat}, Longitude ${lon} => x: ${x}, y: ${y}, z: ${z}`);

          return { x, y, z };
        };


        // Ajouter les modèles 3D pour chaque nœud
        roadData.forEach(segment => {
          segment.nodes.forEach((nodeId) => {
            const node = nodeMap.get(nodeId);
            if (node) {
              const { lat, lon } = node;
              const { x, y, z } = convertTo3D(lat, lon);

              // Cloner le modèle 3D pour chaque nœud
              const roadClone = roadModel.clone();
              roadClone.position.set(x, y, z);
              scene.add(roadClone);  // Ajouter le modèle cloné à la scène
              console.log(`Ajout du modèle à la scène : ${x}, ${y}, ${z}`);
            } else {
              console.log(`Nœud ${nodeId} introuvable dans nodeMap`);
            }
          });
        });

        console.log('Scène mise à jour avec des modèles de route.');
      }, undefined, (error) => {
        console.error('Erreur lors du chargement du modèle:', error);
      });
    })
    .catch(error => {
      console.error('Erreur de récupération des données OSM:', error);
    });
}
