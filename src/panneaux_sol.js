import * as THREE from 'three';

// Fonction pour créer le panneau solaire et son inclinaison
export function create_panneaux_sol(scene) {
    // Création du panneau solaire
    const solarPanelGeometry = new THREE.BoxGeometry(2, 0.01, 1);
    const solarPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x123456 });
    const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
    solarPanel.position.set(0, 8, 0);
    solarPanel.rotation.x = -Math.PI / 6;
    solarPanel.castShadow = true;


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