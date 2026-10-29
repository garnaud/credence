import svgwrite
import random

COULEURS = {
    'R': '#c14444',  # Rouge: 193 68 68
    'B': '#456496',  # Bleu: 69 100 150
    'V': '#779c90',  # Vert: 119 156 144
    'J': '#e2d222',  # Jaune: 226 210 34
    'W': '#e8d9d9'   # Blanc: 232 217 217
}

CODE = {
    # Lettres majuscules
    'A': [['R', 'V', 'R'], ['J', 'V', 'V']],
    'B': [['J', 'W', 'W'], ['W', 'J', 'J']],
    'C': [['J', 'W', 'B'], ['B', 'B', 'V']],
    'D': [['J', 'W', 'V'], ['J', 'J', 'R']],
    'E': [['W', 'R', 'R'], ['W', 'V', 'J']],
    'F': [['B', 'W', 'W'], ['J', 'B', 'V']],
    'G': [['J', 'J', 'B'], ['B', 'B', 'W']],
    'H': [['R', 'J', 'V'], ['V', 'J', 'R']],
    'I': [['J', 'V', 'R'], ['W', 'R', 'B']],
    'J': [['V', 'R', 'J'], ['V', 'W', 'B']],
    'K': [['R', 'B', 'W'], ['V', 'V', 'W']],
    'L': [['W', 'R', 'V'], ['W', 'V', 'V']],
    'M': [['R', 'B', 'J'], ['R', 'R', 'V']],
    'N': [['J', 'B', 'B'], ['V', 'W', 'J']],
    'O': [['B', 'R', 'V'], ['J', 'B', 'J']],
    'P': [['R', 'W', 'V'], ['V', 'R', 'W']],
    'Q': [['B', 'J', 'J'], ['V', 'R', 'V']],
    'R': [['V', 'J', 'W'], ['B', 'J', 'B']],
    'S': [['V', 'W', 'R'], ['B', 'V', 'B']],
    'T': [['V', 'V', 'J'], ['B', 'J', 'R']],
    'U': [['V', 'V', 'B'], ['V', 'B', 'V']],
    'V': [['J', 'R', 'W'], ['R', 'W', 'J']],
    'W': [['V', 'J', 'B'], ['V', 'J', 'J']],
    'X': [['R', 'W', 'W'], ['B', 'J', 'V']],
    'Y': [['W', 'R', 'J'], ['W', 'J', 'B']],
    'Z': [['B', 'R', 'R'], ['R', 'B', 'V']],

    # Chiffres
    '0': [['V', 'B', 'J'], ['J', 'J', 'W']],
    '1': [['R', 'J', 'W'], ['V', 'R', 'B']],
    '2': [['W', 'W', 'V'], ['B', 'J', 'W']],
    '3': [['R', 'R', 'J'], ['W', 'B', 'V']],
    '4': [['J', 'R', 'R'], ['J', 'R', 'B']],
    '5': [['B', 'V', 'J'], ['B', 'W', 'J']],
    '6': [['B', 'V', 'W'], ['R', 'V', 'B']],
    '7': [['J', 'R', 'V'], ['R', 'J', 'B']],
    '8': [['V', 'V', 'R'], ['R', 'B', 'B']],
    '9': [['B', 'V', 'R'], ['B', 'W', 'B']],

    ' ': [['B', 'W', 'V'], ['R', 'V', 'J']],  # Espace
    '!': [['V', 'R', 'R'], ['W', 'B', 'R']],
    '?': [['W', 'V', 'W'], ['W', 'W', 'J']],
    '.': [['W', 'R', 'W'], ['R', 'W', 'R']],
    ',': [['J', 'V', 'J'], ['B', 'W', 'R']],
    '-': [['W', 'B', 'J'], ['R', 'W', 'B']],
}


def generer_credence(message, largeur, hauteur, taille_carreau=10):
    """
    Genere une credence SVG avec un message cache.

    :param message: Le message a coder
    :param largeur: Nombre de carreaux en largeur
    :param hauteur: Nombre de carreaux en hauteur
    :param taille_carreau: Taille d'un carreau en pixels (pour le SVG)
    :return: Objet SVG
    """
    dwg = svgwrite.Drawing(size=(largeur * taille_carreau, hauteur * taille_carreau))
    dwg.viewbox(0, 0, largeur * taille_carreau, hauteur * taille_carreau)

    message = message.upper()
    trios_message = [random.choice(CODE[c]) for c in message if c in CODE]
    tiles_message = len(trios_message) * 3

    for y in range(hauteur):
        for x in range(largeur):
            tile_index = y * largeur + x
            if tile_index < tiles_message:
                lettre_index = tile_index // 3
                trio = trios_message[lettre_index]
                couleur = COULEURS[trio[tile_index % 3]]
            else:
                couleur = random.choice(list(COULEURS.values()))

            dwg.add(dwg.rect(insert=(x * taille_carreau, y * taille_carreau),
                             size=(taille_carreau, taille_carreau),
                             fill=couleur, stroke='#0f172a', stroke_width=0.8))

    return dwg

# Exemple d'utilisation
message = "lucilecamilleapollineraphaelleguillaum"
largeur, hauteur = 29, 4
dwg = generer_credence(message, largeur, hauteur)
dwg.saveas("credence.svg")
print("Fichier 'credence.svg' genere !")

