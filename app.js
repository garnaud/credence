/**
 * Table de correspondance par défaut (alphabet d'origine).
 * 42 symboles (A-Z, 0-9 et ponctuations).
 */
const DEFAULT_CODE = {
  // Lettres majuscules
  'A': [['R', 'B', 'V'], ['J', 'R', 'B']],
  'B': [['B', 'V', 'J'], ['V', 'J', 'R']],
  'C': [['V', 'J', 'B'], ['J', 'B', 'V']],
  'D': [['R', 'V', 'J'], ['B', 'R', 'V']],
  'E': [['J', 'R', 'V'], ['V', 'B', 'J']],
  'F': [['B', 'J', 'R'], ['R', 'V', 'B']],
  'G': [['V', 'B', 'R'], ['J', 'V', 'J']],
  'H': [['R', 'J', 'B'], ['B', 'V', 'R']],
  'I': [['J', 'B', 'V'], ['V', 'R', 'J']],
  'J': [['B', 'R', 'J'], ['R', 'V', 'B']],
  'K': [['V', 'J', 'R'], ['J', 'B', 'V']],
  'L': [['R', 'B', 'J'], ['B', 'J', 'V']],
  'M': [['J', 'V', 'R'], ['V', 'R', 'B']],
  'N': [['B', 'V', 'J'], ['R', 'J', 'V']],
  'O': [['V', 'R', 'B'], ['J', 'B', 'R']],
  'P': [['R', 'J', 'V'], ['B', 'V', 'J']],
  'Q': [['J', 'B', 'R'], ['V', 'R', 'J']],
  'R': [['B', 'V', 'R'], ['R', 'J', 'B']],
  'S': [['V', 'J', 'B'], ['J', 'R', 'V']],
  'T': [['R', 'V', 'J'], ['B', 'J', 'R']],
  'U': [['J', 'R', 'B'], ['V', 'B', 'J']],
  'V': [['B', 'J', 'V'], ['R', 'V', 'R']],
  'W': [['V', 'R', 'J'], ['J', 'B', 'V']],
  'X': [['R', 'B', 'J'], ['B', 'V', 'R']],
  'Y': [['J', 'V', 'B'], ['V', 'R', 'J']],
  'Z': [['B', 'R', 'V'], ['R', 'J', 'V']],

  // Chiffres
  '0': [['R', 'R', 'R'], ['B', 'B', 'B']],
  '1': [['R', 'R', 'B'], ['B', 'B', 'R']],
  '2': [['R', 'B', 'R'], ['B', 'R', 'B']],
  '3': [['B', 'R', 'R'], ['R', 'B', 'B']],
  '4': [['V', 'V', 'V'], ['J', 'J', 'J']],
  '5': [['V', 'V', 'J'], ['J', 'J', 'V']],
  '6': [['V', 'J', 'V'], ['J', 'V', 'J']],
  '7': [['J', 'V', 'V'], ['V', 'J', 'J']],
  '8': [['R', 'V', 'J'], ['B', 'J', 'V']],
  '9': [['J', 'R', 'V'], ['V', 'B', 'J']],

  // Symboles
  ' ': [['R', 'B', 'R'], ['B', 'R', 'B']],
  '!': [['J', 'J', 'R'], ['R', 'J', 'J']],
  '?': [['V', 'V', 'B'], ['B', 'V', 'V']],
  '.': [['R', 'J', 'V'], ['V', 'J', 'R']],
  ',': [['B', 'V', 'J'], ['J', 'V', 'B']],
  '-': [['R', 'B', 'J'], ['J', 'B', 'R']],
};

// Liste ordonnée immuable des 42 symboles pour la sérialisation
const ORDERED_SYMBOLS = Object.keys(DEFAULT_CODE);

// Toutes les couleurs possibles
const ALL_COLOR_KEYS = ['R', 'B', 'V', 'J', 'W'];

// Couleurs par défaut (code hexadécimal issu des RGB fournis)
const DEFAULT_COLORS = {
  'R': '#c14444', // Rouge: 193, 68, 68
  'B': '#456496', // Bleu: 69, 100, 150
  'V': '#779c90', // Vert: 119, 156, 144
  'J': '#e2d222', // Jaune: 226, 210, 34
  'W': '#e8d9d9', // Blanc: 232, 217, 217
};

const STORAGE_KEY = 'credence_custom_code_v4';
const STORAGE_MODE_KEY = 'credence_color_mode_v4';

// Mode de couleurs actif (4 ou 5)
let currentColorMode = (() => {
  try {
    const savedMode = localStorage.getItem(STORAGE_MODE_KEY);
    if (savedMode === '4') return 4;
  } catch (e) {
    // ignorer
  }
  return 5;
})();

