const { getPalworldApi, runNssm, isServiceRunning, getServiceName, killOrphanGameProcesses } = require('./palworldClient');
const discord = require('./discord');
const activityLog = require('./activityLog');

const FAIL_THRESHOLD = parseInt(process.env.WATCHDOG_FAIL_THRESHOLD || '3', 10);
const CHECK_INTERVAL_MS = parseInt(process.env.WATCHDOG_INTERVAL_MS || '60000', 10);
// Délai de grâce après un redémarrage automatique : un gros monde peut mettre plus de
// FAIL_THRESHOLD minutes à charger (API injoignable pendant ce temps) — sans ce délai, le
// watchdog redémarrerait le serveur en plein chargement, en boucle infinie.
const POST_RESTART_GRACE_MS = parseInt(process.env.WATCHDOG_GRACE_MS || String(10 * 60 * 1000), 10);

// Détection de boucle de crash : si le watchdog doit relancer le serveur plusieurs fois dans une
// fenêtre glissante, un simple redémarrage ne suffit visiblement pas (monde corrompu, mise à jour
// ratée, RAM insuffisante…). On envoie alors UNE alerte d'escalade demandant une intervention
// manuelle, sans spammer (une seule par fenêtre tant que la boucle dure).
const CRASH_LOOP_THRESHOLD = parseInt(process.env.WATCHDOG_CRASH_LOOP_THRESHOLD || '3', 10);
const CRASH_LOOP_WINDOW_MS = parseInt(process.env.WATCHDOG_CRASH_LOOP_WINDOW_MS || String(60 * 60 * 1000), 10);

let consecutiveFailures = 0;
let restarting = false;
let lastAutoRestartAt = 0;
let autoRestartTimes = []; // horodatages des redémarrages auto récents (fenêtre glissante)
let crashLoopAlerted = false;

async function check() {
  if (restarting) return;
  if (Date.now() - lastAutoRestartAt < POST_RESTART_GRACE_MS) return;

  const serviceRunning = await isServiceRunning();
  if (!serviceRunning) {
    // Service arrêté (via le dashboard ou manuellement) : rien d'anormal, pas d'action
    consecutiveFailures = 0;
    return;
  }

  try {
    const res = await getPalworldApi().get('/v1/api/info');
    consecutiveFailures = res.status === 200 ? 0 : consecutiveFailures + 1;
  } catch {
    consecutiveFailures++;
  }

  if (consecutiveFailures >= FAIL_THRESHOLD) {
    restarting = true;
    consecutiveFailures = 0;
    lastAutoRestartAt = Date.now();

    // Fenêtre glissante des redémarrages auto récents, pour détecter une boucle de crash.
    const now = Date.now();
    autoRestartTimes = autoRestartTimes.filter(t => now - t < CRASH_LOOP_WINDOW_MS);
    autoRestartTimes.push(now);
    if (autoRestartTimes.length < CRASH_LOOP_THRESHOLD) {
      crashLoopAlerted = false; // la boucle s'est calmée : on réarme l'alerte pour la prochaine fois
    }

    activityLog.log('watchdog', 'auto-restart', 'API injoignable alors que le service Windows est actif');
    await discord.notify('watchdogTriggered', {}, 'server');

    // Escalade : trop de redémarrages auto rapprochés → alerte "intervention manuelle" (une seule fois).
    if (autoRestartTimes.length >= CRASH_LOOP_THRESHOLD && !crashLoopAlerted) {
      crashLoopAlerted = true;
      activityLog.log('watchdog', 'crash-loop', `${autoRestartTimes.length} redémarrages auto en moins de ${Math.round(CRASH_LOOP_WINDOW_MS / 60000)} min`);
      await discord.notify('watchdogCrashLoop', { count: autoRestartTimes.length, minutes: Math.round(CRASH_LOOP_WINDOW_MS / 60000) }, 'server');
    }
    try {
      // `nssm restart` seul peut laisser tourner un enfant orphelin (voir killOrphanGameProcesses)
      // qui bloque le port et empêche la nouvelle instance de redevenir joignable — d'où l'appel
      // explicite en plus du stop/start NSSM.
      try { await runNssm(['stop', getServiceName()]); } catch (_) {}
      await killOrphanGameProcesses();
      await runNssm(['start', getServiceName()]);
      await discord.notify('watchdogRestartDone', {}, 'server');
    } catch (err) {
      await discord.notify('watchdogRestartFailed', { error: err }, 'server');
    } finally {
      restarting = false;
    }
  }
}

function start() {
  setInterval(check, CHECK_INTERVAL_MS);
}

module.exports = { start };
