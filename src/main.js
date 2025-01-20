import { createScene } from './scene';  // Importer la fonction pour créer la scène

// Fonction principale pour démarrer la scène
function main() {
  // Créer la scène en appelant la fonction createScene()
  const { scene, camera, renderer } = createScene();

  // Fonction d'animation
  function animate() {
    // Vous pouvez ajouter d'autres animations ici si nécessaire
    renderer.render(scene, camera);
    requestAnimationFrame(animate); // Demande de la prochaine image
  }

  // Démarrer l'animation
  animate();
}

// Appeler la fonction main pour lancer le processus
main();
