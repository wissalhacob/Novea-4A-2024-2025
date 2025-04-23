🌃 Projet NOVEA – Simulation 3D d’Éclairage Public Intelligent
📜 Description du projet
Ce projet, réalisé en partenariat avec NOVEA Énergies, propose une simulation interactive 3D d’un système d’éclairage public intelligent situé rue Johann Gregor Mendel à Beaucouzé.

Il repose sur une modulation dynamique de la lumière des lampadaires selon :

la présence de piétons et de véhicules détectés en temps réel,

un programme horaire structuré en 5 phases journalières.

Le rendu web 3D est réalisé avec Three.js et intègre :

des entités dynamiques (personnages, chats, véhicules),

des lampadaires paramétrables,

une interface utilisateur interactive pour tester les scénarios d’éclairage.

👥 Membres de l’équipe

Nom	Rôle
Oumaima Kaadade	Développement 3D, animations
Autres membres	UI, modélisation, intégration
🧰 Technologies utilisées
Three.js – moteur de rendu 3D

Blender – modélisation 3D

HTML, CSS, JavaScript

Git & GitHub – versioning

Sketchfab – récupération de modèles

🧱 Structure du code
bash
Copier
Modifier
src/
├── main.js        # Initialisation de la scène
├── rue.js         # Modélisation de la rue
├── lampes.js      # Gestion des lampadaires
├── sky.js         # Ciel et cycle jour/nuit
📦 Communication via import/export de fonctions entre modules.

🚀 Lancer le projet localement
bash
Copier
Modifier
git clone https://github.com/votre-utilisateur/nom-du-repo.git
cd nom-du-repo
npm install
npm run dev
💡 Ou simplement ouvrir index.html dans un navigateur moderne.

🎮 Fonctionnalités dynamiques
Déplacement réaliste des personnages (orientation du visage)

Apparition aléatoire de chats animés

Éclairage dynamique selon horaires et détection

Interface utilisateur de personnalisation des lampadaires

📦 Versions utilisées
json
Copier
Modifier
{
  "dependencies": {
    "dat.gui": "^0.7.9",
    "proj4": "^2.15.0",
    "three": "^0.172.0",
    "troika-three-text": "^0.52.3"
  },
  "devDependencies": {
    "vite": "^6.0.11"
  }
}
🧪 Défis techniques & solutions

Défi	Solution
Navigation manuelle	Utilisation de OrbitControls de Three.js
Détection	Remplacement du raycasting par détection sur positionZ
Modèles lourds	Réduction de résolution + compression
Cycle jour/nuit	Fonction sinusoïdale + apparition d’étoiles après le coucher du soleil
🐞 Bugs connus
Le code se bloque lorsqu’un trop grand nombre d’objets animés est ajouté.

Légère latence si trop de paramètres sont modifiés rapidement.
