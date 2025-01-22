import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createRoad(scene) {
  const jsonUrl = '/overpass/data.json';

  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Données OSM chargées:', data);

      // Extraire les segments de la rue principale
      const roadData = data.elements.filter(el => el.type === 'way' && el.tags && el.tags.highway === 'service' && el.tags.name === 'Rue Johann Grégor Mendel');
      console.log('Segments de routes récupérés:', roadData);

      // Récupérer les nœuds et géométries associées
      const nodeMap = new Map();

      // Calculer le barycentre
      let totalLat = 0;
      let totalLon = 0;
      let nodeCount = 0;

      roadData.forEach(segment => {
        const geometries = segment.geometry;

        geometries.forEach(geometry => {
          totalLat += geometry.lat;
          totalLon += geometry.lon;
          nodeCount++;
        });
      });

      const centerLat = totalLat / nodeCount;
      const centerLon = totalLon / nodeCount;

      console.log(`Barycentre calculé : lat=${centerLat}, lon=${centerLon}`);

      // Conversion des coordonnées latitude/longitude en coordonnées 3D
      const convertTo3D = (lat, lon, alt = 0) => {
        const rad = 6378137.0; // Rayon de la Terre en mètres
        const f = 1 / 298.257223563; // Aplatissement WGS84
        const cosLat = Math.cos((lat * Math.PI) / 180);
        const sinLat = Math.sin((lat * Math.PI) / 180);
        const FF = (1.0 - f) ** 2;
        const C = 1 / Math.sqrt(cosLat ** 2 + FF * sinLat ** 2);
        const S = C * FF;

        const x = (rad * C + alt) * cosLat * Math.cos((lon * Math.PI) / 180);
        const y = (rad * C + alt) * cosLat * Math.sin((lon * Math.PI) / 180);
        const z = (rad * S + alt) * sinLat;

        return { x, y, z };
      };

      // Convertir le barycentre en coordonnées 3D
      const origin = convertTo3D(centerLat, centerLon, 0);
      console.log(`Origine calculée en 3D : x=${origin.x}, y=${origin.y}, z=${origin.z}`);

      // Initialiser le GLTFLoader
      const loader = new GLTFLoader();

      // Charger le modèle 3D une seule fois
      loader.load('./models/source/g.glb', (gltf) => {
        console.log('Modèle chargé:', gltf.scene);

        const roadModel = gltf.scene;

        // Ajouter les modèles 3D pour chaque nœud
        roadData.forEach(segment => {
          segment.nodes.forEach((nodeId, index) => {
            const geometry = segment.geometry[index];
            if (geometry) {
              const { lat, lon } = geometry;

              // Convertir en coordonnées 3D par rapport à l'origine
              const position = convertTo3D(lat, lon, 0);
              const relativeX = position.x - origin.x;
              const relativeY = position.y - origin.y;
              const relativeZ = position.z - origin.z;

              // Cloner le modèle
              const roadClone = roadModel.clone();

              // Appliquer une échelle
              roadClone.scale.set(0.1, 0.1, 0.1);

              // Position relative au barycentre
              roadClone.position.set(relativeX, relativeY, relativeZ);
              scene.add(roadClone);

              console.log(`Ajout du modèle à : x=${relativeX}, y=${relativeY}, z=${relativeZ}`);
            } else {
              console.log(`Géométrie introuvable pour le nœud ${nodeId}`);
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
