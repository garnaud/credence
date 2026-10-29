# Crédence Magique (PWA)

Application web progressive (PWA) permettant de concevoir des crédences personnalisées encodant un message secret sous forme de motifs colorés.

## Fonctionnalités

- **Option 4 ou 5 couleurs :**
  - **Mode 5 couleurs (recommandé) :** 125 combinaisons possibles, garantissant 0 collision pour les 84 triplets de l'alphabet.
  - **Mode 4 couleurs (historique) :** Rouge, Bleu, Vert, Jaune (sans blanc) pour ceux qui préfèrent une palette resserrée.
- **Lien de partage universel :** Bouton « 🔗 Partager » pour copier en 1 clic une URL encodant l'intégralité de votre configuration (message secret, dimensions, palette et alphabet personnalisé). N'importe qui ouvrant ce lien retrouve instantanément votre crédence identique.
- **Alphabet 100 % configurable :**
  - **Générateur sans collision :** bouton pour générer instantanément un alphabet optimisé.
  - **Édition par clic :** cliquez directement sur n'importe quel carreau pour faire défiler la couleur.
  - **Détecteur de doublons en temps réel :** avertissement visuel immédiat si un triplet est déjà attribué.
  - **Sauvegarde & Partage :** mémorisation automatique dans le navigateur (`localStorage`) et boutons d'export/import au format JSON.
- **Couleurs personnalisables :** Sélecteurs de couleur pour chaque teinte de la palette.
- **Compteur de carreaux par couleur :** Décompte dynamique des carreaux et pourcentages pour chaque couleur présente dans la crédence.
- **Rendu en temps réel :** La crédence et la table de l'alphabet s'actualisent instantanément lors de la frappe ou du changement de couleur.
- **Contrôle de capacité visuel :** Avertissement discret sous le message si celui-ci est plus long ou plus court que la grille.
- **Export haute résolution :** Téléchargement direct en image PNG ou document PDF A4 prêt pour l'impression.
- **PWA & Offline :** Installable sur smartphone / ordinateur et utilisable hors-ligne via Service Worker.

## Tester en local

Vous pouvez lancer un serveur HTTP local rapidement avec Python :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## Déploiement sur GitHub Pages

Un workflow GitHub Actions automatisé est configuré dans `.github/workflows/deploy.yml`.

Pour l'activer sur votre dépôt :
1. Poussez votre code sur GitHub (`git add .`, `git commit -m "feat: config github pages"`, `git push`).
2. Rendez-vous dans **Settings** > **Pages** de votre dépôt GitHub.
3. Dans **Build and deployment** > **Source**, sélectionnez **GitHub Actions**.
4. Le workflow se lance automatiquement à chaque push sur `main` et déploie le site sur :
   `https://garnaud.github.io/credence/`
