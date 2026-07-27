// Extrait les messages de chat en jeu depuis les lignes de console.log.
// PalDefender écrit chaque message sous la forme :
//   [HH:MM:SS][info] [Chat::Global]['Pseudo' (UserId=steam_..., IP=x.x.x.x)]: le message
// On ne renvoie que ce qui est utile à l'affichage (heure, canal, pseudo, message) ; l'IP est
// volontairement ignorée (donnée sensible, inutile pour lire le chat).
const CHAT_RE = /^\[(\d{2}:\d{2}:\d{2})\]\[[^\]]*\]\s*\[Chat::([^\]]+)\]\['(.*?)'\s*\(UserId=([^,]+),[^)]*\)\]:\s?(.*)$/;

// Commandes de chat qui révèlent un secret (ex: un joueur tape "/adminpassword monMotDePasse"
// pour devenir admin). PalDefender les journalise telles quelles : sans masquage, le mot de passe
// s'afficherait EN CLAIR dans le chat du dashboard, visible par tous les comptes connectés (y
// compris "viewer"). On remplace donc l'argument par *** dès le parsing (point unique : couvre le
// stockage ET l'affichage). Le préfixe optionnel /, ! ou . couvre les différentes syntaxes.
const SENSITIVE_CMD_RE = /^(\s*[/!.]?(?:adminpassword|admin_password|adminpass|adminpw|password|passwd|pass|pw)\b)\s+\S.*$/i;

function redactSensitive(message) {
  const s = String(message);
  const m = SENSITIVE_CMD_RE.exec(s);
  return m ? `${m[1].trim()} ***` : s;
}

function parseChatLines(lines) {
  if (!Array.isArray(lines)) return [];
  const out = [];
  for (const line of lines) {
    const m = CHAT_RE.exec(line);
    if (!m) continue;
    out.push({
      time: m[1],
      channel: m[2],
      name: m[3],
      userId: m[4],
      message: redactSensitive(m[5])
    });
  }
  return out;
}

module.exports = { parseChatLines, redactSensitive };
