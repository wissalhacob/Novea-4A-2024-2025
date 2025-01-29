import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';  // Importer GLTFLoader

// Fonction pour créer la lampe avec un modèle GLB et un support
export function create_lampes(scene) {
    // Créer un chargeur pour le fichier GLB
    const loader = new GLTFLoader();

    // Chemin vers le fichier GLB de la lampe
    const modelPath = '/models/source/tekk-s.glb';

    // Créer un groupe pour la lampe et son support
    const lampGroup = new THREE.Group();

    // Charger le modèle GLTF (lampe)
    loader.load(
        modelPath,
        (gltf) => {
            const lamp = gltf.scene; // Charger le modèle 3D
            lamp.scale.set(40, 40, 40); // Ajuster l'échelle du modèle

            // Appliquer la couleur gris clair au modèle 3D
            lamp.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 }); // Gris clair
                    child.castShadow = true; // Activer les ombres
                }
            });

            // Corriger l'orientation du modèle pour qu'il soit sur sa base
            lamp.rotation.x = Math.PI / 2; // Rotation pour l'aligner correctement
            lamp.rotation.z= -Math.PI / 2;
            // Positionner la lampe sur le support
            lamp.position.set(-0.5, 6.8, -2.3); // Ajuster cette position si nécessaire

            lampGroup.add(lamp); // Ajouter la lampe au groupe
        },
        // Fonction de progression (optionnelle)
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Fonction de gestion d'erreur (optionnelle)
        (error) => {
            console.error('An error occurred while loading the GLB file', error);
        }
    );

    // Création du support de la lampe (cylindre horizontal)
    const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.3, 7); // Petit cylindre pour le support
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 }); // Gris clair
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    support.position.set(0, 6.5, -0.6); // Positionner le support
    support.rotation.x = -Math.PI / 3;  // Rotation de 90° autour de l'axe Z pour le rendre horizontal
    support.castShadow = true;

    // Appliquer une rotation à la base (support) pour la tourner à gauche
    support.rotation.y = Math.PI / 9; // Ajustez cette valeur pour faire pivoter à gauche

    // Ajouter le support au groupe
    lampGroup.add(support);

    // Ajouter le groupe à la scène (si nécessaire)
    scene.add(lampGroup);

    return { lampe: lampGroup }; // Retourner le groupe contenant la lampe et le support
}
