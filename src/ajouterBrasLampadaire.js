import * as THREE from 'three';

export function ajouterBrasLampadaire(lampadaire, type) {
    const brasGroup = new THREE.Group();

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

    let bras, led, support;

    switch (type) {
        case "Combi Top1":
            bras = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.35, 0.8), brasMaterial);
            bras.position.set(1.9, 4.4, 0);
            brasGroup.add(bras);

            support = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16), brasMaterial);
            support.position.set(0.5, 4.2, 0);
            brasGroup.add(support);

            led = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.1, 0.7), ledMaterial);
            led.position.set(2, 4, 0);
            brasGroup.add(led);
            break;

        case "Combi Top2":
            bras = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 0.75), brasMaterial);
            bras.position.set(2.1, 4.3, 0);
            bras.rotation.z = -0.05;
            brasGroup.add(bras);

            support = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 0.8, 16), brasMaterial);
            support.position.set(0.4, 4.1, 0);
            brasGroup.add(support);

            led = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 0.6), ledMaterial);
            led.position.set(2, 4.05, 0);
            brasGroup.add(led);
            break;

        case "Combi Top3":
            bras = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.25, 0.7), brasMaterial);
            bras.position.set(2.3, 4.4, 0);
            bras.rotation.z = -0.1;
            brasGroup.add(bras);

            support = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), brasMaterial);
            support.position.set(0.5, 4.2, 0);
            brasGroup.add(support);

            led = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 0.55), ledMaterial);
            led.position.set(2.3, 4.15, 0);
            brasGroup.add(led);
            break;

        case "Combi Top5/5+":
            bras = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 0.8), brasMaterial);
            bras.position.set(2.5, 4.5, 0);
            bras.rotation.z = -0.08;
            brasGroup.add(bras);

            support = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16), brasMaterial);
            support.position.set(0.5, 4.5, 0);
            brasGroup.add(support);

            led = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.1, 0.75), ledMaterial);
            led.position.set(2.5, 4.3, 0);
            brasGroup.add(led);
            break;

        case "Combi Top6":
            bras = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.28, 0.75), brasMaterial);
            bras.position.set(2.6, 4.6, 0);
            bras.rotation.z = -0.12;
            brasGroup.add(bras);

            support = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.6, 16), brasMaterial);
            support.position.set(0.4, 4.4, 0);
            brasGroup.add(support);

            led = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.08, 0.6), ledMaterial);
            led.position.set(2.6, 4.35, 0);
            brasGroup.add(led);
            break;

        default:
            console.warn("Type de bras inconnu:", type);
            return;
    }

    // **Ajout d'un projecteur jaune pour simuler la lumière du lampadaire**
    const spotLight = new THREE.SpotLight(0xffff00, 0); // Intensité 0 par défaut
    spotLight.position.set(2, 3, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.decay = 2;
    spotLight.distance = 15;
    spotLight.castShadow = true;

    brasGroup.add(spotLight);

    brasGroup.position.set(0, 0, 0);
    lampadaire.add(brasGroup);

    // Ajoute une fonction d'update pour changer la couleur et la densité lumineuse
    brasGroup.update = function(heure, densiteLumiere) {
        let ledActive = heure >= 20;

        if (ledActive) {
            ledMaterial.emissive.set(0xffff55); // LED jaune allumée
            brasMaterial.color.set(0xffffaa); // Bras devient légèrement jaune
            spotLight.intensity = densiteLumiere; // Contrôle la densité lumineuse
        } else {
            ledMaterial.emissive.set(0x000000); // LED éteinte
            brasMaterial.color.set(0xffffff); // Bras blanc
            spotLight.intensity = 0; // Désactive la lumière projetée
        }
    };

    return brasGroup;
}
