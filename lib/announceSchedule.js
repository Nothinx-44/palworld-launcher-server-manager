const path = require('path');
const { readJson, writeJson } = require('./jsonStore');
const { DATA_DIR } = require('./paths');

// Annonces récurrentes : diffuse automatiquement des messages en jeu à intervalle régulier
// (rappel des règles, event, lien Discord…). Les messages tournent en boucle (un par tick) pour
// ne pas spammer les joueurs avec tout d'un coup. Ne diffuse que si le serveur est joignable.
// Config = { enabled, intervalMinutes, messages: [texte, …] }.
const FILE = path.join(DATA_DIR, 'announce-schedule.json');

function defaults() {
  return { enabled: false, intervalMinutes: 30, messages: [] };
}

function normalize(cfg = {}) {
  const messages = Array.isArray(cfg.messages)
    ? cfg.messages.map(m => String(m || '').replace(/[\r\n]+/g, ' ').trim()).filter(Boolean).slice(0, 20)
    : [];
  return {
    // Désactivé de fait s'il n'y a aucun message, quelle que soit la case (évite un intervalle qui
    // tourne à vide).
    enabled: !!cfg.enabled && messages.length > 0,
    intervalMinutes: Math.max(5, Math.min(1440, parseInt(cfg.intervalMinutes, 10) || 30)),
    messages
  };
}

function load() {
  return normalize(readJson(FILE, defaults()));
}

function save(cfg) {
  const normalized = normalize(cfg);
  writeJson(FILE, normalized);
  return normalized;
}

module.exports = { load, save, normalize, defaults, FILE };
