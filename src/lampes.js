import * as THREE from 'three';

// Fonction pour créer la lampe avec un modèle GLB et un support
export function create_lampes(scene, typeBras) {
    let brasMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,  // Blanc par défaut
        metalness: 0.9, 
        roughness: 0.3
    });

    let ledMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffaa, 
        emissive: 0x000000, // Éteint par défaut
        emissiveIntensity: 1.8
    });

    // Créer un groupe pour la lampe et son support
    const lampGroup = new THREE.Group();

    let bras, led;

    switch (typeBras) {
        case "GRIFF S":
            bras = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.35, 0.8), brasMaterial);
            bras.scale.set(0.4, 1, 1);
            bras.rotation.y = -Math.PI / 2;
            bras.position.set(0, 6.8, -1.7);
            lampGroup.add(bras);

            led = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.7), ledMaterial);
            led.position.set(0, 6.6, -1.7);
            led.rotation.y = -Math.PI / 2;
            lampGroup.add(led);
            break;

        case "TEKK S":
            bras = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 0.75), brasMaterial);
            bras.scale.set(0.4, 1, 1);
            bras.rotation.y = -Math.PI / 2;
            bras.position.set(0, 6.8, -1.7);
            bras.rotation.z = -0.05;
            lampGroup.add(bras);

            led = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.7), ledMaterial);
            led.position.set(0, 6.6, -1.7);
            led.rotation.y = -Math.PI / 2;
            lampGroup.add(led);
            break;

        case "ATINA SLIM 6480":
            bras = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.25, 0.7), brasMaterial);
            bras.rotation.y = -Math.PI / 2;
            bras.position.set(0, 6.8, -1.7);
            bras.rotation.z = -0.1;
            lampGroup.add(bras);

            led = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.7), ledMaterial);
            led.position.set(0, 6.6, -1.7);
            led.rotation.y = -Math.PI / 2;
            lampGroup.add(led);
            break;

        default:
            console.warn("Type de lampe inconnu:", typeBras);
            return null;
    }

    // Création du support de la lampe
    const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.3, 7);
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    support.position.set(0, 6.5, -0.6);
    support.rotation.x = -Math.PI / 3;  
    support.rotation.y = Math.PI / 9; 
    support.castShadow = true;
    lampGroup.add(support);

    // Ajout d'un projecteur jaune
    const spotLight = new THREE.SpotLight(0xffff00, 0); // Intensité 0 par défaut
    spotLight.position.set(2, 3, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.decay = 2;
    spotLight.distance = 15;
    spotLight.castShadow = true;
    lampGroup.add(spotLight);

    lampGroup.position.set(0, 0, 0);

    // Fonction d'update pour contrôler la lumière
    lampGroup.update = function(heure, densiteLumiere) {
        let ledActive = heure >= 20;
        if (ledActive) {
            ledMaterial.emissive.set(0xffff55);
            brasMaterial.color.set(0xffffaa);
            spotLight.intensity = densiteLumiere;
        } else {
            ledMaterial.emissive.set(0x000000);
            brasMaterial.color.set(0xffffff);
            spotLight.intensity = 0;
        }
    };

    scene.add(lampGroup);

    return { lampe: lampGroup };
}
