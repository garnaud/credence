# Crédence Magique (PWA)

Application web progressive (PWA) permettant de concevoir des crédences personnalisées encodant un message secret sous forme de motifs colorés.

## Fonctionnalités

- **Encodage secret :** Chaque lettre ou symbole est représenté par un trio de carreaux colorés avec deux variantes au choix.
- **Alphabet 100 % configurable :**
  - **Générateur sans collision :** bouton pour générer instantanément un alphabet avec 84 triplets uniques (0 collision garantie parmi les 5 couleurs).
  - **Édition par clic :** cliquez directement sur n'importe quel carreau d'un triplet pour faire défiler la couleur (R → B → V → J → W).
  - **Détecteur de doublons en temps réel :** avertissement visuel immédiat si un triplet est déjà attribué à une autre lettre/variante.
  - **Sauvegarde & Partage :** mémorisation automatique dans le navigateur (`localStorage`) et boutons d'export/import au format JSON.
- **5 Couleurs personnalisables :** Sélecteurs de couleur pour le Rouge (R), Bleu (B), Vert (V), Jaune (J) et Blanc (W).
- **Compteur de carreaux par couleur :** Décompte dynamique des carreaux et pourcentages pour chaque couleur présente dans la crédence.
- **Rendu en temps réel :** La crédence SVG et la table de l'alphabet s'actualisent instantanément lors de la frappe ou du changement de couleur.
- **Contrôle de capacité visuel :** Avertissement immédiat si le message est plus long ou plus court que la grille.
- **Téléchargement SVG :** Export direct du fichier SVG prêt pour l'impression ou la fabrication.
- **PWA & Offline :** Installable sur smartphone / ordinateur et utilisable hors-ligne via Service Worker.

## Tester en local

Vous pouvez lancer un serveur HTTP local rapidement avec Python :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## Déploiement sur GitHub Pages

1. Poussez les fichiers sur votre dépôt GitHub (`master` ou `main`).
2. Rendez-vous dans **Settings** > **Pages** de votre dépôt GitHub.
3. Dans **Build and deployment** > **Branch**, sélectionnez la branche `master` (ou `main`), dossier `/ (root)`, puis cliquez sur **Save**.
4. L'application sera accessible gratuitement en ligne à l'adresse `https://<votre-pseudo>.github.io/<nom-du-repo>/`.
