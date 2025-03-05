import * as THREE from 'three';
import { THREEx } from './lumiere_settings.js';  // Importer le système jour/nuit

export function ajouterDetecteurPresence(brasGroup, rectLight, ledMaterial, brasMaterial, getSunAngle, heure) {
    // Créer une sphère de détection invisible
    const detectionSphere = new THREE.Mesh(
        new THREE.SphereGeometry(3, 16, 16), // Rayon 3m (diamètre 6m)
        new THREE.MeshBasicMaterial({ visible: false }) // Invisible
    );
    detectionSphere.position.set(2, 4, 0);
    brasGroup.add(detectionSphere);

    function updateLampe(objet) {
        if (!objet || !objet.position) {
            console.error("L'objet passé à updateLampe n'a pas de position.");
            return;
        }

        // Utiliser la fonction getSunAngle passée en paramètre
        let sunAngle = getSunAngle(heure);  
        let phase = THREEx?.DayNight?.currentPhase?.(sunAngle) || 'day'; // Vérifier si la fonction existe

        let distance = detectionSphere.position.distanceTo(objet.position);
        let presenceDetectee = (distance <= 3);

        // Ajustement des angles pour un modèle plus réaliste
        const sunsetAngle = Math.PI;      // 180° (Coucher du soleil)
        const sunriseAngle = 0;           // 0° (Lever du soleil)

        const beforeSunsetAngle = sunsetAngle - (2 * Math.PI / 24);
        const afterSunriseAngle = sunriseAngle + (2 * Math.PI / 24);

        // Allumer les lampadaires selon les conditions
        if ((sunAngle >= beforeSunsetAngle && sunAngle <= sunsetAngle) || 
            (sunAngle >= sunriseAngle && sunAngle <= afterSunriseAngle) || 
            (phase === 'night' && presenceDetectee)) {
            ledMaterial.emissive.set(0xffff55); // LED allumée
            brasMaterial.color.set(0xffffaa);
            rectLight.intensity = 5;
        } else {
            ledMaterial.emissive.set(0x000000);
            brasMaterial.color.set(0xffffff);
            rectLight.intensity = 0;
        }
    }

    return { detectionSphere, updateLampe }; 
}
