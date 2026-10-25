/**
 * Table de correspondance par défaut (alphabet aléatoire garanti 0 collision parmi les 5 couleurs).
 * 42 symboles (A-Z, 0-9 et ponctuations) codés par 84 triplets uniques.
 */
const DEFAULT_CODE = {
  // Lettres majuscules
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

  // Chiffres
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

  // Symboles
  ' ': [['B', 'W', 'V'], ['R', 'V', 'J']],
  '!': [['V', 'R', 'R'], ['W', 'B', 'R']],
  '?': [['W', 'V', 'W'], ['W', 'W', 'J']],
  '.': [['W', 'R', 'W'], ['R', 'W', 'R']],
  ',': [['J', 'V', 'J'], ['B', 'W', 'R']],
  '-': [['W', 'B', 'J'], ['R', 'W', 'B']],
};

// Les 5 couleurs de travail
const COLOR_KEYS = ['R', 'B', 'V', 'J', 'W'];

// Couleurs par défaut (code hexadécimal issu des RGB fournis)
const DEFAULT_COLORS = {
  'R': '#c14444', // Rouge: 193, 68, 68
  'B': '#456496', // Bleu: 69, 100, 150
  'V': '#779c90', // Vert: 119, 156, 144
  'J': '#e2d222', // Jaune: 226, 210, 34
  'W': '#e8d9d9', // Blanc: 232, 217, 217
};

const STORAGE_KEY = 'credence_custom_code_v3';

// Chargement de l'alphabet actuel (persistance localStorage ou par défaut)
let currentCode = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null && 'A' in parsed) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Impossible de charger le code personnalisé depuis localStorage', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CODE));
})();

// Sauvegarde dans localStorage
function saveCodeToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCode));
  } catch (e) {
    console.warn('Échec de la sauvegarde dans localStorage', e);
  }
}

// Taille fixe d'un carreau en pixels
const TAILLE_CARREAU = 24;

// Éléments du DOM
const messageInput = document.getElementById('message-input');
const largeurInput = document.getElementById('largeur-input');
const hauteurInput = document.getElementById('hauteur-input');
const capacityAlert = document.getElementById('capacity-alert');
const svgContainer = document.getElementById('svg-container');
const statsBadge = document.getElementById('stats-badge');
const colorCountsContainer = document.getElementById('color-counts');
const alphabetGrid = document.getElementById('alphabet-grid');
const alphabetCollisionBadge = document.getElementById('alphabet-collision-badge');
const alphabetSearchInput = document.getElementById('alphabet-search');

const btnRerollNoise = document.getElementById('btn-reroll-noise');
const btnDownloadSvg = document.getElementById('btn-download-svg');
const btnGenerateUniqueAlphabet = document.getElementById('btn-generate-unique-alphabet');
const btnExportAlphabet = document.getElementById('btn-export-alphabet');
const importAlphabetFile = document.getElementById('import-alphabet-file');

const colorInputs = {
  'R': document.getElementById('color-R'),
  'B': document.getElementById('color-B'),
  'V': document.getElementById('color-V'),
  'J': document.getElementById('color-J'),
  'W': document.getElementById('color-W'),
};

// Cache des choix aléatoires (variante par lettre et bruit de fond)
let messageVariantsCache = [];
let noiseColorsCache = [];
let lastMessage = '';

/**
 * Récupère les couleurs actuelles depuis les color pickers
 */
function getCurrentColors() {
  return {
    'R': colorInputs['R'].value,
    'B': colorInputs['B'].value,
    'V': colorInputs['V'].value,
    'J': colorInputs['J'].value,
    'W': colorInputs['W'].value,
  };
}

/**
 * Couleur de texte adaptée (contraste clair/sombre pour les lettres dans les tuiles)
 */
function getContrastTextColor(colorKey) {
  return (colorKey === 'J' || colorKey === 'W') ? '#0f172a' : '#ffffff';
}

/**
 * Analyse et détecte les doublons de triplets dans l'ensemble de l'alphabet
 */
function detectCollisions(code) {
  const usage = new Map(); // "R-B-V" -> [ { char, variantIndex } ]

  for (const [char, variants] of Object.entries(code)) {
    variants.forEach((triplet, vIdx) => {
      const key = triplet.join('-');
      if (!usage.has(key)) usage.set(key, []);
      usage.get(key).push({ char, variantIndex: vIdx });
    });
  }

  const conflictMap = new Map(); // "char:vIdx" -> string
  let collisionCount = 0;

  for (const [, list] of usage.entries()) {
    if (list.length > 1) {
      collisionCount += (list.length - 1);
      list.forEach((item) => {
        const id = `${item.char}:${item.variantIndex}`;
        const others = list
          .filter((other) => !(other.char === item.char && other.variantIndex === item.variantIndex))
          .map((other) => `'${other.char === ' ' ? 'Espace' : other.char}' (v${other.variantIndex + 1})`);
        conflictMap.set(id, `Doublon avec ${others.join(', ')}`);
      });
    }
  }

  return { conflictMap, collisionCount };
}