// Renvoie la liste des couleurs actives selon le mode choisi
function getActiveColorKeys() {
  return currentColorMode === 4 ? ['R', 'B', 'V', 'J'] : ['R', 'B', 'V', 'J', 'W'];
}

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
    localStorage.setItem(STORAGE_MODE_KEY, currentColorMode.toString());
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
const colorPickersGrid = document.getElementById('color-pickers-grid');
const colorPickerW = document.getElementById('color-picker-W');
const modeButtons = document.querySelectorAll('.mode-btn');

const btnRerollNoise = document.getElementById('btn-reroll-noise');
const btnShareConfig = document.getElementById('btn-share-config');
const btnDownloadPng = document.getElementById('btn-download-png');
const btnDownloadPdf = document.getElementById('btn-download-pdf');
const btnGenerateUniqueAlphabet = document.getElementById('btn-generate-unique-alphabet');
const btnExportAlphabetPng = document.getElementById('btn-export-alphabet-png');
const btnExportAlphabetPdf = document.getElementById('btn-export-alphabet-pdf');
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
 * Affiche une notification flottante (Toast)
 */
let toastTimeout = null;
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Configure le mode 4 ou 5 couleurs
 */
function setColorMode(mode, triggerRender = true) {
  currentColorMode = mode === 4 ? 4 : 5;

  modeButtons.forEach((btn) => {
    btn.classList.toggle('active', parseInt(btn.dataset.mode, 10) === currentColorMode);
  });

  if (colorPickerW) {
    colorPickerW.classList.toggle('hidden', currentColorMode === 4);
  }
  if (colorPickersGrid) {
    colorPickersGrid.classList.toggle('mode-4', currentColorMode === 4);
  }

  // Si on passe en mode 4 couleurs, remplacer les W résiduels par R
  if (currentColorMode === 4) {
    for (const char of Object.keys(currentCode)) {
      currentCode[char] = currentCode[char].map((triplet) =>
        triplet.map((c) => (c === 'W' ? 'R' : c))
      );
    }
  }

  saveCodeToStorage();
  if (triggerRender) {
    noiseColorsCache = [];
    updateNoiseCache(300);
    render();
  }
}

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
 * Génère automatiquement un alphabet selon le mode actif :
 * - Mode 5 couleurs : 0 collision garantie (120 triplets disponibles pour 84 nécessaires)
 * - Mode 4 couleurs : 60 triplets disponibles sans répétitions unies, 24 doublons inévitables
 */
function generateUniqueAlphabet() {
  const keys = getActiveColorKeys();
  const allTriplets = [];

  for (const c1 of keys) {
    for (const c2 of keys) {
      for (const c3 of keys) {
        // Éviter les triplets 100% unis (RRR, BBB...)
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

  const needed = ORDERED_SYMBOLS.length * 2; // 84
  const selectedTriplets = [];

  // En mode 4 couleurs (60 triplets dispo), on réutilise les triplets de façon équitable
  for (let i = 0; i < needed; i++) {
    selectedTriplets.push(allTriplets[i % allTriplets.length]);
  }

  let idx = 0;
  for (const char of ORDERED_SYMBOLS) {
    currentCode[char] = [selectedTriplets[idx++], selectedTriplets[idx++]];
  }

  saveCodeToStorage();
  render();
}

/**
 * Fait défiler la couleur d'une tuile au clic selon les couleurs actives
 */
function cycleTileColor(char, variantIndex, tileIndex) {
  const currentTileColor = currentCode[char][variantIndex][tileIndex];
  const keys = getActiveColorKeys();
  const currentIdx = keys.indexOf(currentTileColor);
  const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % keys.length;

  currentCode[char][variantIndex][tileIndex] = keys[nextIdx];
  saveCodeToStorage();
  render();
}

/**
 * Sérialise l'alphabet sous forme d'une chaîne compacte de 252 caractères
 */
function serializeAlphabet(code) {
  let str = '';
  for (const sym of ORDERED_SYMBOLS) {
    const variants = code[sym] || [['R', 'B', 'V'], ['J', 'R', 'B']];
    str += variants[0].join('') + variants[1].join('');
  }
  return str;
}

/**
 * Désérialise une chaîne compacte de 252 caractères en dictionnaire d'alphabet
 */
function deserializeAlphabet(str) {
  if (!str || str.length !== ORDERED_SYMBOLS.length * 6) return null;
  const newCode = {};
  let idx = 0;
  for (const sym of ORDERED_SYMBOLS) {
    newCode[sym] = [
      [str[idx], str[idx + 1], str[idx + 2]],
      [str[idx + 3], str[idx + 4], str[idx + 5]],
    ];
    idx += 6;
  }
  return newCode;
}

/**
 * Génère le lien complet de partage encodant toute la configuration
 */
function generateShareUrl() {
  const msg = messageInput.value;
  const w = largeurInput.value;
  const h = hauteurInput.value;
  const colors = getCurrentColors();
  const keys = getActiveColorKeys();
  const colStr = keys.map((k) => colors[k].replace('#', '')).join('_');
  const alphaStr = serializeAlphabet(currentCode);

  const params = new URLSearchParams();
  params.set('msg', msg);
  params.set('w', w);
  params.set('h', h);
  params.set('c', currentColorMode.toString());
  params.set('col', colStr);
  params.set('a', alphaStr);

  return `${window.location.origin}${window.location.pathname}#${params.toString()}`;
}

/**
 * Copie le lien de partage dans le presse-papier
 */
function copyShareUrl() {
  const shareUrl = generateShareUrl();

  // Mise à jour de l'URL dans la barre d'adresse sans recharger
  history.replaceState(null, '', shareUrl);

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('🔗 Lien de partage copié dans le presse-papier !');
    } catch (e) {
      prompt('Copiez ce lien pour partager la configuration :', text);
    }
    document.body.removeChild(textarea);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('🔗 Lien de partage copié dans le presse-papier !');
    }).catch(() => {
      fallbackCopy(shareUrl);
    });
  } else {
    fallbackCopy(shareUrl);
  }
}

