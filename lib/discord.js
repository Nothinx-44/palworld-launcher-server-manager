const axios = require('axios');

// Catégories d'événements notifiables, affichées comme cases à cocher dans le dashboard
// (Réglages → Notifications Discord). Activées par défaut (DISCORD_NOTIFY_<CAT> absent = activé)
// pour que les installations existantes continuent de tout recevoir sans configuration
// supplémentaire ; seule une case explicitement décochée désactive sa catégorie.
const CATEGORIES = {
  server: 'Démarrage / arrêt / redémarrage du serveur',
  players: 'Joueurs qui rejoignent / quittent',
  backups: 'Sauvegardes (manuelles, planifiées, restaurations)',
  updates: 'Mises à jour du serveur',
  admin: 'Actions admin (bans, kicks, réglages, plugins)',
  disk: 'Espace disque faible',
  restart: 'Redémarrages programmés (avertissements)'
};

// Messages Discord, indépendants de la langue du navigateur (c'est un webhook serveur, pas une
// session utilisateur) : la langue se choisit une fois pour toutes dans les Réglages du dashboard
// (DISCORD_LANG : fr/en/zh/es/ko/de/ja/pt, "fr" par défaut). Chaque entrée est une fonction (params) -> texte,
// par langue ; toute langue manquante retombe sur l'anglais puis le français.
const MESSAGES = {
  setupStart: {
    fr: p => `🛠️ Installation du serveur Palworld lancée par **${p.user}**…`,
    en: p => `🛠️ Palworld server installation started by **${p.user}**…`,
    zh: p => `🛠️ **${p.user}** 启动了 Palworld 服务器安装…`,
    es: p => `🛠️ Instalación del servidor de Palworld iniciada por **${p.user}**…`,
    ko: p => `🛠️ **${p.user}**님이 Palworld 서버 설치를 시작했습니다…`,
    de: p => `🛠️ Palworld-Serverinstallation von **${p.user}** gestartet…`,
    ja: p => `🛠️ **${p.user}** がPalworldサーバーのインストールを開始しました…`,
    pt: p => `🛠️ Instalação do servidor Palworld iniciada por **${p.user}**…`
  },
  setupDone: {
    fr: () => '✅ Installation du serveur Palworld terminée, le dashboard est prêt à le gérer.',
    en: () => '✅ Palworld server installation complete, the dashboard is ready to manage it.',
    zh: () => '✅ Palworld 服务器安装完成，仪表盘已准备好进行管理。',
    es: () => '✅ Instalación del servidor de Palworld completada, el panel está listo para gestionarlo.',
    ko: () => '✅ Palworld 서버 설치 완료, 대시보드에서 관리할 준비가 되었습니다.',
    de: () => '✅ Palworld-Serverinstallation abgeschlossen, das Dashboard ist bereit zur Verwaltung.',
    ja: () => '✅ Palworldサーバーのインストールが完了しました。ダッシュボードで管理できます。',
    pt: () => '✅ Instalação do servidor Palworld concluída, o painel está pronto para gerenciá-lo.'
  },
  setupError: {
    fr: p => `❌ Échec de l'installation du serveur Palworld : ${p.error}`,
    en: p => `❌ Palworld server installation failed: ${p.error}`,
    zh: p => `❌ Palworld 服务器安装失败：${p.error}`,
    es: p => `❌ Error en la instalación del servidor de Palworld: ${p.error}`,
    ko: p => `❌ Palworld 서버 설치 실패: ${p.error}`,
    de: p => `❌ Palworld-Serverinstallation fehlgeschlagen: ${p.error}`,
    ja: p => `❌ Palworldサーバーのインストールに失敗しました：${p.error}`,
    pt: p => `❌ Falha na instalação do servidor Palworld: ${p.error}`
  },
  settingsChanged: {
    fr: p => `⚙️ Réglages du monde modifiés par **${p.user}** : ${p.keys}`,
    en: p => `⚙️ World settings changed by **${p.user}**: ${p.keys}`,
    zh: p => `⚙️ **${p.user}** 修改了世界设置：${p.keys}`,
    es: p => `⚙️ Ajustes del mundo cambiados por **${p.user}**: ${p.keys}`,
    ko: p => `⚙️ **${p.user}**님이 월드 설정을 변경했습니다: ${p.keys}`,
    de: p => `⚙️ Welteinstellungen von **${p.user}** geändert: ${p.keys}`,
    ja: p => `⚙️ **${p.user}** がワールド設定を変更しました：${p.keys}`,
    pt: p => `⚙️ Configurações do mundo alteradas por **${p.user}**: ${p.keys}`
  },
  serverUpdated: {
    fr: () => '⬆️ Le serveur a été mis à jour vers la dernière version.',
    en: () => '⬆️ The server has been updated to the latest version.',
    zh: () => '⬆️ 服务器已更新到最新版本。',
    es: () => '⬆️ El servidor se ha actualizado a la última versión.',
    ko: () => '⬆️ 서버가 최신 버전으로 업데이트되었습니다.',
    de: () => '⬆️ Der Server wurde auf die neueste Version aktualisiert.',
    ja: () => '⬆️ サーバーが最新バージョンに更新されました。',
    pt: () => '⬆️ O servidor foi atualizado para a última versão.'
  },
  updateCheckFailed: {
    fr: p => `⚠️ Vérification de mise à jour échouée, redémarrage sans update (${p.error})`,
    en: p => `⚠️ Update check failed, restarting without updating (${p.error})`,
    zh: p => `⚠️ 更新检查失败，跳过更新直接重启（${p.error}）`,
    es: p => `⚠️ Falló la comprobación de actualización, reiniciando sin actualizar (${p.error})`,
    ko: p => `⚠️ 업데이트 확인 실패, 업데이트 없이 재시작합니다 (${p.error})`,
    de: p => `⚠️ Update-Prüfung fehlgeschlagen, Neustart ohne Update (${p.error})`,
    ja: p => `⚠️ 更新チェックに失敗しました。更新せずに再起動します（${p.error}）`,
    pt: p => `⚠️ Falha na verificação de atualização, reiniciando sem atualizar (${p.error})`
  },
  started: {
    fr: p => `▶️ Serveur démarré par **${p.user}**`,
    en: p => `▶️ Server started by **${p.user}**`,
    zh: p => `▶️ **${p.user}** 启动了服务器`,
    es: p => `▶️ Servidor iniciado por **${p.user}**`,
    ko: p => `▶️ **${p.user}**님이 서버를 시작했습니다`,
    de: p => `▶️ Server von **${p.user}** gestartet`,
    ja: p => `▶️ **${p.user}** がサーバーを起動しました`,
    pt: p => `▶️ Servidor iniciado por **${p.user}**`
  },
  stopRequested: {
    fr: p => `⏹️ Arrêt du serveur demandé par **${p.user}**`,
    en: p => `⏹️ Server stop requested by **${p.user}**`,
    zh: p => `⏹️ **${p.user}** 请求停止服务器`,
    es: p => `⏹️ Parada del servidor solicitada por **${p.user}**`,
    ko: p => `⏹️ **${p.user}**님이 서버 중지를 요청했습니다`,
    de: p => `⏹️ Serverstopp von **${p.user}** angefordert`,
    ja: p => `⏹️ **${p.user}** がサーバーの停止を要求しました`,
    pt: p => `⏹️ Parada do servidor solicitada por **${p.user}**`
  },
  stopForcedApiUnreachable: {
    fr: p => `⏹️ Arrêt forcé du serveur par **${p.user}** (API injoignable)`,
    en: p => `⏹️ Server force-stopped by **${p.user}** (API unreachable)`,
    zh: p => `⏹️ **${p.user}** 强制停止了服务器（API 无法访问）`,
    es: p => `⏹️ Servidor detenido a la fuerza por **${p.user}** (API inaccesible)`,
    ko: p => `⏹️ **${p.user}**님이 서버를 강제 중지했습니다 (API 연결 불가)`,
    de: p => `⏹️ Server von **${p.user}** zwangsweise gestoppt (API nicht erreichbar)`,
    ja: p => `⏹️ **${p.user}** がサーバーを強制停止しました（API接続不可）`,
    pt: p => `⏹️ Servidor parado à força por **${p.user}** (API inacessível)`
  },
  restartRequested: {
    fr: p => `🔄 Redémarrage demandé par **${p.user}** (vérification de mise à jour incluse)…`,
    en: p => `🔄 Restart requested by **${p.user}** (includes an update check)…`,
    zh: p => `🔄 **${p.user}** 请求重启（含更新检查）…`,
    es: p => `🔄 Reinicio solicitado por **${p.user}** (incluye comprobación de actualización)…`,
    ko: p => `🔄 **${p.user}**님이 재시작을 요청했습니다 (업데이트 확인 포함)…`,
    de: p => `🔄 Neustart von **${p.user}** angefordert (inkl. Update-Prüfung)…`,
    ja: p => `🔄 **${p.user}** が再起動を要求しました（更新チェックを含む）…`,
    pt: p => `🔄 Reinício solicitado por **${p.user}** (inclui verificação de atualização)…`
  },
  playerKicked: {
    fr: p => `👢 Joueur exclu par **${p.user}**`,
    en: p => `👢 Player kicked by **${p.user}**`,
    zh: p => `👢 **${p.user}** 踢出了一名玩家`,
    es: p => `👢 Jugador expulsado por **${p.user}**`,
    ko: p => `👢 **${p.user}**님이 플레이어를 추방했습니다`,
    de: p => `👢 Spieler von **${p.user}** gekickt`,
    ja: p => `👢 **${p.user}** がプレイヤーをキックしました`,
    pt: p => `👢 Jogador expulso por **${p.user}**`
  },
  playerBanned: {
    fr: p => `🔨 **${p.name}** banni par **${p.user}**`,
    en: p => `🔨 **${p.name}** banned by **${p.user}**`,
    zh: p => `🔨 **${p.name}** 被 **${p.user}** 封禁`,
    es: p => `🔨 **${p.name}** baneado por **${p.user}**`,
    ko: p => `🔨 **${p.user}**님이 **${p.name}**님을 차단했습니다`,
    de: p => `🔨 **${p.name}** von **${p.user}** gebannt`,
    ja: p => `🔨 **${p.user}** が **${p.name}** をBANしました`,
    pt: p => `🔨 **${p.name}** banido por **${p.user}**`
  },
  unbanned: {
    fr: p => `♻️ ${p.ip ? 'IP débannie' : 'Joueur débanni'} par **${p.user}**`,
    en: p => `♻️ ${p.ip ? 'IP unbanned' : 'Player unbanned'} by **${p.user}**`,
    zh: p => `♻️ **${p.user}** ${p.ip ? '解封了一个 IP' : '解封了一名玩家'}`,
    es: p => `♻️ ${p.ip ? 'IP desbaneada' : 'Jugador desbaneado'} por **${p.user}**`,
    ko: p => `♻️ **${p.user}**님이 ${p.ip ? 'IP 차단을 해제했습니다' : '플레이어 차단을 해제했습니다'}`,
    de: p => `♻️ ${p.ip ? 'IP entbannt' : 'Spieler entbannt'} von **${p.user}**`,
    ja: p => `♻️ **${p.user}** が${p.ip ? 'IPのBANを解除しました' : 'プレイヤーのBANを解除しました'}`,
    pt: p => `♻️ ${p.ip ? 'IP desbanido' : 'Jogador desbanido'} por **${p.user}**`
  },
  forceStopImmediate: {
    fr: p => `🛑 Arrêt forcé (immédiat) du serveur par **${p.user}**`,
    en: p => `🛑 Server force-stopped (immediate) by **${p.user}**`,
    zh: p => `🛑 **${p.user}** 立即强制停止了服务器`,
    es: p => `🛑 Servidor detenido a la fuerza (inmediato) por **${p.user}**`,
    ko: p => `🛑 **${p.user}**님이 서버를 즉시 강제 중지했습니다`,
    de: p => `🛑 Server von **${p.user}** zwangsweise (sofort) gestoppt`,
    ja: p => `🛑 **${p.user}** がサーバーを即時強制停止しました`,
    pt: p => `🛑 Servidor parado à força (imediato) por **${p.user}**`
  },
  updateLaunched: {
    fr: p => `⬆️ Mise à jour du serveur lancée par **${p.user}**…`,
    en: p => `⬆️ Server update started by **${p.user}**…`,
    zh: p => `⬆️ **${p.user}** 启动了服务器更新…`,
    es: p => `⬆️ Actualización del servidor iniciada por **${p.user}**…`,
    ko: p => `⬆️ **${p.user}**님이 서버 업데이트를 시작했습니다…`,
    de: p => `⬆️ Server-Update von **${p.user}** gestartet…`,
    ja: p => `⬆️ **${p.user}** がサーバー更新を開始しました…`,
    pt: p => `⬆️ Atualização do servidor iniciada por **${p.user}**…`
  },
  updateDoneStopped: {
    fr: () => '⬆️ Mise à jour terminée (serveur laissé arrêté).',
    en: () => '⬆️ Update complete (server left stopped).',
    zh: () => '⬆️ 更新完成（服务器保持停止状态）。',
    es: () => '⬆️ Actualización completada (el servidor queda detenido).',
    ko: () => '⬆️ 업데이트 완료 (서버는 중지 상태로 유지).',
    de: () => '⬆️ Update abgeschlossen (Server bleibt gestoppt).',
    ja: () => '⬆️ 更新が完了しました（サーバーは停止したまま）。',
    pt: () => '⬆️ Atualização concluída (o servidor permanece parado).'
  },
  updateFailed: {
    fr: p => `❌ Échec de la mise à jour : ${p.error}`,
    en: p => `❌ Update failed: ${p.error}`,
    zh: p => `❌ 更新失败：${p.error}`,
    es: p => `❌ Error en la actualización: ${p.error}`,
    ko: p => `❌ 업데이트 실패: ${p.error}`,
    de: p => `❌ Update fehlgeschlagen: ${p.error}`,
    ja: p => `❌ 更新に失敗しました：${p.error}`,
    pt: p => `❌ Falha na atualização: ${p.error}`
  },
  restartScheduled: {
    fr: p => `🕒 Redémarrage programmé dans ${p.minutes} min par **${p.user}**`,
    en: p => `🕒 Restart scheduled in ${p.minutes} min by **${p.user}**`,
    zh: p => `🕒 **${p.user}** 计划在 ${p.minutes} 分钟后重启`,
    es: p => `🕒 Reinicio programado en ${p.minutes} min por **${p.user}**`,
    ko: p => `🕒 **${p.user}**님이 ${p.minutes}분 후 재시작을 예약했습니다`,
    de: p => `🕒 Neustart in ${p.minutes} Min. von **${p.user}** geplant`,
    ja: p => `🕒 **${p.user}** が ${p.minutes} 分後の再起動を予約しました`,
    pt: p => `🕒 Reinício agendado em ${p.minutes} min por **${p.user}**`
  },
  restartCancelled: {
    fr: p => `✅ Redémarrage programmé annulé par **${p.user}**`,
    en: p => `✅ Scheduled restart cancelled by **${p.user}**`,
    zh: p => `✅ **${p.user}** 取消了计划的重启`,
    es: p => `✅ Reinicio programado cancelado por **${p.user}**`,
    ko: p => `✅ **${p.user}**님이 예약된 재시작을 취소했습니다`,
    de: p => `✅ Geplanter Neustart von **${p.user}** abgebrochen`,
    ja: p => `✅ **${p.user}** が予約された再起動をキャンセルしました`,
    pt: p => `✅ Reinício agendado cancelado por **${p.user}**`
  },
  manualBackup: {
    fr: p => `💾 Sauvegarde manuelle effectuée par **${p.user}**`,
    en: p => `💾 Manual backup done by **${p.user}**`,
    zh: p => `💾 **${p.user}** 完成了一次手动备份`,
    es: p => `💾 Copia manual realizada por **${p.user}**`,
    ko: p => `💾 **${p.user}**님이 수동 백업을 완료했습니다`,
    de: p => `💾 Manuelles Backup von **${p.user}** erstellt`,
    ja: p => `💾 **${p.user}** が手動バックアップを実行しました`,
    pt: p => `💾 Backup manual feito por **${p.user}**`
  },
  manualBackupFailed: {
    fr: p => `❌ Échec de la sauvegarde manuelle : ${p.error}`,
    en: p => `❌ Manual backup failed: ${p.error}`,
    zh: p => `❌ 手动备份失败：${p.error}`,
    es: p => `❌ Error en la copia manual: ${p.error}`,
    ko: p => `❌ 수동 백업 실패: ${p.error}`,
    de: p => `❌ Manuelles Backup fehlgeschlagen: ${p.error}`,
    ja: p => `❌ 手動バックアップに失敗しました：${p.error}`,
    pt: p => `❌ Falha no backup manual: ${p.error}`
  },
  backupRestored: {
    fr: p => `♻️ Sauvegarde **${p.filename}** restaurée par **${p.user}**${p.safetyFilename ? ` (monde précédent conservé dans ${p.safetyFilename})` : ''}`,
    en: p => `♻️ Backup **${p.filename}** restored by **${p.user}**${p.safetyFilename ? ` (previous world kept as ${p.safetyFilename})` : ''}`,
    zh: p => `♻️ **${p.user}** 恢复了备份 **${p.filename}**${p.safetyFilename ? `（原世界已保存为 ${p.safetyFilename}）` : ''}`,
    es: p => `♻️ Copia **${p.filename}** restaurada por **${p.user}**${p.safetyFilename ? ` (mundo anterior guardado como ${p.safetyFilename})` : ''}`,
    ko: p => `♻️ **${p.user}**님이 백업 **${p.filename}**을(를) 복원했습니다${p.safetyFilename ? ` (이전 월드는 ${p.safetyFilename}(으)로 저장됨)` : ''}`,
    de: p => `♻️ Backup **${p.filename}** von **${p.user}** wiederhergestellt${p.safetyFilename ? ` (vorherige Welt gespeichert als ${p.safetyFilename})` : ''}`,
    ja: p => `♻️ **${p.user}** がバックアップ **${p.filename}** を復元しました${p.safetyFilename ? `（以前のワールドは ${p.safetyFilename} として保存）` : ''}`,
    pt: p => `♻️ Backup **${p.filename}** restaurado por **${p.user}**${p.safetyFilename ? ` (mundo anterior salvo como ${p.safetyFilename})` : ''}`
  },
  worldReset: {
    fr: p => `🗑️ Monde réinitialisé par **${p.user}** (monde précédent conservé dans ${p.safetyFilename})`,
    en: p => `🗑️ World reset by **${p.user}** (previous world kept as ${p.safetyFilename})`,
    zh: p => `🗑️ **${p.user}** 重置了世界（原世界已保存为 ${p.safetyFilename}）`,
    es: p => `🗑️ Mundo reiniciado por **${p.user}** (mundo anterior guardado como ${p.safetyFilename})`,
    ko: p => `🗑️ **${p.user}**님이 월드를 초기화했습니다 (이전 월드는 ${p.safetyFilename}(으)로 저장됨)`,
    de: p => `🗑️ Welt von **${p.user}** zurückgesetzt (vorherige Welt gespeichert als ${p.safetyFilename})`,
    ja: p => `🗑️ **${p.user}** がワールドをリセットしました（以前のワールドは ${p.safetyFilename} として保存）`,
    pt: p => `🗑️ Mundo reiniciado por **${p.user}** (mundo anterior salvo como ${p.safetyFilename})`
  },
  pluginInstalled: {
    fr: p => `🧩 **${p.label} ${p.version}** installé par **${p.user}**`,
    en: p => `🧩 **${p.label} ${p.version}** installed by **${p.user}**`,
    zh: p => `🧩 **${p.user}** 安装了 **${p.label} ${p.version}**`,
    es: p => `🧩 **${p.label} ${p.version}** instalado por **${p.user}**`,
    ko: p => `🧩 **${p.user}**님이 **${p.label} ${p.version}**을(를) 설치했습니다`,
    de: p => `🧩 **${p.label} ${p.version}** von **${p.user}** installiert`,
    ja: p => `🧩 **${p.user}** が **${p.label} ${p.version}** をインストールしました`,
    pt: p => `🧩 **${p.label} ${p.version}** instalado por **${p.user}**`
  },
  test: {
    fr: p => `✅ Test réussi ! Les notifications Discord sont bien configurées pour **${p.user}**.`,
    en: p => `✅ Test successful! Discord notifications are correctly configured for **${p.user}**.`,
    zh: p => `✅ 测试成功！**${p.user}** 的 Discord 通知已正确配置。`,
    es: p => `✅ ¡Prueba superada! Las notificaciones de Discord están bien configuradas para **${p.user}**.`,
    ko: p => `✅ 테스트 성공! **${p.user}**님의 Discord 알림이 올바르게 구성되었습니다.`,
    de: p => `✅ Test erfolgreich! Discord-Benachrichtigungen sind für **${p.user}** korrekt konfiguriert.`,
    ja: p => `✅ テスト成功！**${p.user}** のDiscord通知は正しく設定されています。`,
    pt: p => `✅ Teste bem-sucedido! As notificações do Discord estão configuradas corretamente para **${p.user}**.`
  },
  scheduledBackupFailed: {
    fr: p => `❌ Sauvegarde planifiée échouée : ${p.error}`,
    en: p => `❌ Scheduled backup failed: ${p.error}`,
    zh: p => `❌ 计划备份失败：${p.error}`,
    es: p => `❌ Error en la copia programada: ${p.error}`,
    ko: p => `❌ 예약 백업 실패: ${p.error}`,
    de: p => `❌ Geplantes Backup fehlgeschlagen: ${p.error}`,
    ja: p => `❌ 予約バックアップに失敗しました：${p.error}`,
    pt: p => `❌ Falha no backup agendado: ${p.error}`
  },
  autoRestartScheduled: {
    fr: p => `🕒 Redémarrage automatique programmé dans ${p.minutes} min…`,
    en: p => `🕒 Automatic restart scheduled in ${p.minutes} min…`,
    zh: p => `🕒 计划在 ${p.minutes} 分钟后自动重启…`,
    es: p => `🕒 Reinicio automático programado en ${p.minutes} min…`,
    ko: p => `🕒 ${p.minutes}분 후 자동 재시작이 예약되었습니다…`,
    de: p => `🕒 Automatischer Neustart in ${p.minutes} Min. geplant…`,
    ja: p => `🕒 ${p.minutes} 分後に自動再起動が予約されました…`,
    pt: p => `🕒 Reinício automático agendado em ${p.minutes} min…`
  },
  diskLow: {
    fr: p => `⚠️ Espace disque faible sur \`${p.dir}\` : ${p.freeMb} Mo restants (seuil ${p.thresholdMb} Mo).`,
    en: p => `⚠️ Low disk space on \`${p.dir}\`: ${p.freeMb} MB left (threshold ${p.thresholdMb} MB).`,
    zh: p => `⚠️ \`${p.dir}\` 磁盘空间不足：剩余 ${p.freeMb} MB（阈值 ${p.thresholdMb} MB）。`,
    es: p => `⚠️ Poco espacio en disco en \`${p.dir}\`: quedan ${p.freeMb} MB (umbral ${p.thresholdMb} MB).`,
    ko: p => `⚠️ \`${p.dir}\`의 디스크 공간 부족: ${p.freeMb} MB 남음 (임계값 ${p.thresholdMb} MB).`,
    de: p => `⚠️ Wenig Speicherplatz auf \`${p.dir}\`: ${p.freeMb} MB übrig (Schwelle ${p.thresholdMb} MB).`,
    ja: p => `⚠️ \`${p.dir}\` のディスク空き容量が不足しています：残り ${p.freeMb} MB（しきい値 ${p.thresholdMb} MB）。`,
    pt: p => `⚠️ Pouco espaço em disco em \`${p.dir}\`: ${p.freeMb} MB restantes (limite ${p.thresholdMb} MB).`
  },
  diskOk: {
    fr: p => `✅ Espace disque de nouveau suffisant sur \`${p.dir}\` (${p.freeMb} Mo).`,
    en: p => `✅ Disk space back to normal on \`${p.dir}\` (${p.freeMb} MB).`,
    zh: p => `✅ \`${p.dir}\` 磁盘空间恢复正常（${p.freeMb} MB）。`,
    es: p => `✅ Espacio en disco de nuevo suficiente en \`${p.dir}\` (${p.freeMb} MB).`,
    ko: p => `✅ \`${p.dir}\`의 디스크 공간이 다시 충분합니다 (${p.freeMb} MB).`,
    de: p => `✅ Speicherplatz auf \`${p.dir}\` wieder ausreichend (${p.freeMb} MB).`,
    ja: p => `✅ \`${p.dir}\` のディスク空き容量が回復しました（${p.freeMb} MB）。`,
    pt: p => `✅ Espaço em disco normalizado em \`${p.dir}\` (${p.freeMb} MB).`
  },
  playerJoin: {
    fr: p => `🟢 **${p.name}** a rejoint le serveur`,
    en: p => `🟢 **${p.name}** joined the server`,
    zh: p => `🟢 **${p.name}** 加入了服务器`,
    es: p => `🟢 **${p.name}** se unió al servidor`,
    ko: p => `🟢 **${p.name}**님이 서버에 접속했습니다`,
    de: p => `🟢 **${p.name}** ist dem Server beigetreten`,
    ja: p => `🟢 **${p.name}** がサーバーに参加しました`,
    pt: p => `🟢 **${p.name}** entrou no servidor`
  },
  playerLeave: {
    fr: p => `🔴 **${p.name}** a quitté le serveur (${p.minutes} min de jeu)`,
    en: p => `🔴 **${p.name}** left the server (${p.minutes} min played)`,
    zh: p => `🔴 **${p.name}** 离开了服务器（游戏时长 ${p.minutes} 分钟）`,
    es: p => `🔴 **${p.name}** salió del servidor (${p.minutes} min jugados)`,
    ko: p => `🔴 **${p.name}**님이 서버에서 나갔습니다 (${p.minutes}분 플레이)`,
    de: p => `🔴 **${p.name}** hat den Server verlassen (${p.minutes} Min. gespielt)`,
    ja: p => `🔴 **${p.name}** がサーバーから退出しました（プレイ時間 ${p.minutes} 分）`,
    pt: p => `🔴 **${p.name}** saiu do servidor (${p.minutes} min jogados)`
  },
  watchdogTriggered: {
    fr: () => '⚠️ Le serveur Palworld ne répond plus alors que le process tourne toujours — redémarrage automatique en cours…',
    en: () => '⚠️ The Palworld server is not responding even though the process is still running — automatic restart in progress…',
    zh: () => '⚠️ Palworld 服务器无响应但进程仍在运行——正在自动重启…',
    es: () => '⚠️ El servidor de Palworld no responde aunque el proceso sigue en marcha: reinicio automático en curso…',
    ko: () => '⚠️ 프로세스는 실행 중이지만 Palworld 서버가 응답하지 않습니다 — 자동 재시작 진행 중…',
    de: () => '⚠️ Der Palworld-Server reagiert nicht mehr, obwohl der Prozess noch läuft — automatischer Neustart läuft…',
    ja: () => '⚠️ プロセスは実行中ですがPalworldサーバーが応答しません — 自動再起動を実行中…',
    pt: () => '⚠️ O servidor Palworld não está respondendo mesmo com o processo ainda em execução — reinício automático em andamento…'
  },
  watchdogRestartDone: {
    fr: () => '✅ Redémarrage automatique effectué.',
    en: () => '✅ Automatic restart complete.',
    zh: () => '✅ 自动重启完成。',
    es: () => '✅ Reinicio automático completado.',
    ko: () => '✅ 자동 재시작 완료.',
    de: () => '✅ Automatischer Neustart abgeschlossen.',
    ja: () => '✅ 自動再起動が完了しました。',
    pt: () => '✅ Reinício automático concluído.'
  },
  watchdogRestartFailed: {
    fr: p => `❌ Échec du redémarrage automatique : ${p.error}`,
    en: p => `❌ Automatic restart failed: ${p.error}`,
    zh: p => `❌ 自动重启失败：${p.error}`,
    es: p => `❌ Error en el reinicio automático: ${p.error}`,
    ko: p => `❌ 자동 재시작 실패: ${p.error}`,
    de: p => `❌ Automatischer Neustart fehlgeschlagen: ${p.error}`,
    ja: p => `❌ 自動再起動に失敗しました：${p.error}`,
    pt: p => `❌ Falha no reinício automático: ${p.error}`
  },
  watchdogCrashLoop: {
    fr: p => `🚨 Le serveur a été redémarré automatiquement ${p.count} fois en moins de ${p.minutes} min — un simple redémarrage ne suffit pas. Une intervention manuelle est probablement nécessaire (monde corrompu, mise à jour ratée, mémoire insuffisante…).`,
    en: p => `🚨 The server was auto-restarted ${p.count} times in under ${p.minutes} min — a simple restart isn't fixing it. Manual intervention is likely needed (corrupted world, failed update, insufficient memory…).`,
    zh: p => `🚨 服务器在不到 ${p.minutes} 分钟内已自动重启 ${p.count} 次——仅靠重启无法解决。可能需要手动介入（世界损坏、更新失败、内存不足…）。`,
    es: p => `🚨 El servidor se reinició automáticamente ${p.count} veces en menos de ${p.minutes} min: un simple reinicio no lo soluciona. Probablemente se necesite intervención manual (mundo corrupto, actualización fallida, memoria insuficiente…).`,
    ko: p => `🚨 서버가 ${p.minutes}분 이내에 ${p.count}번 자동 재시작되었습니다 — 단순 재시작으로 해결되지 않습니다. 수동 개입이 필요할 수 있습니다 (월드 손상, 업데이트 실패, 메모리 부족…).`,
    de: p => `🚨 Der Server wurde in weniger als ${p.minutes} Min. ${p.count}-mal automatisch neu gestartet — ein einfacher Neustart hilft nicht. Wahrscheinlich ist manuelles Eingreifen nötig (beschädigte Welt, fehlgeschlagenes Update, zu wenig Speicher…).`,
    ja: p => `🚨 サーバーが ${p.minutes} 分以内に ${p.count} 回自動再起動されました — 単純な再起動では解決しません。手動対応が必要な可能性があります（ワールド破損、更新失敗、メモリ不足…）。`,
    pt: p => `🚨 O servidor foi reiniciado automaticamente ${p.count} vezes em menos de ${p.minutes} min — um simples reinício não resolve. Provavelmente é necessária intervenção manual (mundo corrompido, atualização falha, memória insuficiente…).`
  }
};

