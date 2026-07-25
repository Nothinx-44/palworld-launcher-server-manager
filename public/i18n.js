// Internationalisation multilingue (fr, en, zh, es, ko, de, ja, pt). Le français reste la langue
// source du code (HTML/JS inchangés) ; pour les autres langues, un dictionnaire "texte français ->
// [en, zh, es, ko, de, ja, pt]" est
// appliqué automatiquement à tout le DOM (au chargement + MutationObserver pour le contenu
// dynamique), plus des motifs regex pour les textes contenant des variables. confirm/alert/prompt
// sont traduits au vol. Toute clé/motif sans traduction zh/es retombe sur l'anglais (jamais sur le
// français) pour un public international. Langue : localStorage 'lang', sinon détection navigateur.
(function () {
  const SUPPORTED = ['fr', 'en', 'zh', 'es', 'ko', 'de', 'ja', 'pt'];
  const stored = localStorage.getItem('lang');
  const nav = (navigator.language || '').toLowerCase();
  const detected = nav.startsWith('fr') ? 'fr' : nav.startsWith('zh') ? 'zh' : nav.startsWith('es') ? 'es' : nav.startsWith('ko') ? 'ko' : nav.startsWith('de') ? 'de' : nav.startsWith('ja') ? 'ja' : nav.startsWith('pt') ? 'pt' : 'en';
  const LANG = SUPPORTED.includes(stored) ? stored : detected;
  // Index dans les tableaux de traduction [en, zh, es] ; -1 = français (texte source, pas de dico)
  const IDX = { en: 0, zh: 1, es: 2, ko: 3, de: 4, ja: 5, pt: 6 }[LANG];

  // ---------- Dictionnaire (correspondances exactes, texte "trimé") : 'fr': [en, zh, es] ----------
  const T = {
    "Connexion — Pal Launcher Server Manager": ["Sign in — Pal Launcher Server Manager", "登录 — Pal Launcher Server Manager", "Iniciar sesión — Pal Launcher Server Manager", "로그인 — Pal Launcher Server Manager", "Anmeldung — Pal Launcher Server Manager", "ログイン — Pal Launcher Server Manager", "Entrar — Pal Launcher Server Manager"],
    "Nom d'utilisateur": ["Username", "用户名", "Nombre de usuario", "사용자 이름", "Benutzername", "ユーザー名", "Nome de usuário"],
    "Mot de passe": ["Password", "密码", "Contraseña", "비밀번호", "Passwort", "パスワード", "Senha"],
    "Se connecter": ["Sign in", "登录", "Iniciar sesión", "로그인", "Anmelden", "ログイン", "Entrar"],
    "Trop de tentatives, réessaie dans quelques minutes.": ["Too many attempts, try again in a few minutes.", "尝试次数过多，请几分钟后再试。", "Demasiados intentos, vuelve a intentarlo en unos minutos.", "시도 횟수가 너무 많습니다. 몇 분 후에 다시 시도하세요.", "Zu viele Versuche, bitte in ein paar Minuten erneut versuchen.", "試行回数が多すぎます。数分後にもう一度お試しください。", "Tentativas em excesso, tente novamente em alguns minutos."],
    "Identifiants incorrects.": ["Invalid credentials.", "用户名或密码错误。", "Credenciales incorrectas.", "잘못된 로그인 정보입니다.", "Ungültige Anmeldedaten.", "認証情報が正しくありません。", "Credenciais inválidas."],
    "Se déconnecter": ["Sign out", "退出登录", "Cerrar sesión", "로그아웃", "Abmelden", "ログアウト", "Sair"],
    "Vérification du serveur…": ["Checking server…", "正在检查服务器…", "Comprobando el servidor…", "서버 확인 중…", "Server wird geprüft…", "サーバーを確認中…", "Verificando o servidor…"],
    "Tableau de bord": ["Dashboard", "仪表盘", "Panel de control", "대시보드", "Dashboard", "ダッシュボード", "Painel"],
    "Carte": ["Map", "地图", "Mapa", "지도", "Karte", "マップ", "Mapa"],
    "Activité": ["Activity", "活动", "Actividad", "활동", "Aktivität", "アクティビティ", "Atividade"],
    "Sauvegardes": ["Backups", "备份", "Copias de seguridad", "백업", "Backups", "バックアップ", "Backups"],
    "Réglages": ["Settings", "设置", "Ajustes", "설정", "Einstellungen", "設定", "Configurações"],
    "Comptes": ["Accounts", "账户", "Cuentas", "계정", "Konten", "アカウント", "Contas"],
    "Admin": ["Admin", "管理员", "Admin", "관리자", "Admin", "管理者", "Admin"],
    "Utilisateur": ["User", "用户", "Usuario", "사용자", "Benutzer", "ユーザー", "Usuário"],
    "Lecture seule": ["Read-only", "只读", "Solo lectura", "읽기 전용", "Nur Lesen", "閲覧のみ", "Somente leitura"],
    "Informations serveur": ["Server information", "服务器信息", "Información del servidor", "서버 정보", "Serverinformationen", "サーバー情報", "Informações do servidor"],
    "Statut": ["Status", "状态", "Estado", "상태", "Status", "ステータス", "Status"],
    "Version": ["Version", "版本", "Versión", "버전", "Version", "バージョン", "Versão"],
    "Joueurs": ["Players", "玩家", "Jugadores", "플레이어", "Spieler", "プレイヤー", "Jogadores"],
    "Uptime": ["Uptime", "运行时间", "Tiempo activo", "가동 시간", "Betriebszeit", "稼働時間", "Tempo ativo"],
    "FPS serveur": ["Server FPS", "服务器 FPS", "FPS del servidor", "서버 FPS", "Server-FPS", "サーバーFPS", "FPS do servidor"],
    "Jours en jeu": ["In-game days", "游戏内天数", "Días en el juego", "게임 내 일수", "Ingame-Tage", "ゲーム内日数", "Dias no jogo"],
    "En ligne": ["Online", "在线", "En línea", "온라인", "Online", "オンライン", "Online"],
    "Hors ligne": ["Offline", "离线", "Desconectado", "오프라인", "Offline", "オフライン", "Offline"],
    "Serveur arrêté ou injoignable": ["Server stopped or unreachable", "服务器已停止或无法访问", "Servidor detenido o inaccesible", "서버가 중지되었거나 연결할 수 없음", "Server gestoppt oder nicht erreichbar", "サーバーが停止中または接続できません", "Servidor parado ou inacessível"],
    "Adresse pour rejoindre le serveur": ["Server join address", "服务器加入地址", "Dirección para unirse al servidor", "서버 접속 주소", "Adresse zum Beitreten des Servers", "サーバー接続アドレス", "Endereço para entrar no servidor"],
    "Sur ce réseau (amis chez toi / sur ta Wi-Fi)": ["On this network (friends at your place / on your Wi-Fi)", "本地网络（在你家 / 同一 Wi-Fi 的朋友）", "En esta red (amigos en tu casa / en tu Wi-Fi)", "이 네트워크에서 (집에 있는 친구 / 같은 Wi-Fi)", "In diesem Netzwerk (Freunde bei dir / in deinem WLAN)", "このネットワーク内（自宅の友達 / 同じWi-Fi）", "Nesta rede (amigos na sua casa / no seu Wi-Fi)"],
    "Copier": ["Copy", "复制", "Copiar", "복사", "Kopieren", "コピー", "Copiar"],
    "Depuis internet (après redirection de port sur ta box)": ["From the internet (after port forwarding on your router)", "从互联网（需在路由器上做端口转发）", "Desde internet (tras redirigir el puerto en tu router)", "인터넷에서 (공유기 포트 포워딩 후)", "Aus dem Internet (nach Portweiterleitung im Router)", "インターネットから（ルーターでポート転送の設定後）", "Pela internet (após redirecionar a porta no seu roteador)"],
    "C'est le port de jeu (UDP) — à donner à tes amis pour rejoindre depuis le client Palworld. Pour un accès depuis internet, vérifie qu'il est bien redirigé sur ta box.": ["This is the game port (UDP) — give it to your friends to join from the Palworld client. For internet access, make sure it is forwarded on your router.", "这是游戏端口（UDP）——把它告诉朋友即可从 Palworld 客户端加入。若需从互联网访问，请确认已在路由器上做好端口转发。", "Este es el puerto de juego (UDP): dáselo a tus amigos para unirse desde el cliente de Palworld. Para acceso desde internet, comprueba que esté redirigido en tu router.", "이것은 게임 포트(UDP)입니다 — 친구들이 Palworld 클라이언트에서 접속하려면 이 값을 알려주세요. 인터넷에서 접속하려면 공유기에 포트 포워딩이 설정되어 있는지 확인하세요.", "Das ist der Spiel-Port (UDP) — gib ihn deinen Freunden, damit sie über den Palworld-Client beitreten können. Für den Zugriff aus dem Internet stelle sicher, dass er in deinem Router weitergeleitet ist.", "これはゲームポート（UDP）です — 友達がPalworldクライアントから接続するために伝えてください。インターネットからアクセスするには、ルーターでポート転送が設定されていることを確認してください。", "Esta é a porta do jogo (UDP) — passe para seus amigos entrarem pelo cliente do Palworld. Para acesso pela internet, verifique se ela está redirecionada no seu roteador."],
    "Serveur pas encore installé": ["Server not installed yet", "服务器尚未安装", "Servidor aún no instalado", "서버가 아직 설치되지 않음", "Server noch nicht installiert", "サーバーはまだインストールされていません", "Servidor ainda não instalado"],
    "Indisponible (pas de connexion internet ?)": ["Unavailable (no internet connection?)", "不可用（没有网络连接？）", "No disponible (¿sin conexión a internet?)", "사용 불가 (인터넷 연결 없음?)", "Nicht verfügbar (keine Internetverbindung?)", "利用できません（インターネット接続がありませんか？）", "Indisponível (sem conexão com a internet?)"],
    "Copié !": ["Copied!", "已复制！", "¡Copiado!", "복사됨!", "Kopiert!", "コピーしました！", "Copiado!"],
    "Impossible de copier": ["Could not copy", "无法复制", "No se pudo copiar", "복사할 수 없음", "Kopieren nicht möglich", "コピーできませんでした", "Não foi possível copiar"],
    "Contrôle du serveur": ["Server control", "服务器控制", "Control del servidor", "서버 제어", "Serversteuerung", "サーバー操作", "Controle do servidor"],
    "Démarrer": ["Start", "启动", "Iniciar", "시작", "Starten", "起動", "Iniciar"],
    "Redémarrer": ["Restart", "重启", "Reiniciar", "재시작", "Neu starten", "再起動", "Reiniciar"],
    "Sauvegarder le monde": ["Save world", "保存世界", "Guardar el mundo", "월드 저장", "Welt speichern", "ワールドを保存", "Salvar o mundo"],
    "Arrêter": ["Stop", "停止", "Detener", "중지", "Stoppen", "停止", "Parar"],
    "Forcer l'arrêt": ["Force stop", "强制停止", "Forzar detención", "강제 중지", "Stopp erzwingen", "強制停止", "Forçar parada"],
    "Redémarrage programmé dans": ["Schedule restart in", "计划重启于", "Programar reinicio en", "다음 시간 후 재시작 예약", "Neustart geplant in", "再起動を予約：", "Agendar reinício em"],
    "min": ["min", "分钟", "min", "분", "Min.", "分", "min"],
    "Programmer": ["Schedule", "计划", "Programar", "예약", "Planen", "予約", "Agendar"],
    "Annuler": ["Cancel", "取消", "Cancelar", "취소", "Abbrechen", "キャンセル", "Cancelar"],
    "Démarrage du serveur…": ["Starting server…", "正在启动服务器…", "Iniciando el servidor…", "서버 시작 중…", "Server wird gestartet…", "サーバーを起動中…", "Iniciando o servidor…"],
    "Échec du démarrage": ["Failed to start", "启动失败", "Error al iniciar", "시작 실패", "Start fehlgeschlagen", "起動に失敗しました", "Falha ao iniciar"],
    "Arrêt en cours (sauvegarde puis coupure)…": ["Stopping (saving then shutting down)…", "正在停止（先保存再关闭）…", "Deteniendo (guardando y apagando)…", "중지 중 (저장 후 종료)…", "Wird gestoppt (speichern, dann herunterfahren)…", "停止中（保存してからシャットダウン）…", "Parando (salvando e depois desligando)…"],
    "Échec de l'arrêt": ["Failed to stop", "停止失败", "Error al detener", "중지 실패", "Stoppen fehlgeschlagen", "停止に失敗しました", "Falha ao parar"],
    "Redémarrage en cours…": ["Restarting…", "正在重启…", "Reiniciando…", "재시작 중…", "Wird neu gestartet…", "再起動中…", "Reiniciando…"],
    "Échec du redémarrage": ["Failed to restart", "重启失败", "Error al reiniciar", "재시작 실패", "Neustart fehlgeschlagen", "再起動に失敗しました", "Falha ao reiniciar"],
    "Arrêt forcé envoyé": ["Force stop sent", "已发送强制停止命令", "Detención forzada enviada", "강제 중지 명령 전송됨", "Erzwungener Stopp gesendet", "強制停止を送信しました", "Parada forçada enviada"],
    "Échec de l'arrêt forcé": ["Force stop failed", "强制停止失败", "Error en la detención forzada", "강제 중지 실패", "Erzwungener Stopp fehlgeschlagen", "強制停止に失敗しました", "Falha na parada forçada"],
    "Monde sauvegardé": ["World saved", "世界已保存", "Mundo guardado", "월드 저장됨", "Welt gespeichert", "ワールドを保存しました", "Mundo salvo"],
    "Redémarrage annulé": ["Restart cancelled", "重启已取消", "Reinicio cancelado", "재시작 취소됨", "Neustart abgebrochen", "再起動をキャンセルしました", "Reinício cancelado"],
    "Aucun redémarrage à annuler": ["No restart to cancel", "没有可取消的重启", "No hay reinicio que cancelar", "취소할 재시작이 없음", "Kein Neustart zum Abbrechen", "キャンセルする再起動がありません", "Nenhum reinício para cancelar"],
    "Échec de la programmation": ["Scheduling failed", "计划失败", "Error al programar", "예약 실패", "Planung fehlgeschlagen", "予約に失敗しました", "Falha ao agendar"],
    "Sauvegarde puis arrêt en cours…": ["Saving then stopping…", "正在保存并停止…", "Guardando y deteniendo…", "저장 후 중지 중…", "Speichern, dann Stoppen…", "保存してから停止中…", "Salvando e depois parando…"],
    "Impossible : un redémarrage est déjà en cours": ["Not possible: a restart is already in progress", "无法执行：已有重启正在进行", "No es posible: ya hay un reinicio en curso", "불가능: 이미 재시작이 진행 중입니다", "Nicht möglich: Ein Neustart läuft bereits", "実行できません：すでに再起動が進行中です", "Não é possível: já há um reinício em andamento"],
    "Arrêter le serveur ? Les joueurs connectés seront déconnectés.": ["Stop the server? Connected players will be disconnected.", "停止服务器？在线玩家将被断开连接。", "¿Detener el servidor? Los jugadores conectados serán desconectados.", "서버를 중지할까요? 접속 중인 플레이어의 연결이 끊깁니다.", "Server stoppen? Verbundene Spieler werden getrennt.", "サーバーを停止しますか？接続中のプレイヤーは切断されます。", "Parar o servidor? Os jogadores conectados serão desconectados."],
    "Redémarrer le serveur ? Les joueurs connectés seront déconnectés quelques instants.": ["Restart the server? Connected players will be disconnected for a moment.", "重启服务器？在线玩家将短暂断开连接。", "¿Reiniciar el servidor? Los jugadores conectados se desconectarán unos instantes.", "서버를 재시작할까요? 접속 중인 플레이어가 잠시 연결이 끊깁니다.", "Server neu starten? Verbundene Spieler werden kurz getrennt.", "サーバーを再起動しますか？接続中のプレイヤーは一時的に切断されます。", "Reiniciar o servidor? Os jogadores conectados ficarão desconectados por um instante."],
    "Forcer l'arrêt immédiat ? Aucune sauvegarde préalable — à réserver aux cas où le serveur est bloqué.": ["Force an immediate stop? No prior save — only for when the server is stuck.", "立即强制停止？不会预先保存——仅在服务器卡死时使用。", "¿Forzar una detención inmediata? Sin guardado previo: solo para cuando el servidor está bloqueado.", "즉시 강제 중지할까요? 사전 저장이 없습니다 — 서버가 멈췄을 때만 사용하세요.", "Sofortigen Stopp erzwingen? Kein vorheriges Speichern — nur verwenden, wenn der Server hängt.", "今すぐ強制停止しますか？事前の保存はありません — サーバーが応答しない場合のみ使用してください。", "Forçar uma parada imediata? Sem salvamento prévio — use apenas quando o servidor estiver travado."],
    "Joueurs connectés": ["Connected players", "在线玩家", "Jugadores conectados", "접속 중인 플레이어", "Verbundene Spieler", "接続中のプレイヤー", "Jogadores conectados"],
    "Nom": ["Name", "名称", "Nombre", "이름", "Name", "名前", "Nome"],
    "Niveau": ["Level", "等级", "Nivel", "레벨", "Level", "レベル", "Nível"],
    "Guilde": ["Guild", "公会", "Gremio", "길드", "Gilde", "ギルド", "Guilda"],
    "Ping": ["Ping", "延迟", "Ping", "핑", "Ping", "Ping", "Ping"],
    "Aucun joueur connecté.": ["No players connected.", "当前没有在线玩家。", "No hay jugadores conectados.", "접속 중인 플레이어가 없습니다.", "Keine Spieler verbunden.", "接続中のプレイヤーはいません。", "Nenhum jogador conectado."],
    "Kick": ["Kick", "踢出", "Expulsar", "추방", "Kicken", "キック", "Expulsar"],
    "Bannir": ["Ban", "封禁", "Banear", "차단", "Bannen", "BAN", "Banir"],
    "Exclure ce joueur du serveur ?": ["Kick this player from the server?", "将该玩家踢出服务器？", "¿Expulsar a este jugador del servidor?", "이 플레이어를 서버에서 추방할까요?", "Diesen Spieler vom Server kicken?", "このプレイヤーをサーバーからキックしますか？", "Expulsar este jogador do servidor?"],
    "Joueur exclu": ["Player kicked", "玩家已被踢出", "Jugador expulsado", "플레이어 추방됨", "Spieler gekickt", "プレイヤーをキックしました", "Jogador expulso"],
    "Échec du kick": ["Kick failed", "踢出失败", "Error al expulsar", "추방 실패", "Kicken fehlgeschlagen", "キックに失敗しました", "Falha ao expulsar"],
    "Joueur banni": ["Player banned", "玩家已被封禁", "Jugador baneado", "플레이어 차단됨", "Spieler gebannt", "プレイヤーをBANしました", "Jogador banido"],
    "Échec du ban": ["Ban failed", "封禁失败", "Error al banear", "차단 실패", "Bannen fehlgeschlagen", "BANに失敗しました", "Falha ao banir"],
    "Joueur débanni": ["Player unbanned", "玩家已解封", "Jugador desbaneado", "플레이어 차단 해제됨", "Spieler entbannt", "プレイヤーのBANを解除しました", "Jogador desbanido"],
    "Échec du déban": ["Unban failed", "解封失败", "Error al desbanear", "차단 해제 실패", "Entbannen fehlgeschlagen", "BAN解除に失敗しました", "Falha ao desbanir"],
    "📊 Voir les stats": ["📊 View stats", "📊 查看统计", "📊 Ver estadísticas", "📊 통계 보기", "📊 Statistiken ansehen", "📊 統計を見る", "📊 Ver estatísticas"],
    "🔨 Bannir": ["🔨 Ban", "🔨 封禁", "🔨 Banear", "🔨 차단", "🔨 Bannen", "🔨 BAN", "🔨 Banir"],
    "inconnue": ["unknown", "未知", "desconocida", "알 수 없음", "unbekannt", "不明", "desconhecida"],
    "en ligne": ["online", "在线", "en línea", "온라인", "online", "オンライン", "online"],
    "Temps de jeu total": ["Total playtime", "总游戏时间", "Tiempo de juego total", "총 플레이 시간", "Gesamte Spielzeit", "合計プレイ時間", "Tempo de jogo total"],
    "Sessions": ["Sessions", "会话数", "Sesiones", "세션", "Sitzungen", "セッション", "Sessões"],
    "Dernière connexion": ["Last seen", "最后上线", "Última conexión", "마지막 접속", "Zuletzt gesehen", "最終接続", "Última conexão"],
    "IP utilisées": ["IPs used", "使用过的 IP", "IPs usadas", "사용한 IP", "Verwendete IPs", "使用したIP", "IPs usados"],
    "Annonce": ["Announcement", "公告", "Anuncio", "공지", "Ankündigung", "アナウンス", "Anúncio"],
    "Envoyer": ["Send", "发送", "Enviar", "전송", "Senden", "送信", "Enviar"],
    "Message à afficher aux joueurs…": ["Message to show to players…", "要向玩家显示的消息…", "Mensaje para mostrar a los jugadores…", "플레이어에게 표시할 메시지…", "Nachricht für die Spieler…", "プレイヤーに表示するメッセージ…", "Mensagem para mostrar aos jogadores…"],
    "Annonce envoyée": ["Announcement sent", "公告已发送", "Anuncio enviado", "공지 전송됨", "Ankündigung gesendet", "アナウンスを送信しました", "Anúncio enviado"],
    "Échec de l'annonce": ["Announcement failed", "公告发送失败", "Error al enviar el anuncio", "공지 전송 실패", "Ankündigung fehlgeschlagen", "アナウンスの送信に失敗しました", "Falha no anúncio"],
    "Sauvegarde imminente, tenez-vous prêts.": ["Save incoming, get ready.", "即将保存，请做好准备。", "Guardado inminente, prepárense.", "곧 저장됩니다, 준비하세요.", "Speichern steht bevor, macht euch bereit.", "まもなく保存します。準備してください。", "Salvamento a caminho, preparem-se."],
    "Redémarrage bientôt, mettez-vous en lieu sûr.": ["Restart soon, get to a safe place.", "即将重启，请前往安全地点。", "Reinicio pronto, pónganse a salvo.", "곧 재시작됩니다, 안전한 곳으로 이동하세요.", "Neustart bald, begebt euch an einen sicheren Ort.", "まもなく再起動します。安全な場所に移動してください。", "Reinício em breve, vão para um lugar seguro."],
    "Bienvenue sur le serveur, amusez-vous bien !": ["Welcome to the server, have fun!", "欢迎来到服务器，玩得开心！", "¡Bienvenidos al servidor, que se diviertan!", "서버에 오신 것을 환영합니다, 즐거운 시간 보내세요!", "Willkommen auf dem Server, viel Spaß!", "サーバーへようこそ、楽しんでください！", "Bem-vindos ao servidor, divirtam-se!"],
    "Bonne nuit à tous, le serveur reste allumé.": ["Good night everyone, the server stays up.", "大家晚安，服务器保持在线。", "Buenas noches a todos, el servidor sigue encendido.", "모두 안녕히 주무세요, 서버는 계속 켜져 있습니다.", "Gute Nacht zusammen, der Server bleibt an.", "みなさんおやすみなさい、サーバーは起動したままです。", "Boa noite a todos, o servidor continua ligado."],
    "Commandes Admin": ["Admin Commands", "管理员命令", "Comandos de administrador", "관리자 명령", "Admin-Befehle", "管理者コマンド", "Comandos de administrador"],
    "(PalDefender)": ["(PalDefender)", "(PalDefender)", "(PalDefender)", "(PalDefender)", "(PalDefender)", "(PalDefender)", "(PalDefender)"],
    "API PalDefender non configurée — configure-la depuis l'onglet Plugins.": ["PalDefender API not configured — set it up from the Plugins tab.", "PalDefender API 未配置——请在“插件”标签页中设置。", "API de PalDefender no configurada: configúrala desde la pestaña Plugins.", "PalDefender API가 구성되지 않았습니다 — 플러그인 탭에서 설정하세요.", "PalDefender-API nicht konfiguriert — richte sie im Plugins-Tab ein.", "PalDefender APIが未設定です — プラグインタブから設定してください。", "API do PalDefender não configurada — configure na aba Plugins."],
    "Kick un joueur": ["Kick a player", "踢出玩家", "Expulsar a un jugador", "플레이어 추방", "Spieler kicken", "プレイヤーをキック", "Expulsar um jogador"],
    "Bannir un joueur": ["Ban a player", "封禁玩家", "Banear a un jugador", "플레이어 차단", "Spieler bannen", "プレイヤーをBAN", "Banir um jogador"],
    "Débannir un joueur": ["Unban a player", "解封玩家", "Desbanear a un jugador", "플레이어 차단 해제", "Spieler entbannen", "プレイヤーのBANを解除", "Desbanir um jogador"],
    "Bannir une IP": ["Ban an IP", "封禁 IP", "Banear una IP", "IP 차단", "IP bannen", "IPをBAN", "Banir um IP"],
    "Débannir une IP": ["Unban an IP", "解封 IP", "Desbanear una IP", "IP 차단 해제", "IP entbannen", "IPのBANを解除", "Desbanir um IP"],
    "Message à un joueur": ["Message a player", "私信玩家", "Mensaje a un jugador", "플레이어에게 메시지", "Nachricht an einen Spieler", "プレイヤーにメッセージ", "Mensagem a um jogador"],
    "Annonce (Broadcast)": ["Announcement (Broadcast)", "公告（广播）", "Anuncio (Broadcast)", "공지 (브로드캐스트)", "Ankündigung (Broadcast)", "アナウンス（ブロードキャスト）", "Anúncio (Broadcast)"],
    "Alerte": ["Alert", "警报", "Alerta", "경고", "Warnung", "アラート", "Alerta"],
    "Fréquentation": ["Player activity", "在线人数", "Actividad de jugadores", "접속자 추이", "Spieleraktivität", "接続状況", "Atividade de jogadores"],
    "24 h": ["24 h", "24 小时", "24 h", "24시간", "24 Std.", "24時間", "24 h"],
    "7 jours": ["7 days", "7 天", "7 días", "7일", "7 Tage", "7日間", "7 dias"],
    "Pas encore assez de données — la courbe se remplit toutes les 5 minutes.": ["Not enough data yet — the curve fills in every 5 minutes.", "数据还不够——曲线每 5 分钟补充一次。", "Aún no hay suficientes datos: la curva se completa cada 5 minutos.", "아직 데이터가 충분하지 않습니다 — 그래프는 5분마다 채워집니다.", "Noch nicht genug Daten — die Kurve füllt sich alle 5 Minuten.", "まだデータが十分ではありません — グラフは5分ごとに更新されます。", "Ainda não há dados suficientes — a curva se preenche a cada 5 minutos."],
    "Pic :": ["Peak:", "峰值：", "Pico:", "최고치:", "Spitze:", "ピーク：", "Pico:"],
    "Serveur hors ligne": ["Server offline", "服务器离线", "Servidor desconectado", "서버 오프라인", "Server offline", "サーバーオフライン", "Servidor offline"],
    "joueur(s)": ["player(s)", "名玩家", "jugador(es)", "명", "Spieler", "人", "jogador(es)"],
    "Chat joueur": ["Player chat", "玩家聊天", "Chat de jugador", "플레이어 채팅", "Spieler-Chat", "プレイヤーチャット", "Chat de jogador"],
    "Chat global": ["Global chat", "全局聊天", "Chat global", "전체 채팅", "Globaler Chat", "全体チャット", "Chat global"],
    "Log normal": ["Normal log", "普通日志", "Registro normal", "일반 로그", "Normales Log", "通常ログ", "Log normal"],
    "Log important": ["Important log", "重要日志", "Registro importante", "중요 로그", "Wichtiges Log", "重要ログ", "Log importante"],
    "Log très important": ["Very important log", "非常重要日志", "Registro muy importante", "매우 중요한 로그", "Sehr wichtiges Log", "最重要ログ", "Log muito importante"],
    "Bannir aussi l'IP de ce joueur": ["Also ban this player's IP", "同时封禁该玩家的 IP", "Banear también la IP de este jugador", "이 플레이어의 IP도 차단", "Auch die IP dieses Spielers bannen", "このプレイヤーのIPもBANする", "Banir também o IP deste jogador"],
    "Exécuter": ["Run", "执行", "Ejecutar", "실행", "Ausführen", "実行", "Executar"],
    "Joueur (nom ou UserId) ou IP": ["Player (name or UserId) or IP", "玩家（名称或 UserId）或 IP", "Jugador (nombre o UserId) o IP", "플레이어 (이름 또는 UserId) 또는 IP", "Spieler (Name oder UserId) oder IP", "プレイヤー（名前またはUserId）またはIP", "Jogador (nome ou UserId) ou IP"],
    "Message": ["Message", "消息", "Mensaje", "메시지", "Nachricht", "メッセージ", "Mensagem"],
    "Raison (optionnel)": ["Reason (optional)", "原因（可选）", "Motivo (opcional)", "사유 (선택)", "Grund (optional)", "理由（任意）", "Motivo (opcional)"],
    "Nom de l'expéditeur (optionnel)": ["Sender name (optional)", "发送者名称（可选）", "Nombre del remitente (opcional)", "보낸 사람 이름 (선택)", "Absendername (optional)", "送信者名（任意）", "Nome do remetente (opcional)"],
    "Commande exécutée": ["Command executed", "命令已执行", "Comando ejecutado", "명령 실행됨", "Befehl ausgeführt", "コマンドを実行しました", "Comando executado"],
    "API PalDefender non configurée": ["PalDefender API not configured", "PalDefender API 未配置", "API de PalDefender no configurada", "PalDefender API가 구성되지 않음", "PalDefender-API nicht konfiguriert", "PalDefender APIが未設定です", "API do PalDefender não configurada"],
    "Carte en direct": ["Live map", "实时地图", "Mapa en vivo", "실시간 지도", "Live-Karte", "ライブマップ", "Mapa ao vivo"],
    "Île principale": ["Main Island", "主岛", "Isla principal", "메인 섬", "Hauptinsel", "メイン島", "Ilha Principal"],
    "Île de l'Arbre": ["Tree Island", "巨树岛", "Isla del Árbol", "나무 섬", "Baum-Insel", "木の島", "Ilha da Árvore"],
    "Molette : zoom — Glisser : déplacer.": ["Wheel: zoom — Drag: pan.", "滚轮：缩放 — 拖动：平移。", "Rueda: zoom — Arrastrar: mover.", "휠: 확대/축소 — 드래그: 이동.", "Mausrad: Zoom — Ziehen: Verschieben.", "ホイール：ズーム — ドラッグ：移動。", "Roda: zoom — Arrastar: mover."],
    "Bases": ["Bases", "基地", "Bases", "거점", "Basen", "拠点", "Bases"],
    "Filtrer (guilde…)": ["Filter (guild…)", "筛选（公会…）", "Filtrar (gremio…)", "필터 (길드…)", "Filtern (Gilde…)", "絞り込み（ギルド…）", "Filtrar (guilda…)"],
    "Aucune base détectée pour le moment.": ["No base detected yet.", "暂未检测到基地。", "Aún no se ha detectado ninguna base.", "아직 감지된 거점이 없습니다.", "Noch keine Basis erkannt.", "まだ拠点が検出されていません。", "Nenhuma base detectada ainda."],
    "Les bases nécessitent PalDefender (non configuré sur ce serveur). Installe-le depuis l'onglet Plugins.": ["Bases require PalDefender (not configured on this server). Install it from the Plugins tab.", "基地功能需要 PalDefender（此服务器未配置）。请在“插件”标签页中安装。", "Las bases requieren PalDefender (no configurado en este servidor). Instálalo desde la pestaña Plugins.", "거점 기능에는 PalDefender가 필요합니다 (이 서버에는 구성되지 않음). 플러그인 탭에서 설치하세요.", "Basen erfordern PalDefender (auf diesem Server nicht konfiguriert). Installiere es im Plugins-Tab.", "拠点機能にはPalDefenderが必要です（このサーバーでは未設定）。プラグインタブからインストールしてください。", "As bases exigem o PalDefender (não configurado neste servidor). Instale na aba Plugins."],
    "ℹ️ La colonne Guilde nécessite PalDefender (non configuré sur ce serveur).": ["ℹ️ The Guild column requires PalDefender (not configured on this server).", "ℹ️ 公会列需要 PalDefender（此服务器未配置）。", "ℹ️ La columna Gremio requiere PalDefender (no configurado en este servidor).", "ℹ️ 길드 열에는 PalDefender가 필요합니다 (이 서버에는 구성되지 않음).", "ℹ️ Die Gilden-Spalte erfordert PalDefender (auf diesem Server nicht konfiguriert).", "ℹ️ ギルド列にはPalDefenderが必要です（このサーバーでは未設定）。", "ℹ️ A coluna Guilda exige o PalDefender (não configurado neste servidor)."],
    "Position": ["Position", "位置", "Posición", "위치", "Position", "位置", "Posição"],
    "Dernier membre vu": ["Last member seen", "最后上线的成员", "Último miembro visto", "마지막으로 본 멤버", "Zuletzt gesehenes Mitglied", "最後に確認されたメンバー", "Último membro visto"],
    "Inconnu": ["Unknown", "未知", "Desconocido", "알 수 없음", "Unbekannt", "不明", "Desconhecido"],
    "Active": ["Active", "活跃", "Activa", "활성", "Aktiv", "アクティブ", "Ativa"],
    "⚠️ Abandonnée": ["⚠️ Abandoned", "⚠️ 已废弃", "⚠️ Abandonada", "⚠️ 방치됨", "⚠️ Verlassen", "⚠️ 放棄", "⚠️ Abandonada"],
    "Historique des joueurs": ["Player history", "玩家历史", "Historial de jugadores", "플레이어 기록", "Spielerverlauf", "プレイヤー履歴", "Histórico de jogadores"],
    "Tous les joueurs (déjà connectés au moins une fois)": ["All players (ever connected at least once)", "所有玩家（曾经至少连接过一次）", "Todos los jugadores (que se conectaron alguna vez)", "모든 플레이어 (한 번 이상 접속한 적 있음)", "Alle Spieler (mindestens einmal verbunden)", "すべてのプレイヤー（一度でも接続したことがある）", "Todos os jogadores (que já se conectaram ao menos uma vez)"],
    "Filtrer (pseudo, IP, guilde…)": ["Filter (name, IP, guild…)", "筛选（昵称、IP、公会…）", "Filtrar (nombre, IP, gremio…)", "필터 (닉네임, IP, 길드…)", "Filtern (Name, IP, Gilde…)", "絞り込み（名前、IP、ギルド…）", "Filtrar (nome, IP, guilda…)"],
    "Aucun joueur enregistré pour le moment.": ["No players recorded yet.", "暂无已记录的玩家。", "Aún no hay jugadores registrados.", "아직 기록된 플레이어가 없습니다.", "Noch keine Spieler erfasst.", "まだ記録されたプレイヤーはいません。", "Nenhum jogador registrado ainda."],
    "Temps de jeu": ["Playtime", "游戏时长", "Tiempo de juego", "플레이 시간", "Spielzeit", "プレイ時間", "Tempo de jogo"],
    "Première connexion": ["First seen", "首次上线", "Primera conexión", "첫 접속", "Erste Verbindung", "初回接続", "Primeira conexão"],
    "Pas encore de données.": ["No data yet.", "暂无数据。", "Aún no hay datos.", "아직 데이터가 없습니다.", "Noch keine Daten.", "まだデータがありません。", "Ainda sem dados."],
    "Dernières sessions": ["Recent sessions", "最近会话", "Sesiones recientes", "최근 세션", "Letzte Sitzungen", "最近のセッション", "Sessões recentes"],
    "Journal d'activité": ["Activity log", "活动日志", "Registro de actividad", "활동 로그", "Aktivitätsprotokoll", "アクティビティログ", "Registro de atividade"],
    "Aucune activité enregistrée.": ["No activity recorded.", "没有记录的活动。", "No hay actividad registrada.", "기록된 활동이 없습니다.", "Keine Aktivität erfasst.", "記録されたアクティビティはありません。", "Nenhuma atividade registrada."],
    "Aucun résultat pour ce filtre.": ["No results for this filter.", "没有符合该筛选的结果。", "No hay resultados para este filtro.", "이 필터에 대한 결과가 없습니다.", "Keine Ergebnisse für diesen Filter.", "この絞り込みに該当する結果はありません。", "Nenhum resultado para este filtro."],
    "Filtrer (pseudo, action…)": ["Filter (name, action…)", "筛选（昵称、操作…）", "Filtrar (nombre, acción…)", "필터 (닉네임, 작업…)", "Filtern (Name, Aktion…)", "絞り込み（名前、操作…）", "Filtrar (nome, ação…)"],
    "Aucune session enregistrée.": ["No sessions recorded.", "没有记录的会话。", "No hay sesiones registradas.", "기록된 세션이 없습니다.", "Keine Sitzungen erfasst.", "記録されたセッションはありません。", "Nenhuma sessão registrada."],
    "Joueurs bannis": ["Banned players", "被封禁的玩家", "Jugadores baneados", "차단된 플레이어", "Gebannte Spieler", "BANされたプレイヤー", "Jogadores banidos"],
    "Aucun joueur banni.": ["No banned players.", "没有被封禁的玩家。", "No hay jugadores baneados.", "차단된 플레이어가 없습니다.", "Keine gebannten Spieler.", "BANされたプレイヤーはいません。", "Nenhum jogador banido."],
    "Chat en jeu": ["In-game chat", "游戏内聊天", "Chat del juego", "게임 내 채팅", "Ingame-Chat", "ゲーム内チャット", "Chat do jogo"],
    "Filtrer (pseudo, message…)": ["Filter (name, message…)", "筛选（昵称、消息…）", "Filtrar (nombre, mensaje…)", "필터 (닉네임, 메시지…)", "Filtern (Name, Nachricht…)", "絞り込み（名前、メッセージ…）", "Filtrar (nome, mensagem…)"],
    "Aucun message de chat pour le moment.": ["No chat messages yet.", "暂无聊天消息。", "Aún no hay mensajes de chat.", "아직 채팅 메시지가 없습니다.", "Noch keine Chat-Nachrichten.", "まだチャットメッセージがありません。", "Ainda sem mensagens de chat."],
    "Écrire dans le chat du jeu…": ["Write in the game chat…", "在游戏聊天中输入…", "Escribir en el chat del juego…", "게임 채팅에 입력…", "In den Spiel-Chat schreiben…", "ゲームチャットに入力…", "Escrever no chat do jogo…"],
    "Débannir": ["Unban", "解封", "Desbanear", "차단 해제", "Entbannen", "BAN解除", "Desbanir"],
    "← Précédent": ["← Previous", "← 上一页", "← Anterior", "← 이전", "← Zurück", "← 前へ", "← Anterior"],
    "Suivant →": ["Next →", "下一页 →", "Siguiente →", "다음 →", "Weiter →", "次へ →", "Próximo →"],
    "Sauvegarder maintenant": ["Back up now", "立即备份", "Hacer copia ahora", "지금 백업", "Jetzt sichern", "今すぐバックアップ", "Fazer backup agora"],
    "Importer un zip…": ["Import a zip…", "导入 zip…", "Importar un zip…", "zip 가져오기…", "ZIP importieren…", "zipをインポート…", "Importar um zip…"],
    "Télécharger": ["Download", "下载", "Descargar", "다운로드", "Herunterladen", "ダウンロード", "Baixar"],
    "Restaurer": ["Restore", "恢复", "Restaurar", "복원", "Wiederherstellen", "復元", "Restaurar"],
    "Aucune sauvegarde pour le moment.": ["No backups yet.", "暂无备份。", "Aún no hay copias de seguridad.", "아직 백업이 없습니다.", "Noch keine Backups.", "まだバックアップがありません。", "Ainda sem backups."],
    "Sauvegarde en cours…": ["Backing up…", "正在备份…", "Haciendo copia…", "백업 중…", "Backup läuft…", "バックアップ中…", "Fazendo backup…"],
    "Sauvegarde terminée": ["Backup complete", "备份完成", "Copia completada", "백업 완료", "Backup abgeschlossen", "バックアップが完了しました", "Backup concluído"],
    "Échec de la sauvegarde": ["Backup failed", "备份失败", "Error en la copia", "백업 실패", "Backup fehlgeschlagen", "バックアップに失敗しました", "Falha no backup"],
    "Restauré": ["Restored", "已恢复", "Restaurado", "복원됨", "Wiederhergestellt", "復元しました", "Restaurado"],
    "Impossible : arrête le serveur d'abord": ["Not possible: stop the server first", "无法执行：请先停止服务器", "No es posible: detén primero el servidor", "불가능: 먼저 서버를 중지하세요", "Nicht möglich: Stoppe zuerst den Server", "実行できません：先にサーバーを停止してください", "Não é possível: pare o servidor primeiro"],
    "SAVE_PATH/BACKUP_DIR non configurés": ["SAVE_PATH/BACKUP_DIR not configured", "未配置 SAVE_PATH/BACKUP_DIR", "SAVE_PATH/BACKUP_DIR no configurados", "SAVE_PATH/BACKUP_DIR가 구성되지 않음", "SAVE_PATH/BACKUP_DIR nicht konfiguriert", "SAVE_PATH/BACKUP_DIRが未設定です", "SAVE_PATH/BACKUP_DIR não configurados"],
    "Échec de la restauration": ["Restore failed", "恢复失败", "Error al restaurar", "복원 실패", "Wiederherstellung fehlgeschlagen", "復元に失敗しました", "Falha na restauração"],
    "Choisis un fichier .zip": ["Choose a .zip file", "请选择一个 .zip 文件", "Elige un archivo .zip", ".zip 파일을 선택하세요", "Wähle eine .zip-Datei", ".zipファイルを選択してください", "Escolha um arquivo .zip"],
    "Ce fichier n'est pas un zip valide": ["This file is not a valid zip", "该文件不是有效的 zip", "Este archivo no es un zip válido", "이 파일은 유효한 zip이 아닙니다", "Diese Datei ist kein gültiges ZIP", "このファイルは有効なzipではありません", "Este arquivo não é um zip válido"],
    "Fichier trop volumineux (4 Go max)": ["File too large (4 GB max)", "文件过大（最大 4 GB）", "Archivo demasiado grande (máx. 4 GB)", "파일이 너무 큽니다 (최대 4GB)", "Datei zu groß (max. 4 GB)", "ファイルが大きすぎます（最大4GB）", "Arquivo muito grande (máx. 4 GB)"],
    "BACKUP_DIR non configuré": ["BACKUP_DIR not configured", "未配置 BACKUP_DIR", "BACKUP_DIR no configurado", "BACKUP_DIR가 구성되지 않음", "BACKUP_DIR nicht konfiguriert", "BACKUP_DIRが未設定です", "BACKUP_DIR não configurado"],
    "Échec de l'import": ["Import failed", "导入失败", "Error al importar", "가져오기 실패", "Import fehlgeschlagen", "インポートに失敗しました", "Falha na importação"],
    "Échec de l'import (connexion interrompue ?)": ["Import failed (connection interrupted?)", "导入失败（连接中断？）", "Error al importar (¿conexión interrumpida?)", "가져오기 실패 (연결이 끊겼나요?)", "Import fehlgeschlagen (Verbindung unterbrochen?)", "インポートに失敗しました（接続が中断されましたか？）", "Falha na importação (conexão interrompida?)"],
    "Sauvegardes automatiques": ["Automatic backups", "自动备份", "Copias automáticas", "자동 백업", "Automatische Backups", "自動バックアップ", "Backups automáticos"],
    "Activer les sauvegardes planifiées": ["Enable scheduled backups", "启用计划备份", "Activar copias programadas", "예약 백업 활성화", "Geplante Backups aktivieren", "予約バックアップを有効にする", "Ativar backups agendados"],
    "Jours": ["Days", "星期", "Días", "요일", "Tage", "曜日", "Dias"],
    "Heures (plusieurs possibles)": ["Times (multiple allowed)", "时间（可多个）", "Horas (varias posibles)", "시간 (여러 개 가능)", "Uhrzeiten (mehrere möglich)", "時刻（複数可）", "Horários (vários possíveis)"],
    "Ajouter": ["Add", "添加", "Añadir", "추가", "Hinzufügen", "追加", "Adicionar"],
    "Sauvegardes conservées": ["Backups kept", "保留的备份数", "Copias conservadas", "보관할 백업 수", "Aufbewahrte Backups", "保持するバックアップ数", "Backups mantidos"],
    "les plus anciennes au-delà sont supprimées": ["oldest beyond this are deleted", "超出后最旧的将被删除", "las más antiguas se eliminan", "초과분은 오래된 것부터 삭제됩니다", "ältere darüber hinaus werden gelöscht", "これを超える古いものは削除されます", "os mais antigos além disso são excluídos"],
    "Enregistrer le planning": ["Save schedule", "保存计划", "Guardar programación", "일정 저장", "Zeitplan speichern", "スケジュールを保存", "Salvar agendamento"],
    "Planning enregistré": ["Schedule saved", "计划已保存", "Programación guardada", "일정 저장됨", "Zeitplan gespeichert", "スケジュールを保存しました", "Agendamento salvo"],
    "Échec de l'enregistrement du planning": ["Failed to save schedule", "计划保存失败", "Error al guardar la programación", "일정 저장 실패", "Speichern des Zeitplans fehlgeschlagen", "スケジュールの保存に失敗しました", "Falha ao salvar o agendamento"],
    "Heure invalide": ["Invalid time", "时间无效", "Hora no válida", "잘못된 시간", "Ungültige Uhrzeit", "無効な時刻", "Horário inválido"],
    "Ajoute au moins une heure": ["Add at least one time", "请至少添加一个时间", "Añade al menos una hora", "최소 한 개의 시간을 추가하세요", "Füge mindestens eine Uhrzeit hinzu", "少なくとも1つの時刻を追加してください", "Adicione pelo menos um horário"],
    "Sélectionne au moins un jour": ["Select at least one day", "请至少选择一天", "Selecciona al menos un día", "최소 하루를 선택하세요", "Wähle mindestens einen Tag", "少なくとも1つの曜日を選択してください", "Selecione pelo menos um dia"],
    "Aucune heure — ajoutes-en une.": ["No times — add one.", "没有时间——请添加一个。", "Sin horas: añade una.", "시간이 없습니다 — 하나 추가하세요.", "Keine Uhrzeit — füge eine hinzu.", "時刻がありません — 追加してください。", "Sem horários — adicione um."],
    "⏸️ Sauvegardes planifiées désactivées.": ["⏸️ Scheduled backups disabled.", "⏸️ 计划备份已禁用。", "⏸️ Copias programadas desactivadas.", "⏸️ 예약 백업이 비활성화되었습니다.", "⏸️ Geplante Backups deaktiviert.", "⏸️ 予約バックアップを無効にしました。", "⏸️ Backups agendados desativados."],
    "tous les jours": ["every day", "每天", "todos los días", "매일", "täglich", "毎日", "todos os dias"],
    "Dim": ["Sun", "周日", "Dom", "일", "So", "日", "Dom"],
    "Lun": ["Mon", "周一", "Lun", "월", "Mo", "月", "Seg"],
    "Mar": ["Tue", "周二", "Mar", "화", "Di", "火", "Ter"],
    "Mer": ["Wed", "周三", "Mié", "수", "Mi", "水", "Qua"],
    "Jeu": ["Thu", "周四", "Jue", "목", "Do", "木", "Qui"],
    "Ven": ["Fri", "周五", "Vie", "금", "Fr", "金", "Sex"],
    "Sam": ["Sat", "周六", "Sáb", "토", "Sa", "土", "Sáb"],
    "Mise à jour du serveur": ["Server update", "服务器更新", "Actualización del servidor", "서버 업데이트", "Server-Update", "サーバー更新", "Atualização do servidor"],
    "Vérifier les mises à jour": ["Check for updates", "检查更新", "Buscar actualizaciones", "업데이트 확인", "Nach Updates suchen", "更新を確認", "Verificar atualizações"],
    "Appliquer la mise à jour": ["Apply update", "应用更新", "Aplicar actualización", "업데이트 적용", "Update anwenden", "更新を適用", "Aplicar atualização"],
    "Compare le build installé au dernier build Steam (via SteamCMD).": ["Compares the installed build with the latest Steam build (via SteamCMD).", "将已安装版本与 Steam 最新版本进行比较（通过 SteamCMD）。", "Compara la versión instalada con la última de Steam (vía SteamCMD).", "설치된 빌드를 최신 Steam 빌드와 비교합니다 (SteamCMD 사용).", "Vergleicht den installierten Build mit dem neuesten Steam-Build (via SteamCMD).", "インストール済みビルドを最新のSteamビルドと比較します（SteamCMD経由）。", "Compara a build instalada com a última build da Steam (via SteamCMD)."],
    "Vérification en cours… (SteamCMD démarre, ~30-60 s)": ["Checking… (SteamCMD is starting, ~30-60 s)", "正在检查…（SteamCMD 启动中，约 30-60 秒）", "Comprobando… (SteamCMD arrancando, ~30-60 s)", "확인 중… (SteamCMD 시작 중, 약 30-60초)", "Wird geprüft… (SteamCMD startet, ~30-60 s)", "確認中…（SteamCMDを起動中、約30〜60秒）", "Verificando… (o SteamCMD está iniciando, ~30-60 s)"],
    "Une vérification est déjà en cours…": ["A check is already in progress…", "已有检查正在进行…", "Ya hay una comprobación en curso…", "이미 확인이 진행 중입니다…", "Eine Prüfung läuft bereits…", "すでに確認が進行中です…", "Uma verificação já está em andamento…"],
    "Mise à jour en cours… (suivi dans le journal d'activité et Discord)": ["Updating… (follow along in the activity log and Discord)", "正在更新…（可在活动日志和 Discord 中跟踪）", "Actualizando… (síguelo en el registro de actividad y Discord)", "업데이트 중… (활동 로그와 Discord에서 확인)", "Update läuft… (verfolgbar im Aktivitätsprotokoll und in Discord)", "更新中…（アクティビティログとDiscordで確認できます）", "Atualizando… (acompanhe no registro de atividade e no Discord)"],
    "Mise à jour lancée, le serveur redémarre…": ["Update started, the server is restarting…", "更新已开始，服务器正在重启…", "Actualización iniciada, el servidor se está reiniciando…", "업데이트 시작됨, 서버가 재시작됩니다…", "Update gestartet, der Server wird neu gestartet…", "更新を開始しました。サーバーを再起動しています…", "Atualização iniciada, o servidor está reiniciando…"],
    "Mise à jour lancée (serveur arrêté, il le restera)": ["Update started (server is stopped and will stay stopped)", "更新已开始（服务器已停止，将保持停止）", "Actualización iniciada (el servidor está detenido y seguirá así)", "업데이트 시작됨 (서버는 중지된 상태로 유지)", "Update gestartet (Server ist gestoppt und bleibt es)", "更新を開始しました（サーバーは停止したままになります）", "Atualização iniciada (o servidor está parado e continuará parado)"],
    "Appliquer la mise à jour ? Une sauvegarde de sécurité est prise avant. Si le serveur tourne, il sera redémarré (arrêt propre + update + relance).": ["Apply the update? A safety backup is taken first. If the server is running it will be restarted (clean stop + update + start).", "应用更新？会先进行一次安全备份。如果服务器正在运行，将会重启（正常停止 + 更新 + 启动）。", "¿Aplicar la actualización? Antes se hace una copia de seguridad. Si el servidor está en marcha, se reiniciará (parada limpia + actualización + arranque).", "업데이트를 적용할까요? 먼저 안전 백업이 생성됩니다. 서버가 실행 중이면 재시작됩니다 (정상 종료 + 업데이트 + 시작).", "Update anwenden? Vorher wird ein Sicherheits-Backup erstellt. Wenn der Server läuft, wird er neu gestartet (sauberes Stoppen + Update + Start).", "更新を適用しますか？先に安全バックアップを作成します。サーバーが稼働中の場合は再起動されます（正常停止＋更新＋起動）。", "Aplicar a atualização? Um backup de segurança é feito antes. Se o servidor estiver rodando, ele será reiniciado (parada limpa + atualização + início)."],
    "Échec du lancement de la mise à jour": ["Failed to start the update", "更新启动失败", "Error al iniciar la actualización", "업데이트 시작 실패", "Start des Updates fehlgeschlagen", "更新の開始に失敗しました", "Falha ao iniciar a atualização"],
    "Installation du serveur": ["Server installation", "服务器安装", "Instalación del servidor", "서버 설치", "Serverinstallation", "サーバーのインストール", "Instalação do servidor"],
    "J'ai déjà un serveur Palworld installé (ne pas re-télécharger)": ["I already have a Palworld server installed (don't re-download)", "我已安装 Palworld 服务器（不要重新下载）", "Ya tengo un servidor de Palworld instalado (no volver a descargar)", "이미 Palworld 서버가 설치되어 있음 (다시 다운로드하지 않음)", "Ich habe bereits einen Palworld-Server installiert (nicht erneut herunterladen)", "すでにPalworldサーバーがインストール済み（再ダウンロードしない）", "Já tenho um servidor Palworld instalado (não baixar de novo)"],
    "Indique directement le dossier qui contient": ["Point directly to the folder that contains", "直接指定包含以下文件的文件夹：", "Indica directamente la carpeta que contiene", "다음을 포함하는 폴더를 직접 지정하세요", "Gib direkt den Ordner an, der Folgendes enthält", "次のファイルを含むフォルダーを直接指定してください：", "Indique diretamente a pasta que contém"],
    "(pas besoin du sous-dossier \"Server\"). Les mots de passe déjà en place sont conservés si tu laisses les champs ci-dessous vides.": ["(no need for the \"Server\" subfolder). Passwords already in place are kept if you leave the fields below empty.", "（无需 \"Server\" 子文件夹）。如下方字段留空，已有的密码将被保留。", "(no hace falta la subcarpeta \"Server\"). Las contraseñas existentes se conservan si dejas vacíos los campos de abajo.", "(\"Server\" 하위 폴더는 필요 없음). 아래 필드를 비워 두면 기존 비밀번호가 유지됩니다.", "(kein \"Server\"-Unterordner nötig). Bereits vorhandene Passwörter bleiben erhalten, wenn du die Felder unten leer lässt.", "（「Server」サブフォルダーは不要）。下の項目を空欄のままにすると、既存のパスワードが保持されます。", "(sem precisar da subpasta \"Server\"). As senhas já existentes são mantidas se você deixar os campos abaixo vazios."],
    "Dossier du serveur (contient PalServer.exe)": ["Server folder (contains PalServer.exe)", "服务器文件夹（包含 PalServer.exe）", "Carpeta del servidor (contiene PalServer.exe)", "서버 폴더 (PalServer.exe 포함)", "Serverordner (enthält PalServer.exe)", "サーバーフォルダー（PalServer.exeを含む）", "Pasta do servidor (contém PalServer.exe)"],
    "laisse vide pour conserver l'existant": ["leave empty to keep the existing one", "留空以保留现有值", "deja vacío para conservar el existente", "기존 값을 유지하려면 비워 두세요", "leer lassen, um das Vorhandene zu behalten", "既存の値を保持するには空欄のままにしてください", "deixe vazio para manter o existente"],
    "Mot de passe admin : 6 caractères minimum si renseigné.": ["Admin password: 6 characters minimum if provided.", "管理员密码：如填写，至少 6 个字符。", "Contraseña de admin: mínimo 6 caracteres si se indica.", "관리자 비밀번호: 입력 시 최소 6자.", "Admin-Passwort: mindestens 6 Zeichen, falls angegeben.", "管理者パスワード：入力する場合は6文字以上。", "Senha de admin: mínimo de 6 caracteres se informada."],
    "⚠️ Le dashboard ne semble pas tourner avec des droits administrateur : l'installation (service Windows, pare-feu) risque d'échouer.": ["⚠️ The dashboard does not seem to be running with administrator rights: installation (Windows service, firewall) may fail.", "⚠️ 仪表盘似乎没有以管理员权限运行：安装（Windows 服务、防火墙）可能会失败。", "⚠️ El panel no parece ejecutarse con derechos de administrador: la instalación (servicio de Windows, firewall) puede fallar.", "⚠️ 대시보드가 관리자 권한으로 실행되고 있지 않은 것 같습니다: 설치(Windows 서비스, 방화벽)가 실패할 수 있습니다.", "⚠️ Das Dashboard scheint nicht mit Administratorrechten zu laufen: Die Installation (Windows-Dienst, Firewall) könnte fehlschlagen.", "⚠️ ダッシュボードが管理者権限で実行されていないようです：インストール（Windowsサービス、ファイアウォール）が失敗する可能性があります。", "⚠️ O painel não parece estar rodando com direitos de administrador: a instalação (serviço do Windows, firewall) pode falhar."],
    "Lancer l'installation": ["Start installation", "开始安装", "Iniciar instalación", "설치 시작", "Installation starten", "インストールを開始", "Iniciar instalação"],
    "SteamCMD installé": ["SteamCMD installed", "SteamCMD 已安装", "SteamCMD instalado", "SteamCMD 설치됨", "SteamCMD installiert", "SteamCMDをインストール済み", "SteamCMD instalado"],
    "Serveur Palworld installé": ["Palworld server installed", "Palworld 服务器已安装", "Servidor de Palworld instalado", "Palworld 서버 설치됨", "Palworld-Server installiert", "Palworldサーバーをインストール済み", "Servidor Palworld instalado"],
    "Service Windows enregistré": ["Windows service registered", "Windows 服务已注册", "Servicio de Windows registrado", "Windows 서비스 등록됨", "Windows-Dienst registriert", "Windowsサービスを登録済み", "Serviço do Windows registrado"],
    "API REST configurée": ["REST API configured", "REST API 已配置", "API REST configurada", "REST API 구성됨", "REST-API konfiguriert", "REST APIを設定済み", "API REST configurada"],
    "Dossier d'installation (ex: D:\\PalworldServer)": ["Install folder (e.g. D:\\PalworldServer)", "安装文件夹（例：D:\\PalworldServer）", "Carpeta de instalación (ej.: D:\\PalworldServer)", "설치 폴더 (예: D:\\PalworldServer)", "Installationsordner (z. B. D:\\PalworldServer)", "インストールフォルダー（例：D:\\PalworldServer）", "Pasta de instalação (ex.: D:\\PalworldServer)"],
    "Dossier SteamCMD": ["SteamCMD folder", "SteamCMD 文件夹", "Carpeta de SteamCMD", "SteamCMD 폴더", "SteamCMD-Ordner", "SteamCMDフォルダー", "Pasta do SteamCMD"],
    "Chemin nssm.exe": ["nssm.exe path", "nssm.exe 路径", "Ruta de nssm.exe", "nssm.exe 경로", "nssm.exe-Pfad", "nssm.exeのパス", "Caminho do nssm.exe"],
    "Nom du service Windows": ["Windows service name", "Windows 服务名称", "Nombre del servicio de Windows", "Windows 서비스 이름", "Name des Windows-Diensts", "Windowsサービス名", "Nome do serviço do Windows"],
    "Nom du serveur": ["Server name", "服务器名称", "Nombre del servidor", "서버 이름", "Servername", "サーバー名", "Nome do servidor"],
    "Mot de passe serveur (optionnel)": ["Server password (optional)", "服务器密码（可选）", "Contraseña del servidor (opcional)", "서버 비밀번호 (선택)", "Serverpasswort (optional)", "サーバーパスワード（任意）", "Senha do servidor (opcional)"],
    "Mot de passe admin (6 caractères min., requis pour l'API REST)": ["Admin password (6 chars min., required for the REST API)", "管理员密码（至少 6 个字符，REST API 必需）", "Contraseña de admin (mín. 6 caracteres, requerida para la API REST)", "관리자 비밀번호 (최소 6자, REST API에 필요)", "Admin-Passwort (mind. 6 Zeichen, für die REST-API erforderlich)", "管理者パスワード（6文字以上、REST APIに必要）", "Senha de admin (mín. 6 caracteres, necessária para a API REST)"],
    "Joueurs max": ["Max players", "最大玩家数", "Jugadores máx.", "최대 플레이어", "Max. Spieler", "最大プレイヤー数", "Máx. de jogadores"],
    "Port de jeu (UDP)": ["Game port (UDP)", "游戏端口（UDP）", "Puerto de juego (UDP)", "게임 포트 (UDP)", "Spiel-Port (UDP)", "ゲームポート（UDP）", "Porta do jogo (UDP)"],
    "Port de requête (Steam query)": ["Query port (Steam query)", "查询端口（Steam query）", "Puerto de consulta (Steam query)", "쿼리 포트 (Steam query)", "Abfrage-Port (Steam Query)", "クエリポート（Steamクエリ）", "Porta de consulta (Steam query)"],
    "Port API REST": ["REST API port", "REST API 端口", "Puerto de la API REST", "REST API 포트", "REST-API-Port", "REST APIポート", "Porta da API REST"],
    "Dossier de sauvegardes": ["Backups folder", "备份文件夹", "Carpeta de copias", "백업 폴더", "Backup-Ordner", "バックアップフォルダー", "Pasta de backups"],
    "Mot de passe admin requis (6 caractères min.).": ["Admin password required (6 chars min.).", "需要管理员密码（至少 6 个字符）。", "Se requiere contraseña de admin (mín. 6 caracteres).", "관리자 비밀번호가 필요합니다 (최소 6자).", "Admin-Passwort erforderlich (mind. 6 Zeichen).", "管理者パスワードが必要です（6文字以上）。", "Senha de admin obrigatória (mín. 6 caracteres)."],
    "Une installation est déjà en cours.": ["An installation is already in progress.", "已有安装正在进行。", "Ya hay una instalación en curso.", "이미 설치가 진행 중입니다.", "Eine Installation läuft bereits.", "すでにインストールが進行中です。", "Já há uma instalação em andamento."],
    "Échec du lancement de l'installation.": ["Failed to start the installation.", "安装启动失败。", "Error al iniciar la instalación.", "설치 시작 실패.", "Start der Installation fehlgeschlagen.", "インストールの開始に失敗しました。", "Falha ao iniciar a instalação."],
    "Installation terminée": ["Installation complete", "安装完成", "Instalación completada", "설치 완료", "Installation abgeschlossen", "インストールが完了しました", "Instalação concluída"],
    "Notifications Discord": ["Discord notifications", "Discord 通知", "Notificaciones de Discord", "Discord 알림", "Discord-Benachrichtigungen", "Discord通知", "Notificações do Discord"],
    "Reçois une alerte dans un salon Discord à chaque événement (démarrage/arrêt, joueur qui rejoint/quitte, sauvegarde, mise à jour, espace disque faible…).": ["Get an alert in a Discord channel for every event (start/stop, player join/leave, backup, update, low disk space…).", "在 Discord 频道中接收每个事件的提醒（启动/停止、玩家加入/离开、备份、更新、磁盘空间不足…）。", "Recibe una alerta en un canal de Discord por cada evento (inicio/parada, jugadores que entran/salen, copias, actualizaciones, poco espacio en disco…).", "모든 이벤트에 대해 Discord 채널로 알림을 받습니다 (시작/중지, 플레이어 접속/퇴장, 백업, 업데이트, 디스크 공간 부족…).", "Erhalte eine Benachrichtigung in einem Discord-Kanal bei jedem Ereignis (Start/Stopp, Spieler beitreten/verlassen, Backup, Update, wenig Speicherplatz…).", "各イベント（起動/停止、プレイヤーの参加/退出、バックアップ、更新、ディスク空き容量不足…）ごとにDiscordチャンネルへ通知を受け取ります。", "Receba um alerta em um canal do Discord a cada evento (início/parada, jogador que entra/sai, backup, atualização, pouco espaço em disco…)."],
    "Comment créer un webhook Discord ?": ["How to create a Discord webhook?", "如何创建 Discord webhook？", "¿Cómo crear un webhook de Discord?", "Discord 웹훅을 만드는 방법?", "Wie erstellt man einen Discord-Webhook?", "Discord Webhookの作成方法は？", "Como criar um webhook do Discord?"],
    "(Paramètres du salon → Intégrations → Webhooks → Nouveau webhook → Copier l'URL du webhook)": ["(Channel settings → Integrations → Webhooks → New webhook → Copy webhook URL)", "（频道设置 → 整合 → Webhook → 新建 Webhook → 复制 Webhook URL）", "(Ajustes del canal → Integraciones → Webhooks → Nuevo webhook → Copiar URL del webhook)", "(채널 설정 → 연동 → 웹훅 → 새 웹훅 → 웹훅 URL 복사)", "(Kanaleinstellungen → Integrationen → Webhooks → Neuer Webhook → Webhook-URL kopieren)", "（チャンネル設定 → 連携サービス → Webhook → 新しいWebhook → WebhookのURLをコピー）", "(Configurações do canal → Integrações → Webhooks → Novo webhook → Copiar URL do webhook)"],
    "Langue des messages": ["Message language", "消息语言", "Idioma de los mensajes", "메시지 언어", "Sprache der Nachrichten", "メッセージの言語", "Idioma das mensagens"],
    "Notifications à recevoir": ["Notifications to receive", "要接收的通知", "Notificaciones a recibir", "받을 알림", "Zu empfangende Benachrichtigungen", "受け取る通知", "Notificações a receber"],
    "Démarrage / arrêt / redémarrage du serveur": ["Server start / stop / restart", "服务器启动 / 停止 / 重启", "Inicio / parada / reinicio del servidor", "서버 시작 / 중지 / 재시작", "Server-Start / -Stopp / -Neustart", "サーバーの起動 / 停止 / 再起動", "Início / parada / reinício do servidor"],
    "Joueurs qui rejoignent / quittent": ["Players joining / leaving", "玩家加入 / 离开", "Jugadores que entran / salen", "플레이어 접속 / 퇴장", "Spieler, die beitreten / verlassen", "プレイヤーの参加 / 退出", "Jogadores que entram / saem"],
    "Sauvegardes (manuelles, planifiées, restaurations)": ["Backups (manual, scheduled, restores)", "备份（手动、计划、恢复）", "Copias (manuales, programadas, restauraciones)", "백업 (수동, 예약, 복원)", "Backups (manuell, geplant, Wiederherstellungen)", "バックアップ（手動、予約、復元）", "Backups (manuais, agendados, restaurações)"],
    "Mises à jour du serveur": ["Server updates", "服务器更新", "Actualizaciones del servidor", "서버 업데이트", "Server-Updates", "サーバー更新", "Atualizações do servidor"],
    "Actions admin (bans, kicks, réglages, plugins)": ["Admin actions (bans, kicks, settings, plugins)", "管理操作（封禁、踢出、设置、插件）", "Acciones de admin (baneos, expulsiones, ajustes, plugins)", "관리 작업 (차단, 추방, 설정, 플러그인)", "Admin-Aktionen (Banns, Kicks, Einstellungen, Plugins)", "管理者操作（BAN、キック、設定、プラグイン）", "Ações de admin (bans, expulsões, configurações, plugins)"],
    "Espace disque faible": ["Low disk space", "磁盘空间不足", "Poco espacio en disco", "디스크 공간 부족", "Wenig Speicherplatz", "ディスク空き容量不足", "Pouco espaço em disco"],
    "Redémarrages programmés (avertissements)": ["Scheduled restarts (warnings)", "计划重启（提醒）", "Reinicios programados (avisos)", "예약 재시작 (경고)", "Geplante Neustarts (Warnungen)", "予約再起動（警告）", "Reinícios agendados (avisos)"],
    "Enregistrer": ["Save", "保存", "Guardar", "저장", "Speichern", "保存", "Salvar"],
    "Envoyer un message de test": ["Send a test message", "发送测试消息", "Enviar un mensaje de prueba", "테스트 메시지 전송", "Testnachricht senden", "テストメッセージを送信", "Enviar uma mensagem de teste"],
    "Désactiver": ["Disable", "停用", "Desactivar", "비활성화", "Deaktivieren", "無効にする", "Desativar"],
    "✅ Notifications Discord activées.": ["✅ Discord notifications enabled.", "✅ Discord 通知已启用。", "✅ Notificaciones de Discord activadas.", "✅ Discord 알림이 활성화되었습니다.", "✅ Discord-Benachrichtigungen aktiviert.", "✅ Discord通知を有効にしました。", "✅ Notificações do Discord ativadas."],
    "Aucun webhook configuré — colle l'URL ci-dessus puis clique sur Enregistrer.": ["No webhook configured — paste the URL above then click Save.", "未配置 webhook——请在上方粘贴 URL，然后点击保存。", "Sin webhook configurado: pega la URL arriba y haz clic en Guardar.", "구성된 웹훅이 없습니다 — 위에 URL을 붙여넣고 저장을 클릭하세요.", "Kein Webhook konfiguriert — füge oben die URL ein und klicke auf Speichern.", "Webhookが未設定です — 上にURLを貼り付けてから保存をクリックしてください。", "Nenhum webhook configurado — cole a URL acima e clique em Salvar."],
    "Colle d'abord l'URL du webhook Discord.": ["Paste the Discord webhook URL first.", "请先粘贴 Discord webhook 的 URL。", "Pega primero la URL del webhook de Discord.", "먼저 Discord 웹훅 URL을 붙여넣으세요.", "Füge zuerst die Discord-Webhook-URL ein.", "先にDiscord WebhookのURLを貼り付けてください。", "Cole primeiro a URL do webhook do Discord."],
    "Webhook Discord enregistré.": ["Discord webhook saved.", "Discord webhook 已保存。", "Webhook de Discord guardado.", "Discord 웹훅이 저장되었습니다.", "Discord-Webhook gespeichert.", "Discord Webhookを保存しました。", "Webhook do Discord salvo."],
    "URL de webhook invalide.": ["Invalid webhook URL.", "Webhook URL 无效。", "URL de webhook no válida.", "잘못된 웹훅 URL입니다.", "Ungültige Webhook-URL.", "無効なWebhook URLです。", "URL de webhook inválida."],
    "Message de test envoyé, vérifie ton salon Discord !": ["Test message sent, check your Discord channel!", "测试消息已发送，请查看你的 Discord 频道！", "¡Mensaje de prueba enviado, revisa tu canal de Discord!", "테스트 메시지가 전송되었습니다, Discord 채널을 확인하세요!", "Testnachricht gesendet, überprüfe deinen Discord-Kanal!", "テストメッセージを送信しました。Discordチャンネルを確認してください！", "Mensagem de teste enviada, verifique seu canal do Discord!"],
    "Échec — enregistre d'abord un webhook valide.": ["Failed — save a valid webhook first.", "失败——请先保存有效的 webhook。", "Error: guarda primero un webhook válido.", "실패 — 먼저 유효한 웹훅을 저장하세요.", "Fehlgeschlagen — speichere zuerst einen gültigen Webhook.", "失敗しました — 先に有効なWebhookを保存してください。", "Falhou — salve primeiro um webhook válido."],
    "Échec de l'envoi — vérifie que l'URL du webhook est correcte.": ["Send failed — check that the webhook URL is correct.", "发送失败——请检查 webhook URL 是否正确。", "Error al enviar: comprueba que la URL del webhook sea correcta.", "전송 실패 — 웹훅 URL이 올바른지 확인하세요.", "Senden fehlgeschlagen — überprüfe, ob die Webhook-URL korrekt ist.", "送信に失敗しました — WebhookのURLが正しいか確認してください。", "Falha no envio — verifique se a URL do webhook está correta."],
    "Notifications Discord désactivées.": ["Discord notifications disabled.", "Discord 通知已停用。", "Notificaciones de Discord desactivadas.", "Discord 알림이 비활성화되었습니다.", "Discord-Benachrichtigungen deaktiviert.", "Discord通知を無効にしました。", "Notificações do Discord desativadas."],
    "Redémarrage automatique": ["Automatic restart", "自动重启", "Reinicio automático", "자동 재시작", "Automatischer Neustart", "自動再起動", "Reinício automático"],
    "Activer le redémarrage récurrent": ["Enable recurring restart", "启用周期性重启", "Activar reinicio recurrente", "주기적 재시작 활성화", "Wiederkehrenden Neustart aktivieren", "定期再起動を有効にする", "Ativar reinício recorrente"],
    "Avertissement aux joueurs": ["Player warning", "玩家提醒", "Aviso a los jugadores", "플레이어 경고", "Warnung an die Spieler", "プレイヤーへの警告", "Aviso aos jogadores"],
    "minutes avant le redémarrage effectif (annonces décroissantes)": ["minutes before the actual restart (countdown announcements)", "分钟（重启前倒计时公告）", "minutos antes del reinicio efectivo (anuncios de cuenta atrás)", "실제 재시작 전 분 (카운트다운 공지)", "Minuten vor dem tatsächlichen Neustart (Countdown-Ankündigungen)", "実際の再起動までの分数（カウントダウンのアナウンス）", "minutos antes do reinício real (anúncios em contagem regressiva)"],
    "⏸️ Redémarrage récurrent désactivé.": ["⏸️ Recurring restart disabled.", "⏸️ 周期性重启已禁用。", "⏸️ Reinicio recurrente desactivado.", "⏸️ 주기적 재시작이 비활성화되었습니다.", "⏸️ Wiederkehrender Neustart deaktiviert.", "⏸️ 定期再起動を無効にしました。", "⏸️ Reinício recorrente desativado."],
    "Réglages du monde (PalWorldSettings.ini)": ["World settings (PalWorldSettings.ini)", "世界设置（PalWorldSettings.ini）", "Ajustes del mundo (PalWorldSettings.ini)", "월드 설정 (PalWorldSettings.ini)", "Welteinstellungen (PalWorldSettings.ini)", "ワールド設定（PalWorldSettings.ini）", "Configurações do mundo (PalWorldSettings.ini)"],
    "Afficher les réglages": ["Show settings", "显示设置", "Mostrar ajustes", "설정 표시", "Einstellungen anzeigen", "設定を表示", "Mostrar configurações"],
    "Masquer les réglages": ["Hide settings", "隐藏设置", "Ocultar ajustes", "설정 숨기기", "Einstellungen ausblenden", "設定を隠す", "Ocultar configurações"],
    "Arrêter (avec sauvegarde) pour modifier": ["Stop (with save) to edit", "停止（先保存）以编辑", "Detener (con guardado) para editar", "수정하려면 (저장 후) 중지", "Zum Bearbeiten stoppen (mit Speichern)", "編集するには停止（保存あり）", "Parar (com salvamento) para editar"],
    "Enregistrer les modifications": ["Save changes", "保存修改", "Guardar cambios", "변경 사항 저장", "Änderungen speichern", "変更を保存", "Salvar alterações"],
    "Modifiable uniquement serveur éteint (Palworld ne relit ce fichier qu'au démarrage).": ["Editable only while the server is stopped (Palworld only reads this file at startup).", "仅在服务器停止时可编辑（Palworld 只在启动时读取此文件）。", "Editable solo con el servidor detenido (Palworld solo lee este archivo al arrancar).", "서버가 중지된 경우에만 수정 가능 (Palworld는 시작 시에만 이 파일을 읽습니다).", "Nur bei gestopptem Server bearbeitbar (Palworld liest diese Datei nur beim Start).", "サーバー停止中のみ編集可能です（Palworldはこのファイルを起動時のみ読み込みます）。", "Editável apenas com o servidor parado (o Palworld só lê este arquivo na inicialização)."],
    "🔒 Serveur en cours d'exécution : arrête-le pour modifier les réglages (Palworld ne relit ce fichier qu'au démarrage).": ["🔒 Server is running: stop it to edit the settings (Palworld only reads this file at startup).", "🔒 服务器正在运行：请停止后再修改设置（Palworld 只在启动时读取此文件）。", "🔒 Servidor en marcha: deténlo para editar los ajustes (Palworld solo lee este archivo al arrancar).", "🔒 서버가 실행 중입니다: 설정을 수정하려면 중지하세요 (Palworld는 시작 시에만 이 파일을 읽습니다).", "🔒 Server läuft: Stoppe ihn, um die Einstellungen zu bearbeiten (Palworld liest diese Datei nur beim Start).", "🔒 サーバーが稼働中です：設定を編集するには停止してください（Palworldはこのファイルを起動時のみ読み込みます）。", "🔒 O servidor está rodando: pare-o para editar as configurações (o Palworld só lê este arquivo na inicialização)."],
    "✏️ Serveur éteint : les réglages sont modifiables. Les champs modifiés sont surlignés.": ["✏️ Server stopped: settings are editable. Modified fields are highlighted.", "✏️ 服务器已停止：设置可编辑。已修改的字段会高亮显示。", "✏️ Servidor detenido: los ajustes son editables. Los campos modificados quedan resaltados.", "✏️ 서버가 중지됨: 설정을 수정할 수 있습니다. 수정된 필드는 강조 표시됩니다.", "✏️ Server gestoppt: Einstellungen sind bearbeitbar. Geänderte Felder sind hervorgehoben.", "✏️ サーバーが停止中：設定を編集できます。変更した項目はハイライトされます。", "✏️ Servidor parado: as configurações podem ser editadas. Os campos modificados ficam destacados."],
    "Arrêter le serveur (avec sauvegarde) pour pouvoir modifier les réglages ? Les joueurs connectés seront déconnectés.": ["Stop the server (with a save) to edit the settings? Connected players will be disconnected.", "停止服务器（先保存）以修改设置？在线玩家将被断开连接。", "¿Detener el servidor (con guardado) para editar los ajustes? Los jugadores conectados serán desconectados.", "설정을 수정하기 위해 서버를 (저장 후) 중지할까요? 접속 중인 플레이어의 연결이 끊깁니다.", "Server (mit Speichern) stoppen, um die Einstellungen zu bearbeiten? Verbundene Spieler werden getrennt.", "設定を編集するためにサーバーを停止（保存あり）しますか？接続中のプレイヤーは切断されます。", "Parar o servidor (com salvamento) para editar as configurações? Os jogadores conectados serão desconectados."],
    "Serveur arrêté — réglages modifiables": ["Server stopped — settings editable", "服务器已停止——设置可编辑", "Servidor detenido: ajustes editables", "서버 중지됨 — 설정 수정 가능", "Server gestoppt — Einstellungen bearbeitbar", "サーバーが停止しました — 設定を編集できます", "Servidor parado — configurações editáveis"],
    "Le serveur met du temps à s'arrêter, réessaie dans un instant": ["The server is taking a while to stop, try again shortly", "服务器停止较慢，请稍后重试", "El servidor tarda en detenerse, inténtalo de nuevo en un momento", "서버가 중지되는 데 시간이 걸립니다, 잠시 후 다시 시도하세요", "Der Server braucht zum Stoppen etwas Zeit, versuche es gleich erneut", "サーバーの停止に時間がかかっています。しばらくしてからもう一度お試しください", "O servidor está demorando para parar, tente novamente em instantes"],
    "PalWorldSettings.ini introuvable (serveur pas encore installé ?)": ["PalWorldSettings.ini not found (server not installed yet?)", "未找到 PalWorldSettings.ini（服务器尚未安装？）", "PalWorldSettings.ini no encontrado (¿servidor aún no instalado?)", "PalWorldSettings.ini를 찾을 수 없음 (서버가 아직 설치되지 않았나요?)", "PalWorldSettings.ini nicht gefunden (Server noch nicht installiert?)", "PalWorldSettings.iniが見つかりません（サーバーがまだインストールされていませんか？）", "PalWorldSettings.ini não encontrado (servidor ainda não instalado?)"],
    "Impossible de lire les réglages": ["Could not read the settings", "无法读取设置", "No se pudieron leer los ajustes", "설정을 읽을 수 없음", "Einstellungen können nicht gelesen werden", "設定を読み込めませんでした", "Não foi possível ler as configurações"],
    "Aucune modification à enregistrer": ["No changes to save", "没有要保存的修改", "No hay cambios que guardar", "저장할 변경 사항이 없음", "Keine Änderungen zum Speichern", "保存する変更がありません", "Nenhuma alteração para salvar"],
    "Impossible : le serveur tourne, arrête-le d'abord": ["Not possible: the server is running, stop it first", "无法执行：服务器正在运行，请先停止", "No es posible: el servidor está en marcha, deténlo primero", "불가능: 서버가 실행 중입니다, 먼저 중지하세요", "Nicht möglich: Der Server läuft, stoppe ihn zuerst", "実行できません：サーバーが稼働中です。先に停止してください", "Não é possível: o servidor está rodando, pare-o primeiro"],
    "Refusé : la modification aurait corrompu le fichier": ["Refused: the change would have corrupted the file", "已拒绝：该修改会损坏文件", "Rechazado: el cambio habría corrompido el archivo", "거부됨: 이 변경은 파일을 손상시킬 수 있습니다", "Abgelehnt: Die Änderung hätte die Datei beschädigt", "拒否されました：この変更はファイルを破損させる可能性がありました", "Recusado: a alteração teria corrompido o arquivo"],
    "Oui": ["Yes", "是", "Sí", "예", "Ja", "はい", "Sim"],
    "Non": ["No", "否", "No", "아니요", "Nein", "いいえ", "Não"],
    "(mods Lua/Blueprint)": ["(Lua/Blueprint mods)", "（Lua/Blueprint 模组）", "(mods Lua/Blueprint)", "(Lua/Blueprint 모드)", "(Lua/Blueprint-Mods)", "（Lua/Blueprint MOD）", "(mods Lua/Blueprint)"],
    "(anti-triche)": ["(anti-cheat)", "（反作弊）", "(anti-trampas)", "(안티치트)", "(Anti-Cheat)", "（チート対策）", "(anticheat)"],
    "Installer / mettre à jour": ["Install / update", "安装 / 更新", "Instalar / actualizar", "설치 / 업데이트", "Installieren / aktualisieren", "インストール / 更新", "Instalar / atualizar"],
    "Désinstaller": ["Uninstall", "卸载", "Desinstalar", "제거", "Deinstallieren", "アンインストール", "Desinstalar"],
    "Open source (MIT). Ajoute un dossier": ["Open source (MIT). Adds a", "开源（MIT）。会添加一个", "Código abierto (MIT). Añade una carpeta", "오픈 소스 (MIT). 다음 폴더를 추가합니다", "Open Source (MIT). Fügt einen Ordner hinzu", "オープンソース（MIT）。次のフォルダーを追加します：", "Código aberto (MIT). Adiciona uma pasta"],
    "avec quelques mods d'exemple ; les tiens peuvent être ajoutés par la suite directement dans ce dossier.": ["folder with a few example mods; yours can be added later directly into that folder.", "文件夹，内含一些示例模组；之后你可以直接把自己的模组放进该文件夹。", "con algunos mods de ejemplo; los tuyos pueden añadirse después directamente en esa carpeta.", "예제 모드가 몇 개 들어 있습니다; 이후 자신의 모드를 이 폴더에 직접 추가할 수 있습니다.", "mit einigen Beispiel-Mods; deine eigenen können später direkt in diesen Ordner gelegt werden.", "にサンプルMODがいくつか入っています。自分のMODは後でそのフォルダーに直接追加できます。", "com alguns mods de exemplo; os seus podem ser adicionados depois diretamente nessa pasta."],
    "⚠️ Binaire fermé (code non public) fourni par ses auteurs — installé directement depuis leur release GitHub officielle, jamais modifié par ce dashboard. Installe la dernière version": ["⚠️ Closed binary (non-public code) provided by its authors — installed directly from their official GitHub release, never modified by this dashboard. Installs the latest", "⚠️ 由作者提供的闭源二进制文件（代码不公开）——直接从其官方 GitHub release 安装，本仪表盘从不修改。安装最新的", "⚠️ Binario cerrado (código no público) proporcionado por sus autores: instalado directamente desde su release oficial de GitHub, nunca modificado por este panel. Instala la última", "⚠️ 작성자가 제공하는 비공개 바이너리 (코드 비공개) — 공식 GitHub 릴리스에서 직접 설치되며 이 대시보드가 수정하지 않습니다. 최신 버전을 설치합니다", "⚠️ Geschlossene Binärdatei (Code nicht öffentlich), bereitgestellt von den Autoren — direkt aus deren offiziellem GitHub-Release installiert, niemals von diesem Dashboard verändert. Installiert die neueste Version", "⚠️ 作者が提供するクローズドバイナリ（非公開コード） — 公式GitHubリリースから直接インストールされ、このダッシュボードが改変することはありません。最新版をインストールします：", "⚠️ Binário fechado (código não público) fornecido pelos autores — instalado diretamente da release oficial no GitHub, nunca modificado por este painel. Instala a última"],
    "préversion (bêta 1.8.0)": ["pre-release (1.8.0 beta)", "预发布版（1.8.0 测试版）", "preversión (beta 1.8.0)", "사전 릴리스 (1.8.0 베타)", "Vorabversion (1.8.0 Beta)", "プレリリース（1.8.0ベータ）", "pré-lançamento (beta 1.8.0)"],
    ": c'est la première à exposer l'API des Commandes Admin.": [": it is the first to expose the Admin Commands API.", "：这是第一个提供管理员命令 API 的版本。", ": es la primera que expone la API de Comandos de administrador.", ": 관리자 명령 API를 제공하는 첫 번째 버전입니다.", ": die erste, die die Admin-Befehls-API bereitstellt.", "：管理者コマンドAPIを初めて公開したバージョンです。", ": é a primeira a expor a API de Comandos de administrador."],
    "Commandes Admin (onglet Tableau de bord)": ["Admin Commands (Dashboard tab)", "管理员命令（仪表盘标签页）", "Comandos de admin (pestaña Panel)", "관리자 명령 (대시보드 탭)", "Admin-Befehle (Dashboard-Tab)", "管理者コマンド（ダッシュボードタブ）", "Comandos de administrador (aba Painel)"],
    "Entièrement automatique : l'installation active l'API et configure l'accès. Il suffit ensuite de démarrer le serveur.": ["Fully automatic: installation enables the API and sets up access. Just start the server afterwards.", "完全自动：安装会启用 API 并配置访问权限。之后只需启动服务器即可。", "Totalmente automático: la instalación activa la API y configura el acceso. Después solo hay que iniciar el servidor.", "완전 자동: 설치 시 API가 활성화되고 접근이 구성됩니다. 이후 서버를 시작하기만 하면 됩니다.", "Vollautomatisch: Die Installation aktiviert die API und richtet den Zugriff ein. Danach musst du nur noch den Server starten.", "完全自動：インストールでAPIが有効になり、アクセスが設定されます。あとはサーバーを起動するだけです。", "Totalmente automático: a instalação ativa a API e configura o acesso. Depois é só iniciar o servidor."],
    "Installation/désinstallation possibles uniquement serveur éteint (les fichiers sont chargés par le processus en cours d'exécution).": ["Install/uninstall only possible while the server is stopped (the files are loaded by the running process).", "仅在服务器停止时才能安装/卸载（文件被运行中的进程占用）。", "Instalar/desinstalar solo es posible con el servidor detenido (el proceso en ejecución carga los archivos).", "설치/제거는 서버가 중지된 경우에만 가능합니다 (파일이 실행 중인 프로세스에 의해 로드됨).", "Installation/Deinstallation nur bei gestopptem Server möglich (die Dateien werden vom laufenden Prozess geladen).", "インストール/アンインストールはサーバー停止中のみ可能です（ファイルは実行中のプロセスに読み込まれます）。", "Instalação/desinstalação só é possível com o servidor parado (os arquivos são carregados pelo processo em execução)."],
    "✅ Installé": ["✅ Installed", "✅ 已安装", "✅ Instalado", "✅ 설치됨", "✅ Installiert", "✅ インストール済み", "✅ Instalado"],
    "⭕ Non installé": ["⭕ Not installed", "⭕ 未安装", "⭕ No instalado", "⭕ 설치되지 않음", "⭕ Nicht installiert", "⭕ 未インストール", "⭕ Não instalado"],
    "✅ Prêt — les Commandes Admin fonctionnent": ["✅ Ready — Admin Commands work", "✅ 就绪——管理员命令可用", "✅ Listo: los Comandos de admin funcionan", "✅ 준비됨 — 관리자 명령이 작동합니다", "✅ Bereit — die Admin-Befehle funktionieren", "✅ 準備完了 — 管理者コマンドが利用できます", "✅ Pronto — os Comandos de administrador funcionam"],
    "⭕ Installe PalDefender puis démarre le serveur une fois": ["⭕ Install PalDefender then start the server once", "⭕ 安装 PalDefender 后启动一次服务器", "⭕ Instala PalDefender y arranca el servidor una vez", "⭕ PalDefender를 설치한 후 서버를 한 번 시작하세요", "⭕ Installiere PalDefender und starte den Server einmal", "⭕ PalDefenderをインストールしてサーバーを一度起動してください", "⭕ Instale o PalDefender e inicie o servidor uma vez"],
    "IP bannie": ["IP banned", "IP 已封禁", "IP baneada", "IP 차단됨", "IP gebannt", "IPをBANしました", "IP banido"],
    "IP débannie": ["IP unbanned", "IP 已解封", "IP desbaneada", "IP 차단 해제됨", "IP entbannt", "IPのBANを解除しました", "IP desbanido"],
    "joueur banni": ["player banned", "玩家已封禁", "jugador baneado", "플레이어 차단됨", "Spieler gebannt", "プレイヤーをBAN", "jogador banido"],
    "Mon compte": ["My account", "我的账户", "Mi cuenta", "내 계정", "Mein Konto", "マイアカウント", "Minha conta"],
    "Changer le mot de passe": ["Change password", "修改密码", "Cambiar contraseña", "비밀번호 변경", "Passwort ändern", "パスワードを変更", "Alterar senha"],
    "Mot de passe actuel": ["Current password", "当前密码", "Contraseña actual", "현재 비밀번호", "Aktuelles Passwort", "現在のパスワード", "Senha atual"],
    "Nouveau mot de passe (6 caractères min.)": ["New password (6 chars min.)", "新密码（至少 6 个字符）", "Nueva contraseña (mín. 6 caracteres)", "새 비밀번호 (최소 6자)", "Neues Passwort (mind. 6 Zeichen)", "新しいパスワード（6文字以上）", "Nova senha (mín. 6 caracteres)"],
    "Mot de passe changé": ["Password changed", "密码已修改", "Contraseña cambiada", "비밀번호가 변경됨", "Passwort geändert", "パスワードを変更しました", "Senha alterada"],
    "Mot de passe actuel incorrect.": ["Current password is incorrect.", "当前密码不正确。", "La contraseña actual es incorrecta.", "현재 비밀번호가 올바르지 않습니다.", "Aktuelles Passwort ist falsch.", "現在のパスワードが正しくありません。", "A senha atual está incorreta."],
    "Échec du changement de mot de passe.": ["Failed to change password.", "密码修改失败。", "Error al cambiar la contraseña.", "비밀번호 변경 실패.", "Passwortänderung fehlgeschlagen.", "パスワードの変更に失敗しました。", "Falha ao alterar a senha."],
    "Gestion des utilisateurs": ["User management", "用户管理", "Gestión de usuarios", "사용자 관리", "Benutzerverwaltung", "ユーザー管理", "Gerenciamento de usuários"],
    "Rôle": ["Role", "角色", "Rol", "역할", "Rolle", "役割", "Função"],
    "Créer un compte": ["Create an account", "创建账户", "Crear una cuenta", "계정 만들기", "Konto erstellen", "アカウントを作成", "Criar uma conta"],
    "Admin (accès complet)": ["Admin (full access)", "管理员（完全访问）", "Admin (acceso completo)", "관리자 (전체 접근)", "Admin (voller Zugriff)", "管理者（フルアクセス）", "Admin (acesso total)"],
    "Utilisateur (actions, sans installation ni comptes admin)": ["User (actions, no installation or admin accounts)", "用户（可操作，但无安装及管理员账户权限）", "Usuario (acciones, sin instalación ni cuentas de admin)", "사용자 (작업 가능, 설치 및 관리자 계정 제외)", "Benutzer (Aktionen, ohne Installation und Admin-Konten)", "ユーザー（操作可、インストールや管理者アカウントは不可）", "Usuário (ações, sem instalação ou contas de admin)"],
    "Créer": ["Create", "创建", "Crear", "만들기", "Erstellen", "作成", "Criar"],
    "Mot de passe (6 caractères min.)": ["Password (6 chars min.)", "密码（至少 6 个字符）", "Contraseña (mín. 6 caracteres)", "비밀번호 (최소 6자)", "Passwort (mind. 6 Zeichen)", "パスワード（6文字以上）", "Senha (mín. 6 caracteres)"],
    "toi": ["you", "你", "tú", "나", "du", "あなた", "você"],
    "Réinitialiser mdp": ["Reset password", "重置密码", "Restablecer contraseña", "비밀번호 재설정", "Passwort zurücksetzen", "パスワードをリセット", "Redefinir senha"],
    "Supprimer": ["Delete", "删除", "Eliminar", "삭제", "Löschen", "削除", "Excluir"],
    "Rôle mis à jour": ["Role updated", "角色已更新", "Rol actualizado", "역할이 업데이트됨", "Rolle aktualisiert", "役割を更新しました", "Função atualizada"],
    "Impossible : il doit rester au moins un admin": ["Not possible: at least one admin must remain", "无法执行：必须至少保留一名管理员", "No es posible: debe quedar al menos un admin", "불가능: 관리자가 최소 한 명은 있어야 합니다", "Nicht möglich: Es muss mindestens ein Admin bleiben", "実行できません：管理者は少なくとも1人必要です", "Não é possível: deve permanecer ao menos um admin"],
    "Réservé aux admins": ["Admins only", "仅限管理员", "Solo para admins", "관리자 전용", "Nur für Admins", "管理者のみ", "Somente admins"],
    "Échec de la mise à jour": ["Update failed", "更新失败", "Error al actualizar", "업데이트 실패", "Aktualisierung fehlgeschlagen", "更新に失敗しました", "Falha na atualização"],
    "6 caractères minimum": ["6 characters minimum", "至少 6 个字符", "Mínimo 6 caracteres", "최소 6자", "Mindestens 6 Zeichen", "6文字以上", "Mínimo de 6 caracteres"],
    "Mot de passe réinitialisé": ["Password reset", "密码已重置", "Contraseña restablecida", "비밀번호가 재설정됨", "Passwort zurückgesetzt", "パスワードをリセットしました", "Senha redefinida"],
    "Échec de la réinitialisation": ["Reset failed", "重置失败", "Error al restablecer", "재설정 실패", "Zurücksetzen fehlgeschlagen", "リセットに失敗しました", "Falha ao redefinir"],
    "Compte supprimé": ["Account deleted", "账户已删除", "Cuenta eliminada", "계정이 삭제됨", "Konto gelöscht", "アカウントを削除しました", "Conta excluída"],
    "Échec de la suppression": ["Deletion failed", "删除失败", "Error al eliminar", "삭제 실패", "Löschen fehlgeschlagen", "削除に失敗しました", "Falha na exclusão"],
    "Compte créé": ["Account created", "账户已创建", "Cuenta creada", "계정이 생성됨", "Konto erstellt", "アカウントを作成しました", "Conta criada"],
    "Ce nom d'utilisateur existe déjà.": ["This username already exists.", "该用户名已存在。", "Este nombre de usuario ya existe.", "이 사용자 이름은 이미 존재합니다.", "Dieser Benutzername existiert bereits.", "このユーザー名はすでに存在します。", "Este nome de usuário já existe."],
    "Seul un admin peut créer un compte admin.": ["Only an admin can create an admin account.", "只有管理员才能创建管理员账户。", "Solo un admin puede crear una cuenta de admin.", "관리자만 관리자 계정을 만들 수 있습니다.", "Nur ein Admin kann ein Admin-Konto erstellen.", "管理者アカウントを作成できるのは管理者のみです。", "Apenas um admin pode criar uma conta de admin."],
    "Mot de passe : 6 caractères minimum.": ["Password: 6 characters minimum.", "密码：至少 6 个字符。", "Contraseña: mínimo 6 caracteres.", "비밀번호: 최소 6자.", "Passwort: mindestens 6 Zeichen.", "パスワード：6文字以上。", "Senha: mínimo de 6 caracteres."],
    "Échec de la création du compte.": ["Failed to create the account.", "账户创建失败。", "Error al crear la cuenta.", "계정 생성 실패.", "Konto konnte nicht erstellt werden.", "アカウントの作成に失敗しました。", "Falha ao criar a conta."],
    "⚠️ L'application ne tourne pas avec les droits administrateur : la création des services Windows et de la règle de pare-feu échouera. Ferme, fais un clic droit sur l'.exe → « Exécuter en tant qu'administrateur ».": ["⚠️ The application is not running with administrator rights: creating Windows services and the firewall rule will fail. Close it, right-click the .exe → \"Run as administrator\".", "⚠️ 应用未以管理员权限运行：创建 Windows 服务和防火墙规则将失败。请关闭后右键点击 .exe → “以管理员身份运行”。", "⚠️ La aplicación no se está ejecutando con derechos de administrador: la creación de los servicios de Windows y de la regla del firewall fallará. Ciérrala y haz clic derecho en el .exe → \"Ejecutar como administrador\".", "⚠️ 애플리케이션이 관리자 권한으로 실행되고 있지 않습니다: Windows 서비스와 방화벽 규칙 생성이 실패합니다. 종료한 후 .exe를 마우스 오른쪽 버튼으로 클릭 → \"관리자 권한으로 실행\".", "⚠️ Die Anwendung läuft nicht mit Administratorrechten: Das Erstellen der Windows-Dienste und der Firewall-Regel wird fehlschlagen. Schließe sie, klicke mit der rechten Maustaste auf die .exe → \"Als Administrator ausführen\".", "⚠️ アプリケーションが管理者権限で実行されていません：Windowsサービスとファイアウォールルールの作成に失敗します。閉じて、.exeを右クリック →「管理者として実行」してください。", "⚠️ O aplicativo não está rodando com direitos de administrador: a criação dos serviços do Windows e da regra de firewall vai falhar. Feche-o, clique com o botão direito no .exe → \"Executar como administrador\"."],
    "État de l'installation": ["Installation status", "安装状态", "Estado de la instalación", "설치 상태", "Installationsstatus", "インストール状況", "Status da instalação"],
    "Installer / configurer le serveur": ["Install / configure the server", "安装 / 配置服务器", "Instalar / configurar el servidor", "서버 설치 / 구성", "Server installieren / konfigurieren", "サーバーをインストール / 設定", "Instalar / configurar o servidor"],
    "Télécharge SteamCMD + le serveur Palworld (12–15 Go), configure": ["Downloads SteamCMD + Palworld server (12–15 GB), configures", "下载 SteamCMD + Palworld 服务器（12–15 GB），配置", "Descarga SteamCMD + el servidor de Palworld (12–15 GB), configura", "SteamCMD + Palworld 서버 (12–15GB)를 다운로드하고 구성합니다", "Lädt SteamCMD + den Palworld-Server (12–15 GB) herunter, konfiguriert", "SteamCMD＋Palworldサーバー（12〜15GB）をダウンロードし、次を設定します：", "Baixa o SteamCMD + servidor Palworld (12–15 GB), configura"],
    ", crée les services Windows (serveur + dashboard) et la règle de pare-feu. NSSM est téléchargé automatiquement.": [", creates Windows services (server + dashboard) and the firewall rule. NSSM is downloaded automatically.", "，创建 Windows 服务（服务器 + 仪表盘）及防火墙规则。NSSM 会自动下载。", ", crea los servicios de Windows (servidor + panel) y la regla del firewall. NSSM se descarga automáticamente.", ", Windows 서비스(서버 + 대시보드)와 방화벽 규칙을 생성합니다. NSSM은 자동으로 다운로드됩니다.", ", erstellt die Windows-Dienste (Server + Dashboard) und die Firewall-Regel. NSSM wird automatisch heruntergeladen.", "、Windowsサービス（サーバー＋ダッシュボード）とファイアウォールルールを作成します。NSSMは自動的にダウンロードされます。", ", cria os serviços do Windows (servidor + painel) e a regra de firewall. O NSSM é baixado automaticamente."],
    "Dossier d'installation": ["Install folder", "安装文件夹", "Carpeta de instalación", "설치 폴더", "Installationsordner", "インストールフォルダー", "Pasta de instalação"],
    "ex: D:\\PalworldServer": ["e.g. D:\\PalworldServer", "例：D:\\PalworldServer", "ej.: D:\\PalworldServer", "예: D:\\PalworldServer", "z. B. D:\\PalworldServer", "例：D:\\PalworldServer", "ex.: D:\\PalworldServer"],
    "Arguments de lancement supplémentaires (avancé, optionnel)": ["Additional launch arguments (advanced, optional)", "额外启动参数（高级，可选）", "Argumentos de lanzamiento adicionales (avanzado, opcional)", "추가 실행 인수 (고급, 선택)", "Zusätzliche Startargumente (erweitert, optional)", "追加の起動引数（上級者向け、任意）", "Argumentos de inicialização adicionais (avançado, opcional)"],
    "ex: -publiclobby -NoAsyncLoadingThread": ["e.g. -publiclobby -NoAsyncLoadingThread", "例：-publiclobby -NoAsyncLoadingThread", "ej.: -publiclobby -NoAsyncLoadingThread", "예: -publiclobby -NoAsyncLoadingThread", "z. B. -publiclobby -NoAsyncLoadingThread", "例：-publiclobby -NoAsyncLoadingThread", "ex.: -publiclobby -NoAsyncLoadingThread"],
    "PalServer.exe sera installé dans :": ["PalServer.exe will be installed in:", "PalServer.exe 将安装在：", "PalServer.exe se instalará en:", "PalServer.exe가 다음 위치에 설치됩니다:", "PalServer.exe wird installiert in:", "PalServer.exeは次の場所にインストールされます：", "O PalServer.exe será instalado em:"],
    "ex: Chez les copains": ["e.g. My Friends Server", "例：朋友们的服务器", "ej.: El server de los amigos", "예: 친구들 서버", "z. B. Server der Freunde", "例：友達サーバー", "ex.: Servidor dos amigos"],
    "Parcourir…": ["Browse…", "浏览…", "Examinar…", "찾아보기…", "Durchsuchen…", "参照…", "Procurar…"],
    "Mot de passe serveur": ["Server password", "服务器密码", "Contraseña del servidor", "서버 비밀번호", "Serverpasswort", "サーバーパスワード", "Senha do servidor"],
    "optionnel": ["optional", "可选", "opcional", "선택", "optional", "任意", "opcional"],
    "Mot de passe admin (sert aussi à l'API REST)": ["Admin password (also used for the REST API)", "管理员密码（也用于 REST API）", "Contraseña de admin (también para la API REST)", "관리자 비밀번호 (REST API에도 사용됨)", "Admin-Passwort (auch für die REST-API)", "管理者パスワード（REST APIにも使用）", "Senha de admin (também usada na API REST)"],
    "6 caractères minimum — requis": ["Minimum 6 characters — required", "至少 6 个字符——必填", "Mínimo 6 caracteres: obligatorio", "최소 6자 — 필수", "Mindestens 6 Zeichen — erforderlich", "6文字以上 — 必須", "Mínimo de 6 caracteres — obrigatória"],
    "auto si laissé vide": ["auto if left empty", "留空则自动", "auto si se deja vacío", "비워 두면 자동", "automatisch, wenn leer", "空欄の場合は自動", "automática se deixada vazia"],
    "Échec de l'installation.": ["Installation failed.", "安装失败。", "Error en la instalación.", "설치 실패.", "Installation fehlgeschlagen.", "インストールに失敗しました。", "Falha na instalação."],
    "Lancer le dashboard": ["Launch the dashboard", "启动仪表盘", "Iniciar el panel", "대시보드 실행", "Dashboard starten", "ダッシュボードを起動", "Iniciar o painel"],
    "Ouvrir dans le navigateur": ["Open in browser", "在浏览器中打开", "Abrir en el navegador", "브라우저에서 열기", "Im Browser öffnen", "ブラウザーで開く", "Abrir no navegador"],
    "Dashboard démarré": ["Dashboard started", "仪表盘已启动", "Panel iniciado", "대시보드 시작됨", "Dashboard gestartet", "ダッシュボードを起動しました", "Painel iniciado"],
    "Dashboard arrêté": ["Dashboard stopped", "仪表盘已停止", "Panel detenido", "대시보드 중지됨", "Dashboard gestoppt", "ダッシュボードを停止しました", "Painel parado"],
    "Dashboard : en ligne": ["Dashboard: online", "仪表盘：在线", "Panel: en línea", "대시보드: 온라인", "Dashboard: online", "ダッシュボード：オンライン", "Painel: online"],
    "Dashboard : arrêté": ["Dashboard: stopped", "仪表盘：已停止", "Panel: detenido", "대시보드: 중지됨", "Dashboard: gestoppt", "ダッシュボード：停止中", "Painel: parado"],
    "Dashboard : non installé": ["Dashboard: not installed", "仪表盘：未安装", "Panel: no instalado", "대시보드: 설치되지 않음", "Dashboard: nicht installiert", "ダッシュボード：未インストール", "Painel: não instalado"],
    "Journal d'installation": ["Installation log", "安装日志", "Registro de instalación", "설치 로그", "Installationsprotokoll", "インストールログ", "Registro de instalação"],
    "Services Windows": ["Windows services", "Windows 服务", "Servicios de Windows", "Windows 서비스", "Windows-Dienste", "Windowsサービス", "Serviços do Windows"],
    "Recrée ou supprime les services (serveur + dashboard) sans re-télécharger. La désinstallation ne touche ni au serveur ni aux sauvegardes.": ["Recreates or removes services (server + dashboard) without re-downloading. Uninstallation does not touch the server or backups.", "重新创建或删除服务（服务器 + 仪表盘），无需重新下载。卸载不会影响服务器和备份。", "Recrea o elimina los servicios (servidor + panel) sin volver a descargar. La desinstalación no toca ni el servidor ni las copias.", "다시 다운로드하지 않고 서비스(서버 + 대시보드)를 다시 생성하거나 삭제합니다. 제거는 서버나 백업에 영향을 주지 않습니다.", "Erstellt oder entfernt die Dienste (Server + Dashboard) ohne erneuten Download. Die Deinstallation betrifft weder den Server noch die Backups.", "再ダウンロードせずにサービス（サーバー＋ダッシュボード）を再作成または削除します。アンインストールしてもサーバーやバックアップには影響しません。", "Recria ou remove os serviços (servidor + painel) sem baixar de novo. A desinstalação não afeta o servidor nem os backups."],
    "À partager avec tes amis (après redirection de port sur ta box) :": ["Share with your friends (after port forwarding on your router):", "分享给朋友（需先在路由器上做端口转发）：", "Para compartir con tus amigos (tras redirigir el puerto en tu router):", "친구들과 공유하세요 (공유기 포트 포워딩 후):", "Zum Teilen mit deinen Freunden (nach Portweiterleitung im Router):", "友達と共有（ルーターでポート転送の設定後）：", "Compartilhe com seus amigos (após redirecionar a porta no seu roteador):"],
    "(Ré)installer": ["(Re)install", "（重新）安装", "(Re)instalar", "(재)설치", "(Neu) installieren", "（再）インストール", "(Re)instalar"],
    "Services installés": ["Services installed", "服务已安装", "Servicios instalados", "서비스 설치됨", "Dienste installiert", "サービスをインストールしました", "Serviços instalados"],
    "Services désinstallés": ["Services uninstalled", "服务已卸载", "Servicios desinstalados", "서비스 제거됨", "Dienste deinstalliert", "サービスをアンインストールしました", "Serviços desinstalados"],
    "Supprimer les services Windows (serveur + dashboard) ? Le serveur installé et les sauvegardes ne sont pas touchés.": ["Remove the Windows services (server + dashboard)? The installed server and backups are not affected.", "删除 Windows 服务（服务器 + 仪表盘）？已安装的服务器和备份不受影响。", "¿Eliminar los servicios de Windows (servidor + panel)? El servidor instalado y las copias no se ven afectados.", "Windows 서비스(서버 + 대시보드)를 삭제할까요? 설치된 서버와 백업은 영향을 받지 않습니다.", "Die Windows-Dienste (Server + Dashboard) entfernen? Der installierte Server und die Backups sind nicht betroffen.", "Windowsサービス（サーバー＋ダッシュボード）を削除しますか？インストール済みのサーバーとバックアップには影響しません。", "Remover os serviços do Windows (servidor + painel)? O servidor instalado e os backups não são afetados."],
    "Échec de l'installation": ["Installation failed", "安装失败", "Error en la instalación", "설치 실패", "Installation fehlgeschlagen", "インストールに失敗しました", "Falha na instalação"],
    "Pense à": ["Remember to", "记得", "Recuerda", "잊지 마세요", "Denk daran", "お忘れなく：", "Lembre-se de"],
    "Droits administrateur": ["Administrator rights", "管理员权限", "Derechos de administrador", "관리자 권한", "Administratorrechte", "管理者権限", "Direitos de administrador"],
    "Service serveur enregistré": ["Server service registered", "服务器服务已注册", "Servicio del servidor registrado", "서버 서비스 등록됨", "Server-Dienst registriert", "サーバーサービスを登録済み", "Serviço do servidor registrado"],
    "Service dashboard enregistré": ["Dashboard service registered", "仪表盘服务已注册", "Servicio del panel registrado", "대시보드 서비스 등록됨", "Dashboard-Dienst registriert", "ダッシュボードサービスを登録済み", "Serviço do painel registrado"],
    "Créer le compte": ["Create account", "创建账户", "Crear cuenta", "계정 만들기", "Konto erstellen", "アカウントを作成", "Criar conta"],
    "Mot de passe (6 car. min.)": ["Password (6 chars min.)", "密码（至少 6 个字符）", "Contraseña (mín. 6 caracteres)", "비밀번호 (최소 6자)", "Passwort (mind. 6 Zeichen)", "パスワード（6文字以上）", "Senha (mín. 6 caracteres)"],
    "Aucun compte — crée le premier ci-dessous.": ["No accounts yet — create the first one below.", "暂无账户——请在下方创建第一个。", "Sin cuentas: crea la primera abajo.", "계정이 없습니다 — 아래에서 첫 번째 계정을 만드세요.", "Keine Konten — erstelle unten das erste.", "まだアカウントがありません — 下で最初のアカウントを作成してください。", "Ainda sem contas — crie a primeira abaixo."],
    "Nom d'utilisateur et mot de passe requis.": ["Username and password required.", "用户名和密码为必填。", "Se requieren nombre de usuario y contraseña.", "사용자 이름과 비밀번호가 필요합니다.", "Benutzername und Passwort erforderlich.", "ユーザー名とパスワードが必要です。", "Nome de usuário e senha obrigatórios."],
    "Ce compte existe déjà.": ["This account already exists.", "该账户已存在。", "Esta cuenta ya existe.", "이 계정은 이미 존재합니다.", "Dieses Konto existiert bereits.", "このアカウントはすでに存在します。", "Esta conta já existe."],
    "Échec de la création.": ["Creation failed.", "创建失败。", "Error al crear.", "생성 실패.", "Erstellung fehlgeschlagen.", "作成に失敗しました。", "Falha na criação."],
    "Aucune configuration enregistrée — fais d'abord une installation complète (étape 2).": ["No configuration saved yet — do a full installation first (step 2).", "尚无保存的配置——请先完成完整安装（第 2 步）。", "Sin configuración guardada: haz primero una instalación completa (paso 2).", "저장된 구성이 없습니다 — 먼저 전체 설치를 완료하세요 (2단계).", "Keine Konfiguration gespeichert — führe zuerst eine vollständige Installation durch (Schritt 2).", "保存された設定がありません — 先に完全なインストールを行ってください（ステップ2）。", "Nenhuma configuração salva ainda — faça uma instalação completa primeiro (etapa 2)."],
    "télécharger sur GitHub": ["download on GitHub", "在 GitHub 上下载", "descargar en GitHub", "GitHub에서 다운로드", "auf GitHub herunterladen", "GitHubでダウンロード", "baixar no GitHub"],
    "Zone danger": ["Danger zone", "危险区域", "Zona de peligro", "위험 구역", "Gefahrenzone", "危険ゾーン", "Zona de perigo"],
    "Réinitialiser le monde supprime la sauvegarde actuelle : à la prochaine mise en route, le serveur repart d'un monde tout neuf (progression, bases et niveaux perdus). Une sauvegarde de sécurité est prise automatiquement avant. Le serveur doit être arrêté.": ["Resetting the world deletes the current save: on next startup, the server starts from a brand-new world (progress, bases and levels lost). A safety backup is taken automatically first. The server must be stopped.", "重置世界会删除当前存档：下次启动时服务器将从全新世界开始（进度、基地和等级都会丢失）。系统会先自动创建一份安全备份。服务器必须处于停止状态。", "Reiniciar el mundo elimina la partida actual: en el próximo arranque, el servidor empezará con un mundo nuevo (se pierden progreso, bases y niveles). Antes se hace automáticamente una copia de seguridad. El servidor debe estar detenido.", "월드를 초기화하면 현재 저장 데이터가 삭제됩니다: 다음 시작 시 서버는 완전히 새로운 월드로 시작합니다 (진행 상황, 거점, 레벨이 사라짐). 먼저 안전 백업이 자동으로 생성됩니다. 서버는 중지되어 있어야 합니다.", "Das Zurücksetzen der Welt löscht den aktuellen Spielstand: Beim nächsten Start beginnt der Server mit einer brandneuen Welt (Fortschritt, Basen und Level gehen verloren). Vorher wird automatisch ein Sicherheits-Backup erstellt. Der Server muss gestoppt sein.", "ワールドをリセットすると現在のセーブデータが削除されます：次回起動時、サーバーはまったく新しいワールドから始まります（進行状況、拠点、レベルが失われます）。先に安全バックアップが自動的に作成されます。サーバーは停止している必要があります。", "Reiniciar o mundo exclui o save atual: na próxima inicialização, o servidor começa de um mundo totalmente novo (progresso, bases e níveis perdidos). Um backup de segurança é feito automaticamente antes. O servidor deve estar parado."],
    "Réinitialiser le monde (supprimer la sauvegarde)": ["Reset world (delete save)", "重置世界（删除存档）", "Reiniciar mundo (eliminar partida)", "월드 초기화 (저장 삭제)", "Welt zurücksetzen (Spielstand löschen)", "ワールドをリセット（セーブを削除）", "Reiniciar mundo (excluir save)"],
    "Réinitialiser le monde ? La sauvegarde actuelle sera supprimée et le serveur repartira d'un monde neuf au prochain démarrage. Une sauvegarde de sécurité est prise avant. Le serveur doit être arrêté.": ["Reset the world? The current save will be deleted and the server will start from a new world on next startup. A safety backup is taken first. The server must be stopped.", "重置世界？当前存档将被删除，服务器将在下次启动时从新世界开始。系统会先创建安全备份。服务器必须已停止。", "¿Reiniciar el mundo? La partida actual se eliminará y el servidor empezará con un mundo nuevo en el próximo arranque. Antes se hace una copia de seguridad. El servidor debe estar detenido.", "월드를 초기화할까요? 현재 저장 데이터가 삭제되고 서버는 다음 시작 시 새 월드로 시작됩니다. 먼저 안전 백업이 생성됩니다. 서버는 중지되어 있어야 합니다.", "Die Welt zurücksetzen? Der aktuelle Spielstand wird gelöscht und der Server startet beim nächsten Start mit einer neuen Welt. Vorher wird ein Sicherheits-Backup erstellt. Der Server muss gestoppt sein.", "ワールドをリセットしますか？現在のセーブデータが削除され、次回起動時にサーバーは新しいワールドから始まります。先に安全バックアップが作成されます。サーバーは停止している必要があります。", "Reiniciar o mundo? O save atual será excluído e o servidor começará de um novo mundo na próxima inicialização. Um backup de segurança é feito antes. O servidor deve estar parado."],
    "Dernière confirmation : supprimer définitivement le monde actuel ?": ["Final confirmation: permanently delete the current world?", "最后确认：永久删除当前世界？", "Confirmación final: ¿eliminar definitivamente el mundo actual?", "최종 확인: 현재 월드를 영구적으로 삭제할까요?", "Letzte Bestätigung: die aktuelle Welt endgültig löschen?", "最終確認：現在のワールドを完全に削除しますか？", "Confirmação final: excluir permanentemente o mundo atual?"],
    "Réinitialisation du monde…": ["Resetting the world…", "正在重置世界…", "Reiniciando el mundo…", "월드 초기화 중…", "Welt wird zurückgesetzt…", "ワールドをリセット中…", "Reiniciando o mundo…"],
    "Monde réinitialisé": ["World reset", "世界已重置", "Mundo reiniciado", "월드 초기화됨", "Welt zurückgesetzt", "ワールドをリセットしました", "Mundo reiniciado"],
    "Ancien monde conservé dans une sauvegarde de sécurité. Démarre le serveur pour générer un nouveau monde.": ["Previous world kept in a safety backup. Start the server to generate a new world.", "原世界已保存在一份安全备份中。启动服务器即可生成新世界。", "El mundo anterior se guardó en una copia de seguridad. Inicia el servidor para generar un mundo nuevo.", "이전 월드는 안전 백업에 보관되었습니다. 서버를 시작하면 새 월드가 생성됩니다.", "Vorherige Welt in einem Sicherheits-Backup gespeichert. Starte den Server, um eine neue Welt zu erzeugen.", "以前のワールドは安全バックアップに保存されています。サーバーを起動すると新しいワールドが生成されます。", "Mundo anterior mantido em um backup de segurança. Inicie o servidor para gerar um novo mundo."],
    "Réinitialisation annulée": ["Reset cancelled", "重置已取消", "Reinicio cancelado", "초기화 취소됨", "Zurücksetzen abgebrochen", "リセットをキャンセルしました", "Reinício cancelado"],
  };

  // ---------- Motifs (textes contenant des variables) : [regex, en, zh, es] ----------
  const PATTERNS = [
    [/^— (\d+) joueur\(s\) connecté\(s\)$/, "— $1 player(s) online", "— $1 名玩家在线", "— $1 jugador(es) en línea", "— $1명 접속 중", "— $1 Spieler online", "— $1 人がオンライン", "— $1 jogador(es) online"],
    [/^(\d+)j (\d+)h (\d+)min$/, "$1d $2h $3min", "$1天 $2小时 $3分钟", "$1d $2h $3min", "$1일 $2시간 $3분", "$1T $2Std $3min", "$1日 $2時間 $3分", "$1d $2h $3min"],
    [/^⏳ Redémarrage programmé dans ~(\d+) min\.$/, "⏳ Restart scheduled in ~$1 min.", "⏳ 计划于约 $1 分钟后重启。", "⏳ Reinicio programado en ~$1 min.", "⏳ 약 $1분 후 재시작 예약됨.", "⏳ Neustart geplant in ~$1 Min.", "⏳ 約$1分後に再起動が予約されています。", "⏳ Reinício agendado em ~$1 min."],
    [/^Redémarrage programmé dans (\d+) min$/, "Restart scheduled in $1 min", "计划于 $1 分钟后重启", "Reinicio programado en $1 min", "$1분 후 재시작 예약됨", "Neustart geplant in $1 Min.", "$1分後に再起動を予約", "Reinício agendado em $1 min"],
    [/^(UE4SS|PalDefender) (.+) installé — API de commandes prête, plus rien à configurer$/, "$1 $2 installed — Command API ready, nothing left to configure", "$1 $2 已安装——命令 API 就绪，无需其他配置", "$1 $2 instalado: API de comandos lista, nada más que configurar", "$1 $2 설치됨 — 명령 API 준비 완료, 추가 구성 불필요", "$1 $2 installiert — Befehls-API bereit, nichts mehr zu konfigurieren", "$1 $2 をインストールしました — コマンドAPIの準備が完了、設定は不要です", "$1 $2 instalado — API de comandos pronta, nada mais a configurar"],
    [/^(UE4SS|PalDefender) (.+) installé$/, "$1 $2 installed", "$1 $2 已安装", "$1 $2 instalado", "$1 $2 설치됨", "$1 $2 installiert", "$1 $2 をインストールしました", "$1 $2 instalado"],
    [/^(UE4SS|PalDefender) désinstallé$/, "$1 uninstalled", "$1 已卸载", "$1 desinstalado", "$1 제거됨", "$1 deinstalliert", "$1 をアンインストールしました", "$1 desinstalado"],
    [/^Échec de l'installation de (.+)$/, "Failed to install $1", "$1 安装失败", "Error al instalar $1", "$1 설치 실패", "Installation von $1 fehlgeschlagen", "$1 のインストールに失敗しました", "Falha ao instalar $1"],
    [/^Échec de la désinstallation de (.+)$/, "Failed to uninstall $1", "$1 卸载失败", "Error al desinstalar $1", "$1 제거 실패", "Deinstallation von $1 fehlgeschlagen", "$1 のアンインストールに失敗しました", "Falha ao desinstalar $1"],
    [/^Installer\/mettre à jour (.+) vers la dernière version \? Le serveur doit être éteint\.$/, "Install/update $1 to the latest version? The server must be stopped.", "安装/更新 $1 到最新版本？服务器必须处于停止状态。", "¿Instalar/actualizar $1 a la última versión? El servidor debe estar detenido.", "$1을(를) 최신 버전으로 설치/업데이트할까요? 서버가 중지되어 있어야 합니다.", "$1 auf die neueste Version installieren/aktualisieren? Der Server muss gestoppt sein.", "$1 を最新版にインストール/更新しますか？サーバーは停止している必要があります。", "Instalar/atualizar $1 para a última versão? O servidor deve estar parado."],
    [/^Désinstaller (.+) \? Le serveur doit être éteint\.$/, "Uninstall $1? The server must be stopped.", "卸载 $1？服务器必须处于停止状态。", "¿Desinstalar $1? El servidor debe estar detenido.", "$1을(를) 제거할까요? 서버가 중지되어 있어야 합니다.", "$1 deinstallieren? Der Server muss gestoppt sein.", "$1 をアンインストールしますか？サーバーは停止している必要があります。", "Desinstalar $1? O servidor deve estar parado."],
    [/^✅ Installé — (.+)$/, "✅ Installed — $1", "✅ 已安装 — $1", "✅ Instalado — $1", "✅ 설치됨 — $1", "✅ Installiert — $1", "✅ インストール済み — $1", "✅ Instalado — $1"],
    [/^Jeton importé \((.+)\) — pense à mettre Enabled: true dans RESTConfig\.json puis à redémarrer le serveur$/, "Token imported ($1) — remember to set Enabled: true in RESTConfig.json then restart the server", "令牌已导入（$1）——记得在 RESTConfig.json 中设置 Enabled: true，然后重启服务器", "Token importado ($1): recuerda poner Enabled: true en RESTConfig.json y reiniciar el servidor", "토큰을 가져왔습니다 ($1) — RESTConfig.json에서 Enabled: true로 설정한 후 서버를 재시작하세요", "Token importiert ($1) — denk daran, in RESTConfig.json Enabled: true zu setzen und den Server neu zu starten", "トークンをインポートしました（$1） — RESTConfig.jsonでEnabled: trueに設定してからサーバーを再起動してください", "Token importado ($1) — lembre-se de definir Enabled: true no RESTConfig.json e reiniciar o servidor"],
    [/^Jeton importé \((.+)\)$/, "Token imported ($1)", "令牌已导入（$1）", "Token importado ($1)", "토큰을 가져왔습니다 ($1)", "Token importiert ($1)", "トークンをインポートしました（$1）", "Token importado ($1)"],
    [/^Échec : (.+)$/, "Failed: $1", "失败：$1", "Error: $1", "실패: $1", "Fehlgeschlagen: $1", "失敗しました：$1", "Falhou: $1"],
    [/^PalServer\.exe introuvable dans "(.+)" — vérifie le dossier indiqué \(celui qui contient PalServer\.exe directement\)\.$/, "PalServer.exe not found in \"$1\" — check the folder you provided (the one that directly contains PalServer.exe).", "在 \"$1\" 中未找到 PalServer.exe——请检查所指定的文件夹（应直接包含 PalServer.exe）。", "PalServer.exe no encontrado en \"$1\": comprueba la carpeta indicada (la que contiene directamente PalServer.exe).", "\"$1\"에서 PalServer.exe를 찾을 수 없습니다 — 지정한 폴더를 확인하세요 (PalServer.exe를 직접 포함하는 폴더).", "PalServer.exe in \"$1\" nicht gefunden — überprüfe den angegebenen Ordner (der direkt PalServer.exe enthält).", "「$1」にPalServer.exeが見つかりません — 指定したフォルダー（PalServer.exeを直接含むフォルダー）を確認してください。", "PalServer.exe não encontrado em \"$1\" — verifique a pasta informada (a que contém o PalServer.exe diretamente)."],
    [/^⬆️ (v[\d.]+) → (v[\d.]+) disponible$/, "⬆️ $1 → $2 available", "⬆️ 新版本可用：$1 → $2", "⬆️ $1 → $2 disponible", "⬆️ $1 → $2 사용 가능", "⬆️ $1 → $2 verfügbar", "⬆️ $1 → $2 が利用可能", "⬆️ $1 → $2 disponível"],
    [/^Bannir (.+) \? Il sera déconnecté et ne pourra plus se reconnecter\.$/, "Ban $1? They will be disconnected and unable to reconnect.", "封禁 $1？该玩家将被断开且无法再连接。", "¿Banear a $1? Será desconectado y no podrá volver a conectarse.", "$1을(를) 차단할까요? 연결이 끊기고 다시 접속할 수 없습니다.", "$1 bannen? Wird getrennt und kann sich nicht mehr verbinden.", "$1 をBANしますか？切断され、再接続できなくなります。", "Banir $1? Ele será desconectado e não poderá reconectar."],
    [/^Bannir (.+) \? Il sera déconnecté \(s'il est en ligne\) et ne pourra plus se reconnecter\.$/, "Ban $1? They will be disconnected (if online) and unable to reconnect.", "封禁 $1？该玩家（若在线）将被断开且无法再连接。", "¿Banear a $1? Será desconectado (si está en línea) y no podrá volver a conectarse.", "$1을(를) 차단할까요? (온라인인 경우) 연결이 끊기고 다시 접속할 수 없습니다.", "$1 bannen? Wird (falls online) getrennt und kann sich nicht mehr verbinden.", "$1 をBANしますか？（オンラインの場合）切断され、再接続できなくなります。", "Banir $1? Ele será desconectado (se estiver online) e não poderá reconectar."],
    [/^— banni le (.+)$/, "— banned on $1", "— 封禁于 $1", "— baneado el $1", "— $1에 차단됨", "— gebannt am $1", "— $1 にBAN", "— banido em $1"],
    [/ — banni le (.+)$/, " — banned on $1", " — 封禁于 $1", " — baneado el $1", " — $1에 차단됨", " — gebannt am $1", " — $1 にBAN", " — banido em $1"],
    [/^parti à (.+)$/, "left at $1", "于 $1 离开", "salió a las $1", "$1에 퇴장", "verlassen um $1", "$1 に退出", "saiu às $1"],
    [/^([\d.]+) h au total$/, "$1 h total", "总计 $1 小时", "$1 h en total", "총 $1시간", "$1 Std insgesamt", "合計 $1 時間", "$1 h no total"],
    [/^Restaurer "(.+)" \? Le monde actuel sera remplacé \(une sauvegarde de sécurité du monde actuel sera prise avant\)\. Le serveur doit être éteint\.$/, "Restore \"$1\"? The current world will be replaced (a safety backup of the current world is taken first). The server must be stopped.", "恢复 \"$1\"？当前世界将被替换（会先对当前世界做一次安全备份）。服务器必须处于停止状态。", "¿Restaurar \"$1\"? El mundo actual será reemplazado (antes se hace una copia de seguridad del mundo actual). El servidor debe estar detenido.", "\"$1\"을(를) 복원할까요? 현재 월드가 대체됩니다 (먼저 현재 월드의 안전 백업이 생성됩니다). 서버가 중지되어 있어야 합니다.", "\"$1\" wiederherstellen? Die aktuelle Welt wird ersetzt (vorher wird ein Sicherheits-Backup der aktuellen Welt erstellt). Der Server muss gestoppt sein.", "「$1」を復元しますか？現在のワールドが置き換えられます（先に現在のワールドの安全バックアップが作成されます）。サーバーは停止している必要があります。", "Restaurar \"$1\"? O mundo atual será substituído (um backup de segurança do mundo atual é feito antes). O servidor deve estar parado."],
    [/^Restauré \(ancien monde sauvegardé sous (.+)\)$/, "Restored (previous world saved as $1)", "已恢复（原世界已另存为 $1）", "Restaurado (mundo anterior guardado como $1)", "복원됨 (이전 월드는 $1(으)로 저장됨)", "Wiederhergestellt (vorherige Welt gespeichert als $1)", "復元しました（以前のワールドは $1 として保存）", "Restaurado (mundo anterior salvo como $1)"],
    [/^Import de (.+) en cours…$/, "Importing $1…", "正在导入 $1…", "Importando $1…", "$1 가져오는 중…", "$1 wird importiert…", "$1 をインポート中…", "Importando $1…"],
    [/^Sauvegarde importée : (.+)$/, "Backup imported: $1", "备份已导入：$1", "Copia importada: $1", "백업을 가져왔습니다: $1", "Backup importiert: $1", "バックアップをインポートしました：$1", "Backup importado: $1"],
    [/ — ([\d.]+) Mo$/, " — $1 MB", " — $1 MB", " — $1 MB", " — $1 MB", " — $1 MB", " — $1 MB", " — $1 MB"],
    [/^⚠️ Espace disque faible : (.+)$/, "⚠️ Low disk space: $1", "⚠️ 磁盘空间不足：$1", "⚠️ Poco espacio en disco: $1", "⚠️ 디스크 공간 부족: $1", "⚠️ Wenig Speicherplatz: $1", "⚠️ ディスク空き容量不足：$1", "⚠️ Pouco espaço em disco: $1"],
    [/([\d.]+) Go libres/g, "$1 GB free", "剩余 $1 GB", "$1 GB libres", "$1 GB 남음", "$1 GB frei", "空き $1 GB", "$1 GB livres"],
    [/(\d+) Mo libres/g, "$1 MB free", "剩余 $1 MB", "$1 MB libres", "$1 MB 남음", "$1 MB frei", "空き $1 MB", "$1 MB livres"],
    [/^Enregistrer (\d+) réglage\(s\) modifié\(s\) \? Ils s'appliqueront au prochain démarrage du serveur\.$/, "Save $1 modified setting(s)? They will apply at the next server start.", "保存 $1 项已修改的设置？将在服务器下次启动时生效。", "¿Guardar $1 ajuste(s) modificado(s)? Se aplicarán en el próximo arranque del servidor.", "수정된 설정 $1개를 저장할까요? 다음 서버 시작 시 적용됩니다.", "$1 geänderte Einstellung(en) speichern? Sie werden beim nächsten Serverstart angewendet.", "変更した $1 個の設定を保存しますか？次回のサーバー起動時に適用されます。", "Salvar $1 configuração(ões) modificada(s)? Serão aplicadas no próximo início do servidor."],
    [/^(\d+) réglage\(s\) enregistré\(s\)$/, "$1 setting(s) saved", "已保存 $1 项设置", "$1 ajuste(s) guardado(s)", "설정 $1개 저장됨", "$1 Einstellung(en) gespeichert", "$1 個の設定を保存しました", "$1 configuração(ões) salva(s)"],
    [/^Échec de l'enregistrement \((.+)\)$/, "Failed to save ($1)", "保存失败（$1）", "Error al guardar ($1)", "저장 실패 ($1)", "Speichern fehlgeschlagen ($1)", "保存に失敗しました（$1）", "Falha ao salvar ($1)"],
    [/^⬆️ Mise à jour disponible : build (.+) → (.+)\.$/, "⬆️ Update available: build $1 → $2.", "⬆️ 有可用更新：版本 $1 → $2。", "⬆️ Actualización disponible: build $1 → $2.", "⬆️ 업데이트 사용 가능: 빌드 $1 → $2.", "⬆️ Update verfügbar: Build $1 → $2.", "⬆️ 更新が利用可能：ビルド $1 → $2。", "⬆️ Atualização disponível: build $1 → $2."],
    [/^✅ Serveur à jour \(build (.+)\)\.$/, "✅ Server up to date (build $1).", "✅ 服务器已是最新（版本 $1）。", "✅ Servidor al día (build $1).", "✅ 서버가 최신 상태입니다 (빌드 $1).", "✅ Server aktuell (Build $1).", "✅ サーバーは最新です（ビルド $1）。", "✅ Servidor atualizado (build $1)."],
    [/^Build installé illisible — dernier build Steam : (.+)\.$/, "Installed build unreadable — latest Steam build: $1.", "无法读取已安装版本——Steam 最新版本：$1。", "Build instalada ilegible: última build de Steam: $1.", "설치된 빌드를 읽을 수 없음 — 최신 Steam 빌드: $1.", "Installierter Build nicht lesbar — neuester Steam-Build: $1.", "インストール済みビルドを読み取れません — 最新のSteamビルド：$1。", "Build instalada ilegível — última build da Steam: $1."],
    [/^Échec de la vérification : (.+)$/, "Check failed: $1", "检查失败：$1", "Error en la comprobación: $1", "확인 실패: $1", "Prüfung fehlgeschlagen: $1", "確認に失敗しました：$1", "Falha na verificação: $1"],
    [/^Échec de l'installation : (.*)$/, "Installation failed: $1", "安装失败：$1", "Error en la instalación: $1", "설치 실패: $1", "Installation fehlgeschlagen: $1", "インストールに失敗しました：$1", "Falha na instalação: $1"],
    [/^Supprimer le compte "(.+)" \?$/, "Delete the account \"$1\"?", "删除账户 \"$1\"？", "¿Eliminar la cuenta \"$1\"?", "계정 \"$1\"을(를) 삭제할까요?", "Konto \"$1\" löschen?", "アカウント「$1」を削除しますか？", "Excluir a conta \"$1\"?"],
    [/^Nouveau mot de passe pour (.+) :$/, "New password for $1:", "$1 的新密码：", "Nueva contraseña para $1:", "$1의 새 비밀번호:", "Neues Passwort für $1:", "$1 の新しいパスワード：", "Nova senha para $1:"],
    [/^⬆️ Nouvelle version du dashboard disponible :$/, "⬆️ New dashboard version available:", "⬆️ 仪表盘有新版本可用：", "⬆️ Nueva versión del panel disponible:", "⬆️ 새 대시보드 버전 사용 가능:", "⬆️ Neue Dashboard-Version verfügbar:", "⬆️ 新しいダッシュボードのバージョンが利用可能：", "⬆️ Nova versão do painel disponível:"],
    [/^\(tu utilises la v([\d.]+)\) —$/, "(you are on v$1) —", "（当前版本 v$1）—", "(estás en la v$1) —", "(현재 v$1 사용 중) —", "(du nutzt v$1) —", "（現在 v$1） —", "(você está na v$1) —"],
    [/ — tous les jours — /, " — every day — ", " — 每天 — ", " — todos los días — ", " — 매일 — ", " — täglich — ", " — 毎日 — ", " — todos os dias — "],
    [/(\d+) sauvegardes conservées\.$/, "$1 backups kept.", "保留 $1 个备份。", "$1 copias conservadas.", "백업 $1개 보관됨.", "$1 Backups aufbewahrt.", "バックアップを $1 個保持。", "$1 backups mantidos."],
    [/avertissement (\d+) min avant\.$/, "warning $1 min before.", "提前 $1 分钟提醒。", "aviso $1 min antes.", "재시작 $1분 전 경고.", "Warnung $1 Min. vorher.", "$1分前に警告。", "aviso $1 min antes."],
    [/ a rejoint le serveur$/, " joined the server", " 加入了服务器", " se unió al servidor", " 님이 서버에 접속했습니다", " ist dem Server beigetreten", " がサーバーに参加しました", " entrou no servidor"],
    [/ a quitté le serveur(?=$| — )/, " left the server", " 离开了服务器", " salió del servidor", " 님이 서버에서 나갔습니다", " hat den Server verlassen", " がサーバーから退出しました", " saiu do servidor"],
    [/ a démarré le serveur(?=$| — )/, " started the server", " 启动了服务器", " inició el servidor", " 님이 서버를 시작했습니다", " hat den Server gestartet", " がサーバーを起動しました", " iniciou o servidor"],
    [/ a arrêté le serveur(?=$| — )/, " stopped the server", " 停止了服务器", " detuvo el servidor", " 님이 서버를 중지했습니다", " hat den Server gestoppt", " がサーバーを停止しました", " parou o servidor"],
    [/ a forcé l'arrêt du serveur(?=$| — )/, " force-stopped the server", " 强制停止了服务器", " forzó la detención del servidor", " 님이 서버를 강제 중지했습니다", " hat den Server-Stopp erzwungen", " がサーバーを強制停止しました", " forçou a parada do servidor"],
    [/ a redémarré le serveur(?=$| — )/, " restarted the server", " 重启了服务器", " reinició el servidor", " 님이 서버를 재시작했습니다", " hat den Server neu gestartet", " がサーバーを再起動しました", " reiniciou o servidor"],
    [/ a lancé une sauvegarde(?=$| — )/, " started a backup", " 发起了一次备份", " lanzó una copia de seguridad", " 님이 백업을 시작했습니다", " hat ein Backup gestartet", " がバックアップを開始しました", " iniciou um backup"],
    [/ a sauvegardé le monde(?=$| — )/, " saved the world", " 保存了世界", " guardó el mundo", " 님이 월드를 저장했습니다", " hat die Welt gespeichert", " がワールドを保存しました", " salvou o mundo"],
    [/ a envoyé une annonce(?=$| — )/, " sent an announcement", " 发送了公告", " envió un anuncio", " 님이 공지를 보냈습니다", " hat eine Ankündigung gesendet", " がアナウンスを送信しました", " enviou um anúncio"],
    [/ a exclu un joueur(?=$| — )/, " kicked a player", " 踢出了一名玩家", " expulsó a un jugador", " 님이 플레이어를 추방했습니다", " hat einen Spieler gekickt", " がプレイヤーをキックしました", " expulsou um jogador"],
    [/ a banni un joueur(?=$| — )/, " banned a player", " 封禁了一名玩家", " baneó a un jugador", " 님이 플레이어를 차단했습니다", " hat einen Spieler gebannt", " がプレイヤーをBANしました", " baniu um jogador"],
    [/ a débanni un joueur(?=$| — )/, " unbanned a player", " 解封了一名玩家", " desbaneó a un jugador", " 님이 플레이어를 차단 해제했습니다", " hat einen Spieler entbannt", " がプレイヤーのBANを解除しました", " desbaniu um jogador"],
    [/ a programmé un redémarrage(?=$| — )/, " scheduled a restart", " 计划了一次重启", " programó un reinicio", " 님이 재시작을 예약했습니다", " hat einen Neustart geplant", " が再起動を予約しました", " agendou um reinício"],
    [/ a annulé le redémarrage programmé(?=$| — )/, " cancelled the scheduled restart", " 取消了计划的重启", " canceló el reinicio programado", " 님이 예약된 재시작을 취소했습니다", " hat den geplanten Neustart abgebrochen", " が予約された再起動をキャンセルしました", " cancelou o reinício agendado"],
    [/ a vérifié les mises à jour(?=$| — )/, " checked for updates", " 检查了更新", " buscó actualizaciones", " 님이 업데이트를 확인했습니다", " hat nach Updates gesucht", " が更新を確認しました", " verificou atualizações"],
    [/ a lancé une mise à jour du serveur(?=$| — )/, " started a server update", " 发起了服务器更新", " lanzó una actualización del servidor", " 님이 서버 업데이트를 시작했습니다", " hat ein Server-Update gestartet", " がサーバー更新を開始しました", " iniciou uma atualização do servidor"],
    [/ a modifié les réglages du monde(?=$| — )/, " changed the world settings", " 修改了世界设置", " cambió los ajustes del mundo", " 님이 월드 설정을 변경했습니다", " hat die Welteinstellungen geändert", " がワールド設定を変更しました", " alterou as configurações do mundo"],
    [/ a modifié le planning des sauvegardes(?=$| — )/, " changed the backup schedule", " 修改了备份计划", " cambió la programación de copias", " 님이 백업 일정을 변경했습니다", " hat den Backup-Zeitplan geändert", " がバックアップスケジュールを変更しました", " alterou o agendamento de backups"],
    [/ a modifié le planning de redémarrage(?=$| — )/, " changed the restart schedule", " 修改了重启计划", " cambió la programación de reinicio", " 님이 재시작 일정을 변경했습니다", " hat den Neustart-Zeitplan geändert", " が再起動スケジュールを変更しました", " alterou o agendamento de reinício"],
    [/ a restauré une sauvegarde(?=$| — )/, " restored a backup", " 恢复了一个备份", " restauró una copia", " 님이 백업을 복원했습니다", " hat ein Backup wiederhergestellt", " がバックアップを復元しました", " restaurou um backup"],
    [/ échec de la sauvegarde planifiée(?=$| — )/, " scheduled backup failed", " 计划备份失败", " fallo en la copia programada", " 예약 백업 실패", " geplantes Backup fehlgeschlagen", " 予約バックアップが失敗しました", " falha no backup agendado"],
    [/ a échoué à restaurer une sauvegarde(?=$| — )/, " failed to restore a backup", " 恢复备份失败", " falló al restaurar una copia", " 님이 백업 복원에 실패했습니다", " konnte ein Backup nicht wiederherstellen", " がバックアップの復元に失敗しました", " falhou ao restaurar um backup"],
    [/ a réinitialisé le monde(?=$| — )/, " reset the world", " 重置了世界", " reinició el mundo", " 님이 월드를 초기화했습니다", " hat die Welt zurückgesetzt", " がワールドをリセットしました", " reiniciou o mundo"],
    [/ a échoué à réinitialiser le monde(?=$| — )/, " failed to reset the world", " 重置世界失败", " falló al reiniciar el mundo", " 님이 월드 초기화에 실패했습니다", " konnte die Welt nicht zurücksetzen", " がワールドのリセットに失敗しました", " falhou ao reiniciar o mundo"],
    [/ boucle de crash détectée \(intervention manuelle conseillée\)(?=$| — )/, " crash loop detected (manual intervention advised)", " 检测到崩溃循环（建议手动介入）", " bucle de caídas detectado (se aconseja intervención manual)", " 크래시 루프 감지됨 (수동 개입 권장)", " Absturzschleife erkannt (manuelles Eingreifen empfohlen)", " クラッシュループを検出（手動対応を推奨）", " loop de falhas detectado (intervenção manual recomendada)"],
    [/ a importé une sauvegarde(?=$| — )/, " imported a backup", " 导入了一个备份", " importó una copia", " 님이 백업을 가져왔습니다", " hat ein Backup importiert", " がバックアップをインポートしました", " importou um backup"],
    [/ a activé la console serveur(?=$| — )/, " enabled the server console", " 启用了服务器控制台", " activó la consola del servidor", " 님이 서버 콘솔을 활성화했습니다", " hat die Serverkonsole aktiviert", " がサーバーコンソールを有効にしました", " ativou o console do servidor"],
    [/ a installé un plugin(?=$| — )/, " installed a plugin", " 安装了一个插件", " instaló un plugin", " 님이 플러그인을 설치했습니다", " hat ein Plugin installiert", " がプラグインをインストールしました", " instalou um plugin"],
    [/ a désinstallé un plugin(?=$| — )/, " uninstalled a plugin", " 卸载了一个插件", " desinstaló un plugin", " 님이 플러그인을 제거했습니다", " hat ein Plugin deinstalliert", " がプラグインをアンインストールしました", " desinstalou um plugin"],
    [/ a enregistré le jeton API PalDefender(?=$| — )/, " saved the PalDefender API token", " 保存了 PalDefender API 令牌", " guardó el token de la API de PalDefender", " 님이 PalDefender API 토큰을 저장했습니다", " hat das PalDefender-API-Token gespeichert", " がPalDefender APIトークンを保存しました", " salvou o token da API do PalDefender"],
    [/ a exécuté une commande PalDefender(?=$| — )/, " ran a PalDefender command", " 执行了一条 PalDefender 命令", " ejecutó un comando de PalDefender", " 님이 PalDefender 명령을 실행했습니다", " hat einen PalDefender-Befehl ausgeführt", " がPalDefenderコマンドを実行しました", " executou um comando do PalDefender"],
    [/ alerte espace disque faible(?=$| — )/, " low disk space alert", " 磁盘空间不足警报", " alerta de poco espacio en disco", " 디스크 공간 부족 경고", " Warnung: wenig Speicherplatz", " ディスク空き容量不足の警告", " alerta de pouco espaço em disco"],
    [/ redémarrage automatique \(watchdog\)(?=$| — )/, " automatic restart (watchdog)", " 自动重启（看门狗）", " reinicio automático (watchdog)", " 자동 재시작 (watchdog)", " automatischer Neustart (Watchdog)", " 自動再起動（監視）", " reinício automático (watchdog)"],
    [/ annonce de redémarrage planifié(?=$| — )/, " scheduled restart announcement", " 计划重启公告", " anuncio de reinicio programado", " 예약 재시작 공지", " Ankündigung des geplanten Neustarts", " 予約再起動のアナウンス", " anúncio de reinício agendado"],
    [/ redémarrage planifié ignoré \(un autre était en cours\)(?=$| — )/, " scheduled restart skipped (another was in progress)", " 已跳过计划重启（另一次正在进行）", " reinicio programado omitido (otro estaba en curso)", " 예약 재시작 건너뜀 (다른 재시작이 진행 중이었음)", " geplanter Neustart übersprungen (ein anderer lief bereits)", " 予約再起動をスキップ（別の再起動が進行中）", " reinício agendado ignorado (outro estava em andamento)"],
    [/ a créé un compte(?=$| — )/, " created an account", " 创建了一个账户", " creó una cuenta", " 님이 계정을 만들었습니다", " hat ein Konto erstellt", " がアカウントを作成しました", " criou uma conta"],
    [/ a modifié un compte(?=$| — )/, " updated an account", " 修改了一个账户", " modificó una cuenta", " 님이 계정을 수정했습니다", " hat ein Konto aktualisiert", " がアカウントを更新しました", " atualizou uma conta"],
    [/ a supprimé un compte(?=$| — )/, " deleted an account", " 删除了一个账户", " eliminó una cuenta", " 님이 계정을 삭제했습니다", " hat ein Konto gelöscht", " がアカウントを削除しました", " excluiu uma conta"],
    [/ a changé son mot de passe(?=$| — )/, " changed their password", " 修改了自己的密码", " cambió su contraseña", " 님이 비밀번호를 변경했습니다", " hat das eigene Passwort geändert", " がパスワードを変更しました", " alterou a própria senha"],
    [/ vérification de mise à jour SteamCMD(?=$| — )/, " SteamCMD update check", " SteamCMD 更新检查", " comprobación de actualización de SteamCMD", " SteamCMD 업데이트 확인", " SteamCMD-Update-Prüfung", " SteamCMD更新チェック", " verificação de atualização do SteamCMD"],
    [/mise à jour appliquée$/, "update applied", "更新已应用", "actualización aplicada", "업데이트 적용됨", "Update angewendet", "更新を適用しました", "atualização aplicada"],
    [/déjà à jour$/, "already up to date", "已是最新", "ya actualizado", "이미 최신 상태", "bereits aktuell", "すでに最新です", "já atualizado"],
    [/un redémarrage était déjà en cours$/, "a restart was already in progress", "已有一次重启正在进行", "ya había un reinicio en curso", "이미 재시작이 진행 중이었음", "ein Neustart lief bereits", "すでに再起動が進行中でした", "um reinício já estava em andamento"],
    [/API injoignable alors que le service Windows est actif$/, "API unreachable while the Windows service is still active", "Windows 服务仍在运行但 API 无法访问", "API inaccesible mientras el servicio de Windows sigue activo", "Windows 서비스는 활성 상태이지만 API에 연결할 수 없음", "API nicht erreichbar, obwohl der Windows-Dienst noch aktiv ist", "Windowsサービスは稼働中ですがAPIに接続できません", "API inacessível enquanto o serviço do Windows ainda está ativo"],
    [/(\d+) Mo restants$/, "$1 MB remaining", "剩余 $1 MB", "$1 MB restantes", "$1 MB 남음", "$1 MB übrig", "残り $1 MB", "$1 MB restantes"],
    [/(\d+) min \(récurrent\)$/, "$1 min (recurring)", "$1 分钟（周期性）", "$1 min (recurrente)", "$1분 (주기적)", "$1 Min. (wiederkehrend)", "$1分（定期）", "$1 min (recorrente)"],
    [/\bLun\b/g, "Mon", "周一", "Lun", "월", "Mo", "月", "Seg"],
    [/\bMar\b/g, "Tue", "周二", "Mar", "화", "Di", "火", "Ter"],
    [/\bMer\b/g, "Wed", "周三", "Mié", "수", "Mi", "水", "Qua"],
    [/\bJeu\b/g, "Thu", "周四", "Jue", "목", "Do", "木", "Qui"],
    [/\bVen\b/g, "Fri", "周五", "Vie", "금", "Fr", "金", "Sex"],
    [/\bSam\b/g, "Sat", "周六", "Sáb", "토", "Sa", "土", "Sáb"],
    [/\bDim\b/g, "Sun", "周日", "Dom", "일", "So", "日", "Dom"],
  ];

  function translate(str) {
    const trimmed = str.trim();
    if (!trimmed) return null;
    if (Object.prototype.hasOwnProperty.call(T, trimmed)) {
      // Repli sur l'anglais (index 0) si la traduction zh/es manque pour cette clé
      const entry = T[trimmed];
      const value = entry[IDX] || entry[0];
      return str.replace(trimmed, value);
    }
    let out = str;
    for (const row of PATTERNS) {
      const repl = row[1 + IDX] || row[1];
      out = out.replace(row[0], repl);
    }
    return out !== str ? out : null;
  }

  // t() exposé pour un usage explicite éventuel dans app.js
  window.t = s => (LANG !== 'fr' && translate(String(s))) || s;
  window.I18N_LANG = LANG;

  // ---------- Sélecteur de langue (injecté dans le header / la page de login) ----------
  const LANG_LABELS = { fr: 'Français', en: 'English', zh: '中文', es: 'Español', ko: '한국어', de: 'Deutsch', ja: '日本語', pt: 'Português' };
  function injectLangToggle() {
    // Le launcher Electron a déjà son propre sélecteur #langToggle dans son en-tête : ne pas en
    // injecter un second par-dessus (deux contrôles superposés en haut à droite).
    if (document.getElementById('langToggle')) return;
    const sel = document.createElement('select');
    sel.id = 'langToggle';
    sel.title = 'Language';
    sel.style.cssText = 'position:fixed;top:10px;right:10px;z-index:1000;background:rgba(20,24,31,.85);color:#e7ebf0;border:1px solid rgba(139,150,165,.35);border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px;';
    for (const code of SUPPORTED) {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = '🌐 ' + LANG_LABELS[code];
      if (code === LANG) opt.selected = true;
      sel.appendChild(opt);
    }
    sel.addEventListener('change', () => {
      localStorage.setItem('lang', sel.value);
      location.reload();
    });
    document.body.appendChild(sel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLangToggle);
  } else {
    injectLangToggle();
  }

  if (LANG === 'fr') return; // français : rien d'autre à faire, le contenu est déjà en français

  document.documentElement.lang = LANG;

  // ---------- Traduction du DOM (au chargement + contenu dynamique via MutationObserver) ----------
  const ATTRS = ['placeholder', 'title', 'alt'];

  function translateTextNode(node) {
    const tr = translate(node.nodeValue);
    if (tr !== null && tr !== node.nodeValue) node.nodeValue = tr;
  }

  function translateElementAttrs(el) {
    for (const attr of ATTRS) {
      const val = el.getAttribute && el.getAttribute(attr);
      if (val) {
        const tr = translate(val);
        if (tr !== null && tr !== val) el.setAttribute(attr, tr);
      }
    }
  }

  function walk(root) {
    if (root.nodeType === Node.TEXT_NODE) return translateTextNode(root);
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) {
      if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
      translateElementAttrs(root);
    }
    for (const child of root.childNodes) walk(child);
  }

  function start() {
    walk(document.documentElement);
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'characterData') translateTextNode(m.target);
        else m.addedNodes.forEach(n => walk(n));
      }
    });
    observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // ---------- confirm / alert / prompt traduits au vol ----------
  const _confirm = window.confirm.bind(window);
  const _alert = window.alert.bind(window);
  const _prompt = window.prompt.bind(window);
  window.confirm = msg => _confirm(window.t(msg));
  window.alert = msg => _alert(window.t(msg));
  window.prompt = (msg, def) => _prompt(window.t(msg), def);
})();
