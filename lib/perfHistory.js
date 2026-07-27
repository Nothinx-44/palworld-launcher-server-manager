const path = require('path');
const { execFile } = require('child_process');
const { getPalworldApi } = require('./palworldClient');
const { readJson, updateJson } = require('./jsonStore');
const { DATA_DIR } = require('./paths');

// Historique de performances serveur : échantillonne le FPS serveur (API /v1/api/metrics) et la
// mémoire du process de jeu à intervalle régulier (5 min par défaut), pour tracer les courbes
// « Performances serveur » (24 h / 7 j). Les serveurs Palworld gonflent en mémoire avec le temps :
// suivre la RAM aide à repérer une dérive avant les lags/crashs.
// Un point = { t: epoch ms, fps: nombre|null, mem: Mo|null }. null = donnée indisponible
// (serveur injoignable ou process absent) → trou dans la courbe plutôt qu'un faux zéro.
const PERF_FILE = path.join(DATA_DIR, 'perf-history.json');
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours à 5 min ≈ 2016 points : négligeable

// Le port du jeu est réellement ouvert par l'enfant PalServer-Win64-Shipping-Cmd.exe (voir
// palworldClient.killOrphanGameProcesses) : c'est SA mémoire qui reflète la charge du serveur.
const GAME_PROC = 'PalServer-Win64-Shipping-Cmd.exe';

const emptyStore = () => ({ points: [] });

// Mémoire (Mo) du process de jeu via tasklist. Sortie CSV sans en-tête ; le dernier champ est
// l'usage mémoire "5 432 100 K". Renvoie null si le process est absent (serveur éteint) ou en cas
// d'erreur — jamais d'exception vers l'appelant.
function gameMemoryMb() {
  return new Promise(resolve => {
    execFile('tasklist', ['/FI', `IMAGENAME eq ${GAME_PROC}`, '/FO', 'CSV', '/NH'], (err, stdout) => {
      if (err || !stdout || !stdout.includes(GAME_PROC)) return resolve(null);
      // Dernière colonne entre guillemets : "5 432 100 K" (séparateur de milliers selon la locale).
      const m = stdout.match(/"([\d.,\s ]+)\s*K"\s*$/m);
      if (!m) return resolve(null);
      const kb = parseInt(m[1].replace(/[^\d]/g, ''), 10);
      resolve(Number.isFinite(kb) ? Math.round(kb / 1024) : null);
    });
  });
}

async function sample() {
  let fps = null;
  try {
    const res = await getPalworldApi().get('/v1/api/metrics');
    if (res.status === 200 && res.data && res.data.serverfps != null) fps = res.data.serverfps;
  } catch { /* serveur injoignable : fps reste null */ }
  const mem = await gameMemoryMb();

  const now = Date.now();
  await updateJson(PERF_FILE, emptyStore(), store => {
    if (!store.points) store.points = [];
    store.points.push({ t: now, fps, mem });
    const cutoff = now - RETENTION_MS;
    const firstKept = store.points.findIndex(p => p.t >= cutoff);
    if (firstKept > 0) store.points = store.points.slice(firstKept);
  }).catch(err => console.error("Écriture de l'historique de performances échouée:", err.message || err));
}

function points(windowMs = RETENTION_MS) {
  const cutoff = Date.now() - Math.min(windowMs, RETENTION_MS);
  return (readJson(PERF_FILE, emptyStore()).points || []).filter(p => p.t >= cutoff);
}

function start(intervalMs = 5 * 60 * 1000) {
  sample();
  setInterval(sample, intervalMs);
}

module.exports = { start, sample, points, PERF_FILE, RETENTION_MS };