const SUPPORTED_LANGS = ['fr', 'en', 'zh', 'es', 'ko', 'de', 'ja', 'pt'];

function categoryEnabled(category) {
  if (!category || !CATEGORIES[category]) return true;
  return process.env[`DISCORD_NOTIFY_${category.toUpperCase()}`] !== 'false';
}

function getLang() {
  const lang = process.env.DISCORD_LANG;
  return SUPPORTED_LANGS.includes(lang) ? lang : 'fr';
}

function buildMessage(key, params) {
  const tpl = MESSAGES[key];
  if (!tpl) throw new Error(`Clé de message Discord inconnue : ${key}`);
  const lang = getLang();
  return (tpl[lang] || tpl.en || tpl.fr)(params);
}

// Renvoie true si le message a bien été accepté par Discord (utilisé par le bouton
// "Envoyer un message de test" pour signaler une URL de webhook morte).
async function notify(key, params = {}, category) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return false; // pas configuré, on ignore silencieusement
  if (!categoryEnabled(category)) return false; // catégorie désactivée par l'utilisateur
  try {
    await axios.post(webhookUrl, { content: buildMessage(key, params) });
    return true;
  } catch (err) {
    console.error('Notification Discord échouée:', err.message);
    return false;
  }
}

module.exports = { notify, CATEGORIES, MESSAGES, getLang, SUPPORTED_LANGS };
