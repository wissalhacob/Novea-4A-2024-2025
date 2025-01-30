import * as THREE from 'three';
import * as dat from 'dat.gui';

// Fonction pour ajouter des nuages avec contrôle utilisateur
export function create_sky_with_clouds(scene) {
    const gui = new dat.GUI();
    const params = {
        cloudDensity: 20, // Nombre de nuages
        cloudOpacity: 0.7, // Transparence des nuages
    };

    gui.add(params, 'cloudDensity', 5, 50, 1).name("Densité des Nuages").onChange(createClouds);
    gui.add(params, 'cloudOpacity', 0.1, 1.0, 0.05).name("Opacité des Nuages").onChange(updateCloudOpacity);

    const cloudTexture = new THREE.TextureLoader().load('./sky1.png');
    const clouds = [];

    function createClouds() {
        // Supprimer les anciens nuages
        clouds.forEach(cloud => scene.remove(cloud));
        clouds.length = 10;

        for (let i = 0; i < params.cloudDensity; i++) {
            const cloudMaterial = new THREE.SpriteMaterial({ 
                map: cloudTexture, 
                transparent: true, 
                opacity: params.cloudOpacity,
            });
            const cloud = new THREE.Sprite(cloudMaterial);

            cloud.position.set(
                (Math.random() - 0.5) * 100,
                30 + Math.random() * 10, // Hauteur ajustée
                (Math.random() - 0.5) * 150
            );
            cloud.scale.set(20 + Math.random() * 10, 10 + Math.random() * 5, 1);
            scene.add(cloud);
            clouds.push(cloud);
        }
    }

    function updateCloudOpacity() {
        clouds.forEach(cloud => cloud.material.opacity = params.cloudOpacity);
    }

    createClouds();
}
