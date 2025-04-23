🌃 Projet NOVEA – Simulation 3D d’Éclairage Public Intelligent
📜 Description du projet
Ce projet, réalisé en partenariat avec NOVEA Énergies, consiste en la simulation interactive d’un système d’éclairage public intelligent implanté dans la rue Johann Gregor Mendel à Beaucouzé.
Il repose sur une approche consistant à moduler l’intensité lumineuse des lampadaires en fonction :
de la présence de véhicules et de piétons détectés en temps réel,
ainsi que d’un programme horaire structuré en cinq phases, représentant les différentes périodes d’une journée.
L’objectif principal est de permettre la visualisation et l’évaluation des stratégies d’éclairage via un rendu web 3D dynamique développé avec Three.js. L’environnement modélisé intègre :
des entités animées (personnages, véhicules, chats),
des lampadaires paramétrables,
une interface utilisateur ergonomique permettant de configurer les phases d’éclairage et les scénarios.

🧰 Technologies utilisées
🔧 Technologies
Three.js – Moteur de rendu 3D
HTML / CSS / JavaScript
Blender – Modélisation des objets 3D
Sketchfab – Récupération de modèles
Git & GitHub – Suivi de version

🏗️ Structure du code
Organisation modulaire :
main.js, rue.js, lampes.js, sky.js...
Communication inter-modules via import/export de fonctions
🚀 Lancer le projet localement

Cloner le projet

bash
Copier
Modifier
git clone https://github.com/votre-utilisateur/nom-du-repo.git
cd nom-du-repo
Installer les dépendances et exécuter en local (si bundler comme Vite/Webpack)

bash
Copier
Modifier
npm install
npm run dev

🚶 Fonctionnalités dynamiques

Déplacement réaliste des personnages (orientation du visage)
Apparition aléatoire des chats avec mouvement
Éclairage selon horaires et détection
Interface interactive avec personnalisation de chaque lampe

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

Navigation manuelle	Utilisation de OrbitControls de Three.js
Détection	Remplacement du raycasting par détection via positionZ
Modèles lourds	Réduction des résolutions + compression
Cycle jour/nuit	Simulation du soleil via une fonction sinusoïdale, et apparition des étoiles après le coucher.

🐞 Bugs connus

Le code se bloque lorsqu’un grand nombre d’objets animés sont ajoutés

Légère latence si trop de paramètres sont modifiés rapidement