/**
 * Charge une configuration depuis l'URL (hash ou search params)
 */
function loadConfigFromUrl() {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : '';
  const search = window.location.search.startsWith('?') ? window.location.search.substring(1) : '';
  const queryString = hash || search;

  if (!queryString) return false;

  const params = new URLSearchParams(queryString);
  if (!params.has('msg') && !params.has('a') && !params.has('w')) return false;

  try {
    if (params.has('msg')) {
      messageInput.value = params.get('msg');
    }
    if (params.has('w')) {
      largeurInput.value = params.get('w');
    }
    if (params.has('h')) {
      hauteurInput.value = params.get('h');
    }
    if (params.has('c')) {
      const mode = parseInt(params.get('c'), 10) === 4 ? 4 : 5;
      setColorMode(mode, false);
    }
    if (params.has('col')) {
      const colParts = params.get('col').split('_');
      const keys = getActiveColorKeys();
      colParts.forEach((hex, idx) => {
        if (idx < keys.length && colorInputs[keys[idx]]) {
          colorInputs[keys[idx]].value = `#${hex}`;
        }
      });
    }
    if (params.has('a')) {
      const deserialized = deserializeAlphabet(params.get('a'));
      if (deserialized) {
        currentCode = deserialized;
        saveCodeToStorage();
      }
    }
    showToast('✨ Configuration partagée chargée avec succès !', 4000);
    return true;
  } catch (e) {
    console.warn('Erreur lors du décodage de la configuration URL', e);
    return false;
  }
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
      showToast('Alphabet importé avec succès !');
    } catch (err) {
      alert(`Erreur lors de l'import : ${err.message}`);
    }
    importAlphabetFile.value = '';
  };
  reader.readAsText(file);
}

/**
 * Met à jour le bruit aléatoire pour les cases décoratives restantes
 */
