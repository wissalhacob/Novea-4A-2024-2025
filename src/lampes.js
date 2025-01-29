import * as THREE from 'three';

// Fonction pour créer la lampe et son inclinaison
export function create_lampes(scene) {
    // Création du corps de la lampe (forme rectangulaire horizontale)
    const lampGeometry = new THREE.BoxGeometry(2, 0.4, 0.4); // Prisme rectangulaire horizontal
    const lampMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Couleur gris pour la lampe
    const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
    lamp.position.y = 9; // Positionner la lampe au-dessus du lampadaire
    lamp.castShadow = true;

   
    lamp.rotation.z = -Math.PI ;  // Rotation de 90° autour de l'axe X

    // Création du support de la lampe (cylindre horizontal pour soutenir la lampe)
    const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 7); // Petit cylindre pour le support
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Couleur gris sombre
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    support.position.set(-0, 7, -0.3); // Positionner le support au centre de la lampe
    support.rotation.x = Math.PI / 2;  // Rotation de 90° autour de l'axe Z pour le rendre horizontal
    support.castShadow = true;

    // Création d'un groupe pour combiner la lampe et son support
    const lampGroup = new THREE.Group();
    lampGroup.add(lamp);
    lampGroup.add(support);

    return { lampe: lampGroup }; // Retourner le groupe contenant la lampe
}