/**
 * Génère automatiquement un alphabet sans AUCUNE collision en utilisant les 5 couleurs.
 * 5^3 = 125 combinaisons. On élimine les 5 triplets uniformes (RRR, BBB...), il reste 120 triplets.
 * On en tire 84 aléatoirement (42 symboles × 2 variantes).
 */
function generateUniqueAlphabet() {
  const allTriplets = [];

  for (const c1 of COLOR_KEYS) {
    for (const c2 of COLOR_KEYS) {
      for (const c3 of COLOR_KEYS) {
        // Option esthétique : éviter les triplets 100% unis (ex: RRR, BBB...)
        if (c1 === c2 && c2 === c3) continue;
        allTriplets.push([c1, c2, c3]);
      }
    }
  }

  // Mélange de Fisher-Yates
  for (let i = allTriplets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTriplets[i], allTriplets[j]] = [allTriplets[j], allTriplets[i]];
  }

  let idx = 0;
  for (const char of Object.keys(currentCode)) {
    currentCode[char] = [allTriplets[idx++], allTriplets[idx++]];
  }

  saveCodeToStorage();
  render();
}

/**
 * Fait défiler la couleur d'une tuile au clic (R -> B -> V -> J -> W -> R)
 */
function cycleTileColor(char, variantIndex, tileIndex) {
  const currentTileColor = currentCode[char][variantIndex][tileIndex];
  const currentIdx = COLOR_KEYS.indexOf(currentTileColor);
  const nextIdx = (currentIdx + 1) % COLOR_KEYS.length;

  currentCode[char][variantIndex][tileIndex] = COLOR_KEYS[nextIdx];
  saveCodeToStorage();
  render();
}

/**
 * Exporte la table des codes en fichier JSON
 */
function exportAlphabetJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentCode, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'alphabet_credence.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Importe une table depuis un fichier JSON
 */
function importAlphabetJson(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (typeof parsed !== 'object' || parsed === null || !('A' in parsed)) {
        throw new Error('Structure JSON non reconnue pour un alphabet de crédence.');
      }
      currentCode = parsed;
      saveCodeToStorage();
      render();
      alert('Alphabet importé avec succès !');
    } catch (err) {
      alert(`Erreur lors de l'import : ${err.message}`);
    }
    // Réinitialiser le champ pour permettre de réimporter le même fichier
    importAlphabetFile.value = '';
  };
  reader.readAsText(file);
}

/**
 * Met à jour le bruit aléatoire pour les cases décoratives restantes
 */
function updateNoiseCache(neededCount) {
  if (noiseColorsCache.length < neededCount) {
    while (noiseColorsCache.length < neededCount) {
      const randomKey = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
      noiseColorsCache.push(randomKey);
    }
  }
}

/**
 * Régénère complètement les tirages aléatoires (variantes de lettres et fond)
 */
function rerollAllRandomness() {
  const message = messageInput.value.toUpperCase();
  messageVariantsCache = [];
  for (let i = 0; i < message.length; i++) {
    messageVariantsCache.push(Math.random() < 0.5 ? 0 : 1);
  }
  noiseColorsCache = [];
  updateNoiseCache(300);
  render();
}

/**
 * Construit et injecte le tableau de correspondance de l'alphabet avec détection de doublons
 */
