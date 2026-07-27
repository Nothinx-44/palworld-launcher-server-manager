const path = require('path');
const { readJson, updateJson } = require('./jsonStore');
const { DATA_DIR } = require('./paths');

// Notes de modération attachées à un joueur (par UserId) : un admin peut y consigner « griefer,
// à surveiller », etc. Persistées à part du reste — data/player-notes.json = { [userId]: entry }.
// Une entrée = { note, updatedAt, by }. Réservé aux managers côté serveur (info sensible).
const NOTES_FILE = path.join(DATA_DIR, 'player-notes.json');
const MAX_LEN = 500;

function get(userId) {
  const all = readJson(NOTES_FILE, {});
  return all[userId] || null;
}

function all() {
  return readJson(NOTES_FILE, {});
}

// note vide/espaces => suppression de l'entrée (permet d'effacer une note). Renvoie l'entrée
// enregistrée (ou null si effacée).
async function set(userId, note, by) {
  const trimmed = String(note || '').slice(0, MAX_LEN).trim();
  let saved = null;
  await updateJson(NOTES_FILE, {}, store => {
    if (!trimmed) { delete store[userId]; return; }
    saved = { note: trimmed, updatedAt: Date.now(), by };
    store[userId] = saved;
  });
  return saved;
}

module.exports = { get, all, set, NOTES_FILE, MAX_LEN };
