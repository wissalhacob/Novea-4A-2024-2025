import * as THREE from 'three';

// Fonction pour créer le panneau solaire et son inclinaison
export function create_panneaux_sol(scene,longueur) {
      const textureLoader = new THREE.TextureLoader();
    
      // Création du panneau solaire
      const solarPanelGeometry = new THREE.BoxGeometry(2.5, 0.15, 3);
      const solarPanelTexture = textureLoader.load('/models/texture/solar_panel_texture.jpg'); // Charger la texture du panneau solaire

      // Ajuster la répétition de la texture du panneau solaire
      solarPanelTexture.wrapS = solarPanelTexture.wrapT = THREE.RepeatWrapping; // Assurer la répétition de la texture
      solarPanelTexture.repeat.set(1, 1); // Ajuster la répétition de la texture pour le panneau solaire
      // Créer le matériau avec la texture
      const solarPanelMaterial = new THREE.MeshStandardMaterial({
          map: solarPanelTexture,
          color: new THREE.Color(0x666666)  // Applique une teinte plus sombre à la texture
      });

      // Créer le panneau solaire
      const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
      
      switch (longueur) {
        case "4":
            solarPanel.position.set(0, 10, 0); 
            break;
        case "6":
            solarPanel.position.set(0, 12, 0); 
            break;
        case "7":
          solarPanel.position.set(0, 12.8, 0); 
            break;
        case "8":
          solarPanel.position.set(0, 14, 0); 
            break;
        default:
          solarPanel.position.set(0, 15, 0); 
            break;
    }
      solarPanel.rotation.x = -Math.PI / 6;  // Incliner le panneau solaire
      solarPanel.castShadow = true;  // Activer l'ombrage




    // Fonction pour mettre à jour l'inclinaison
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

    // Interface utilisateur pour modifier l'inclinaison
    const inclinaisonSelect = document.getElementById('inclinaison');
    if (inclinaisonSelect) {
        inclinaisonSelect.addEventListener('change', (event) => {
            const angle = parseInt(event.target.value);
            updateSolarPanelInclinaison(angle);
        });
    }

    return { solarPanel, updateSolarPanelInclinaison };
}