function renderAlphabetTable(colors, currentMessage) {
  alphabetGrid.innerHTML = '';
  const currentChars = new Set(currentMessage.toUpperCase().split(''));
  const searchQuery = (alphabetSearchInput.value || '').trim().toUpperCase();

  const { conflictMap, collisionCount } = detectCollisions(currentCode);

  // Mise à jour du badge de collision global
  if (collisionCount === 0) {
    alphabetCollisionBadge.className = 'alphabet-status-badge badge-success';
    alphabetCollisionBadge.innerHTML = '✅ 0 doublon : tous les 84 triplets sont uniques';
  } else {
    alphabetCollisionBadge.className = 'alphabet-status-badge badge-danger';
    alphabetCollisionBadge.innerHTML = `⚠️ ${collisionCount} doublon(s) détecté(s)`;
  }

  for (const [char, variants] of Object.entries(currentCode)) {
    // Filtrage par recherche
    const displayChar = char === ' ' ? '␣ ESPACE' : char;
    if (searchQuery && !displayChar.includes(searchQuery)) {
      continue;
    }

    const hasConflict = conflictMap.has(`${char}:0`) || conflictMap.has(`${char}:1`);

    const item = document.createElement('div');
    item.className = 'alphabet-item' +
      (currentChars.has(char) ? ' active' : '') +
      (hasConflict ? ' has-collision' : '');

    const charTitle = document.createElement('div');
    charTitle.className = 'alphabet-char';
    charTitle.textContent = char === ' ' ? '␣ Espace' : char;
    item.appendChild(charTitle);

    const variantsContainer = document.createElement('div');
    variantsContainer.className = 'alphabet-variants';

    variants.forEach((variant, vIdx) => {
      const variantWrapper = document.createElement('div');
      variantWrapper.className = 'variant-wrapper';

      const row = document.createElement('div');
      row.className = 'variant-row';

      const label = document.createElement('span');
      label.className = 'variant-label';
      label.textContent = `v${vIdx + 1}`;
      row.appendChild(label);

      const tilesGroup = document.createElement('div');
      tilesGroup.className = 'variant-tiles';

      variant.forEach((colorCode, tIdx) => {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'trio-tile';
        tile.style.backgroundColor = colors[colorCode] || '#ccc';
        tile.style.color = getContrastTextColor(colorCode);
        tile.textContent = colorCode;
        tile.title = `Couleur : ${colorCode} — Cliquer pour faire défiler (R, B, V, J, W)`;
        tile.addEventListener('click', (e) => {
          e.stopPropagation();
          cycleTileColor(char, vIdx, tIdx);
        });
        tilesGroup.appendChild(tile);
      });

      row.appendChild(tilesGroup);
      variantWrapper.appendChild(row);

      // Alerte de conflit spécifique pour cette variante
      const conflictId = `${char}:${vIdx}`;
      if (conflictMap.has(conflictId)) {
        const warning = document.createElement('div');
        warning.className = 'collision-pill';
        const conflictText = conflictMap.get(conflictId);
        warning.textContent = `⚠️ ${conflictText}`;
        warning.title = conflictText;
        variantWrapper.appendChild(warning);
      }

      variantsContainer.appendChild(variantWrapper);
    });

    item.appendChild(variantsContainer);
    alphabetGrid.appendChild(item);
  }
}

/**
 * Met à jour le message d'alerte et de capacité
 */
function updateCapacityIndicator(messageLen, validCharsCount, totalTiles, capacity) {
  const tilesNeeded = validCharsCount * 3;

  if (tilesNeeded === 0) {
    capacityAlert.className = 'alert alert-warning';
    capacityAlert.innerHTML = `
      <span class="alert-icon">ℹ️</span>
      <div>
        <strong>Aucun message encodé :</strong> La crédence sera entièrement remplie d'un motif décoratif parmi vos 5 couleurs.
      </div>
    `;
  } else if (tilesNeeded > totalTiles) {
    const overflowChars = validCharsCount - capacity;
    capacityAlert.className = 'alert alert-danger';
    capacityAlert.innerHTML = `
      <span class="alert-icon">⚠️</span>
      <div>
        <strong>Message trop long :</strong> Nécessite <strong>${tilesNeeded} carreaux</strong> (${validCharsCount} caractères × 3), or la crédence n'en possède que <strong>${totalTiles}</strong> (capacité maximale : <strong>${capacity} caractères</strong>). Les ${overflowChars} dernier(s) caractère(s) seront tronqués.
      </div>
    `;
  } else if (tilesNeeded < totalTiles) {
    const remainingTiles = totalTiles - tilesNeeded;
    capacityAlert.className = 'alert alert-warning';
    capacityAlert.innerHTML = `
      <span class="alert-icon">ℹ️</span>
      <div>
        <strong>Message plus court que la crédence :</strong> Le message utilise <strong>${tilesNeeded} carreaux</strong> sur <strong>${totalTiles}</strong> disponibles. Les <strong>${remainingTiles} carreaux restants</strong> sont complétés aléatoirement avec vos 5 couleurs.
      </div>
    `;
  } else {
    capacityAlert.className = 'alert alert-success';
    capacityAlert.innerHTML = `
      <span class="alert-icon">✅</span>
      <div>
        <strong>Format idéal :</strong> Le message remplit exactement l'intégralité des <strong>${totalTiles} carreaux</strong> de la crédence (${validCharsCount} caractères × 3) !
      </div>
    `;
  }

  statsBadge.innerHTML = `
    <span>Total carreaux : <strong>${totalTiles}</strong></span>
    <span>Carreaux message : <strong>${Math.min(tilesNeeded, totalTiles)}</strong></span>
    <span>Carreaux décoratifs : <strong>${Math.max(0, totalTiles - tilesNeeded)}</strong></span>
    <span>Capacité max : <strong>${capacity} lettres</strong></span>
  `;
}

/**
 * Génère le SVG de la crédence
 */