function updateNoiseCache(neededCount) {
  const keys = getActiveColorKeys();
  if (noiseColorsCache.length < neededCount) {
    while (noiseColorsCache.length < neededCount) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
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
  } else if (currentColorMode === 4) {
    alphabetCollisionBadge.className = 'alphabet-status-badge badge-danger';
    alphabetCollisionBadge.innerHTML = `⚠️ ${collisionCount} doublon(s) (inévitable en 4 couleurs : 64 combinaisons max pour 84 variantes)`;
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
        tile.title = `Couleur : ${colorCode} — Cliquer pour changer`;
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
      <div>Aucun message encodé : la crédence est un motif décoratif aléatoire.</div>
    `;
  } else if (tilesNeeded > totalTiles) {
    const overflowChars = validCharsCount - capacity;
    capacityAlert.className = 'alert alert-danger';
    capacityAlert.innerHTML = `
      <span class="alert-icon">⚠️</span>
      <div>Message trop long : ${tilesNeeded} carreaux requis pour ${totalTiles} disponibles (${overflowChars} caractère(s) tronqué(s)).</div>
    `;
  } else if (tilesNeeded < totalTiles) {
    const remainingTiles = totalTiles - tilesNeeded;
    capacityAlert.className = 'alert alert-warning';
    capacityAlert.innerHTML = `
      <span class="alert-icon">ℹ️</span>
      <div>${tilesNeeded} carreaux utilisés sur ${totalTiles} (${remainingTiles} carreaux décoratifs aléatoires).</div>
    `;
  } else {
    capacityAlert.className = 'alert alert-success';
    capacityAlert.innerHTML = `
      <span class="alert-icon">✅</span>
      <div>Format idéal : le message remplit exactement les ${totalTiles} carreaux (${validCharsCount} caractères × 3) !</div>
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
  const activeKeys = getActiveColorKeys();

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
      colorKey = noiseColorsCache[noiseIndex] || activeKeys[0];
    }

    const fillHex = colors[colorKey] || '#999';
    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;

    rectsSvg += `<rect x="${x}" y="${y}" width="${tailleCarreau}" height="${tailleCarreau}" fill="${fillHex}" stroke="#0f172a" stroke-width="0.8"/>`;
  }

  // Affichage du compteur de chaque couleur active
  const colorNames = {
    'R': 'Rouge (R)',
    'B': 'Bleu (B)',
    'V': 'Vert (V)',
    'J': 'Jaune (J)',
    'W': 'Blanc (W)',
  };

  colorCountsContainer.innerHTML = activeKeys.map((key) => {
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
 * Génère un document PDF 1.4 valide encapsulant une image JPEG
 */
function createPdfBlobFromJpeg(jpegBytes, imgW, imgH) {
  const isLandscape = imgW > imgH;
  const pageW = isLandscape ? 841.89 : 595.28;
  const pageH = isLandscape ? 595.28 : 841.89;
  const margin = 36; // Marges de 0.5 pouce

  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;

  const ratio = Math.min(maxW / imgW, maxH / imgH);
  const drawW = Math.round(imgW * ratio);
  const drawH = Math.round(imgH * ratio);
  const drawX = Math.round((pageW - drawW) / 2);
  const drawY = Math.round((pageH - drawH) / 2);

  const contentStream = `q ${drawW} 0 0 ${drawH} ${drawX} ${drawY} cm /Im0 Do Q`;
  const header = '%PDF-1.4\n';
  const body = [];
  const offsets = [];

  function addObj(str, streamBytes = null) {
    let currentLength = header.length;
    for (const b of body) {
      currentLength += (typeof b === 'string' ? new TextEncoder().encode(b).length : b.byteLength);
    }
    offsets.push(currentLength);
    body.push(str + '\n');
    if (streamBytes) {
      body.push(streamBytes);
      body.push('\nendstream\nendobj\n');
    } else {
      body.push('endobj\n');
    }
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>');
  addObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  addObj(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  addObj(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.byteLength} >>\nstream\n`, jpegBytes);
  addObj(`5 0 obj\n<< /Length ${new TextEncoder().encode(contentStream).length} >>\nstream\n${contentStream}\nendstream\nendobj\n`);

  let currentLength = header.length;
  for (const b of body) {
    currentLength += (typeof b === 'string' ? new TextEncoder().encode(b).length : b.byteLength);
  }
  const startxref = currentLength;

  let xref = `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += off.toString().padStart(10, '0') + ' 00000 n \n';
  }
  const trailer = `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  return new Blob([header, ...body, xref, trailer], { type: 'application/pdf' });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function canvasToPdfBlob(canvas) {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return createPdfBlobFromJpeg(bytes, canvas.width, canvas.height);
}

/**
 * Export de la crédence en PNG ou PDF
 */
function exportCredence(format) {
  const svgElement = svgContainer.querySelector('svg');
  if (!svgElement) return;

  const svgStr = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  img.onload = () => {
    const scale = 3;
    const w = (parseInt(svgElement.getAttribute('width'), 10) || 300) * scale;
    const h = (parseInt(svgElement.getAttribute('height'), 10) || 100) * scale;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);

    const safeName = (messageInput.value.trim() || 'credence').toLowerCase().replace(/[^a-z0-9]/g, '_');

    if (format === 'png') {
      canvas.toBlob((blob) => {
        downloadBlob(blob, `credence_${safeName}.png`);
      }, 'image/png');
    } else if (format === 'pdf') {
      const pdfBlob = canvasToPdfBlob(canvas);
      downloadBlob(pdfBlob, `credence_${safeName}.pdf`);
    }
  };
  img.src = url;
}

/**
 * Export de l'alphabet complet en PNG ou PDF (fiche A4 imprimable)
 */
function exportAlphabet(format) {
  const colors = getCurrentColors();
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // En-tête
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Table de correspondance des symboles - Crédence Magique', 50, 65);

  ctx.fillStyle = '#475569';
  ctx.font = '15px sans-serif';
  ctx.fillText(`Mode ${currentColorMode} couleurs — Chaque symbole possède 2 variantes de triplets (3 carreaux colorés)`, 50, 95);

  // Légende des couleurs actives
  const activeKeys = getActiveColorKeys();
  const allLabels = {
    'R': 'Rouge (R)',
    'B': 'Bleu (B)',
    'V': 'Vert (V)',
    'J': 'Jaune (J)',
    'W': 'Blanc (W)',
  };

  let legendX = 50;
  ctx.font = '13px sans-serif';
  activeKeys.forEach((k) => {
    ctx.fillStyle = colors[k];
    ctx.fillRect(legendX, 115, 18, 18);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, 115, 18, 18);

    ctx.fillStyle = '#0f172a';
    ctx.fillText(allLabels[k], legendX + 26, 129);
    legendX += 160;
  });

  // Ligne de séparation
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(50, 148);
  ctx.lineTo(1190, 148);
  ctx.stroke();

  // Grille des 42 symboles (6 colonnes × 7 lignes)
  const symbols = ORDERED_SYMBOLS;
  const colWidth = 190;
  const rowHeight = 210;
  const startX = 50;
  const startY = 165;

  symbols.forEach((char, index) => {
    const col = index % 6;
    const row = Math.floor(index / 6);
    const cellX = startX + col * colWidth + 6;
    const cellY = startY + row * rowHeight;
    const cellW = 178;
    const cellH = 195;

    // Cadre de la cellule
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cellX, cellY, cellW, cellH);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(cellX, cellY, cellW, cellH);

    // Titre du symbole
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    const displayChar = char === ' ' ? '␣ Espace' : char;
    ctx.fillText(displayChar, cellX + cellW / 2, cellY + 36);

    const variants = currentCode[char] || [];
    const tileSize = 28;
    const tileGap = 4;
    const startTileX = cellX + 38;

    // Variante 1
    const v1Y = cellY + 65;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('v1', cellX + 12, v1Y + 19);

    if (variants[0]) {
      variants[0].forEach((colorKey, tIdx) => {
        const tx = startTileX + tIdx * (tileSize + tileGap);
        ctx.fillStyle = colors[colorKey] || '#999';
        ctx.fillRect(tx, v1Y, tileSize, tileSize);
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.strokeRect(tx, v1Y, tileSize, tileSize);

        ctx.fillStyle = getContrastTextColor(colorKey);
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(colorKey, tx + tileSize / 2, v1Y + 19);
      });
    }

    // Variante 2
    const v2Y = cellY + 120;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('v2', cellX + 12, v2Y + 19);

    if (variants[1]) {
      variants[1].forEach((colorKey, tIdx) => {
        const tx = startTileX + tIdx * (tileSize + tileGap);
        ctx.fillStyle = colors[colorKey] || '#999';
        ctx.fillRect(tx, v2Y, tileSize, tileSize);
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.strokeRect(tx, v2Y, tileSize, tileSize);

        ctx.fillStyle = getContrastTextColor(colorKey);
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(colorKey, tx + tileSize / 2, v2Y + 19);
      });
    }
  });

  // Pied de page
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Crédence Magique — https://garnaud.github.io/credence/', canvas.width / 2, 1720);

  if (format === 'png') {
    canvas.toBlob((blob) => {
      downloadBlob(blob, 'alphabet_credence.png');
    }, 'image/png');
  } else if (format === 'pdf') {
    const pdfBlob = canvasToPdfBlob(canvas);
    downloadBlob(pdfBlob, 'alphabet_credence.pdf');
  }
}

// Écouteurs d'événements pour le mode 4 ou 5 couleurs
modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = parseInt(btn.dataset.mode, 10);
    setColorMode(mode, true);
  });
});

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
btnShareConfig.addEventListener('click', copyShareUrl);
btnDownloadPng.addEventListener('click', () => exportCredence('png'));
btnDownloadPdf.addEventListener('click', () => exportCredence('pdf'));
btnGenerateUniqueAlphabet.addEventListener('click', generateUniqueAlphabet);
btnExportAlphabetPng.addEventListener('click', () => exportAlphabet('png'));
btnExportAlphabetPdf.addEventListener('click', () => exportAlphabet('pdf'));
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

// Initialisation au chargement (vérification de configuration partagée dans l'URL)
const loadedFromUrl = loadConfigFromUrl();
if (!loadedFromUrl) {
  setColorMode(currentColorMode, false);
}
rerollAllRandomness();
