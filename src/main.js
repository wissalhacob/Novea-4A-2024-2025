import { createScene } from './scene';  // Importer la fonction pour créer la scène
import { createRoad } from './route';  // Importer la fonction pour créer la route

// Fonction principale pour démarrer la scène
function main() {
  const { scene, camera, renderer } = createScene();

  // Ajouter la route à la scène
  createRoad(scene);  // Passer la scène à la fonction

  // Fonction d'animation
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

main();