function render() {
  const rawMessage = messageInput.value.toUpperCase();
  const largeur = Math.max(1, parseInt(largeurInput.value, 10) || 29);
  const hauteur = Math.max(1, parseInt(hauteurInput.value, 10) || 4);
  const tailleCarreau = TAILLE_CARREAU;

  const colors = getCurrentColors();
  const totalTiles = largeur * hauteur;
  const capacity = Math.floor(totalTiles / 3);

  // Filtrer les caractères valides
  const validChars = [];
  for (const c of rawMessage) {
    if (c in currentCode) {
      validChars.push(c);
    }
  }

  // Mettre à jour le cache des variantes si le message change
  if (rawMessage !== lastMessage) {
    while (messageVariantsCache.length < validChars.length) {
      messageVariantsCache.push(Math.random() < 0.5 ? 0 : 1);
    }
    lastMessage = rawMessage;
  }

  // Mettre à jour le cache de bruit si la taille change
  updateNoiseCache(totalTiles);

  // Mettre à jour l'indicateur de capacité
  updateCapacityIndicator(rawMessage.length, validChars.length, totalTiles, capacity);

  // Mettre à jour le tableau alphabet
  renderAlphabetTable(colors, rawMessage);

  // Construction du SVG et comptage des couleurs
  const svgWidth = largeur * tailleCarreau;
  const svgHeight = hauteur * tailleCarreau;

  let rectsSvg = '';
  const tilesForMessage = validChars.length * 3;
  const colorCounts = { 'R': 0, 'B': 0, 'V': 0, 'J': 0, 'W': 0 };

  for (let i = 0; i < totalTiles; i++) {
    const x = (i % largeur) * tailleCarreau;
    const y = Math.floor(i / largeur) * tailleCarreau;

    let colorKey;
    if (i < tilesForMessage) {
      const charIndex = Math.floor(i / 3);
      const char = validChars[charIndex];
      const variantIndex = messageVariantsCache[charIndex] || 0;
      const trio = currentCode[char][variantIndex];
      colorKey = trio[i % 3];
    } else {
      const noiseIndex = i - tilesForMessage;
      colorKey = noiseColorsCache[noiseIndex] || 'W';
    }

    const fillHex = colors[colorKey] || '#999';
    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;

    rectsSvg += `<rect x="${x}" y="${y}" width="${tailleCarreau}" height="${tailleCarreau}" fill="${fillHex}" stroke="#0f172a" stroke-width="0.8"/>`;
  }

  // Affichage du compteur de chaque couleur
  const colorNames = {
    'R': 'Rouge (R)',
    'B': 'Bleu (B)',
    'V': 'Vert (V)',
    'J': 'Jaune (J)',
    'W': 'Blanc (W)',
  };

  colorCountsContainer.innerHTML = Object.keys(DEFAULT_COLORS).map((key) => {
    const count = colorCounts[key] || 0;
    const pct = totalTiles > 0 ? Math.round((count / totalTiles) * 100) : 0;
    return `
      <div class="color-count-pill">
        <div class="count-swatch" style="background-color: ${colors[key]}"></div>
        <div class="count-info">
          <span class="count-name">${colorNames[key]}</span>
          <span class="count-val">${count} <small>(${pct}%)</small></span>
        </div>
      </div>
    `;
  }).join('');

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 ${svgWidth} ${svgHeight}"
         width="${svgWidth}"
         height="${svgHeight}">
      ${rectsSvg}
    </svg>
  `;

  svgContainer.innerHTML = svgContent;
}

/**
 * Téléchargement du fichier SVG généré
 */
function downloadSvg() {
  const svgElement = svgContainer.querySelector('svg');
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  const source = '<?xml version="1.0" encoding="utf-8" standalone="no"?>\r\n' + serializer.serializeToString(svgElement);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `credence_${messageInput.value || 'sans-titre'}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

// Écouteurs d'événements pour la mise à jour en temps réel
[messageInput, largeurInput, hauteurInput].forEach((input) => {
  input.addEventListener('input', render);
});

Object.values(colorInputs).forEach((picker) => {
  picker.addEventListener('input', render);
});

alphabetSearchInput.addEventListener('input', () => {
  renderAlphabetTable(getCurrentColors(), messageInput.value);
});

btnRerollNoise.addEventListener('click', rerollAllRandomness);
btnDownloadSvg.addEventListener('click', downloadSvg);
btnGenerateUniqueAlphabet.addEventListener('click', generateUniqueAlphabet);
btnExportAlphabet.addEventListener('click', exportAlphabetJson);
importAlphabetFile.addEventListener('change', importAlphabetJson);

// Enregistrement du Service Worker PWA (support hors-ligne)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('Service Worker non enregistré (normal en local sans HTTPS) :', err);
    });
  });
}

// Initialisation au chargement
rerollAllRandomness();
