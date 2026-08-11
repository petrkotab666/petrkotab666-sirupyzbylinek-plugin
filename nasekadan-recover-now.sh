#!/usr/bin/env bash
set -euo pipefail

ARTICLE='clanky/kam-v-kadani-a-okoli-10-16-srpna-2026.html'
LIVE="/var/www/nasekadan/$ARTICLE"
OPT="/opt/nasekadan/$ARTICLE"

printf '\n=== Naše Kadaň: nouzová obnova ===\n'
echo 'Disk před úklidem:'
df -h /

# Uvolnit pouze bezpečně regenerovatelné cache, logy a staré dočasné adresáře.
journalctl --vacuum-size=120M || true
apt-get clean || true
if command -v docker >/dev/null 2>&1; then
  docker builder prune -af || true
  docker image prune -af || true
fi
find /tmp -maxdepth 1 -type d -name 'nasekadan-*' -mmin +20 -exec rm -rf {} + 2>/dev/null || true
find /var/www -maxdepth 1 -type d \( -name 'nasekadan.repair-*' -o -name 'nasekadan.previous-*' \) -mmin +20 -exec rm -rf {} + 2>/dev/null || true

echo 'Disk po úklidu:'
df -h /

# Zastavit starou pětiminutovou úplnou obnovu. Právě tato cesta je příliš těžká
# pro běžné redakční změny; odteď je hlavní cesta rychlý GitHub API sync.
systemctl disable --now nasekadan-refresh.timer 2>/dev/null || true
systemctl disable --now nasekadan-content-regression.path 2>/dev/null || true
systemctl stop nasekadan-refresh.service nasekadan-content-regression.service 2>/dev/null || true

python3 - <<'PY'
from pathlib import Path
old='<div class="event"><time>DO SOBOTY 15. 8. · 9:00–18:00</time><p class="distance">Chomutov · asi 20–25 minut</p><h3>Zoopark Chomutov: poslední dny výstavy kudlanek</h3><p>Pro rodiny je to dobrý výlet hlavně na začátek víkendu. Výstava představuje přes padesát druhů kudlanek a končí právě 15. srpna. Zoopark má v letní sezoně otevřeno denně.</p></div>'
new='<div class="event"><time>CELÝ TÝDEN · VÝSTAVA PRODLOUŽENA DO KONCE SRPNA</time><p class="distance">Chomutov · asi 20–25 minut</p><h3>Zoopark Chomutov: výstava kudlanek pokračuje do konce srpna</h3><p><strong>Aktualizace:</strong> Výstava více než padesáti druhů kudlanek měla původně skončit 15. srpna. Kvůli velkému zájmu návštěvníků ji ale Zoopark Chomutov prodloužil až do konce srpna. Zoopark má v letní sezoně otevřeno denně.</p></div>'
for name, required in [('/var/www/nasekadan/clanky/kam-v-kadani-a-okoli-10-16-srpna-2026.html', True),('/opt/nasekadan/clanky/kam-v-kadani-a-okoli-10-16-srpna-2026.html', False)]:
    p=Path(name)
    if not p.exists():
        if required: raise SystemExit(f'CHYBÍ {p}')
        continue
    text=p.read_text(encoding='utf-8')
    if new in text:
        print('Už aktuální:',p)
    elif old in text:
        p.write_text(text.replace(old,new,1),encoding='utf-8',newline='\n')
        print('Opraveno:',p)
    else:
        raise SystemExit(f'Nenalezen očekávaný blok: {p}')
PY

chmod 0644 "$LIVE"
if command -v docker >/dev/null 2>&1 && docker inspect nasekadan-web >/dev/null 2>&1; then
  docker exec nasekadan-web mkdir -p /usr/share/nginx/html/clanky
  docker cp "$LIVE" "nasekadan-web:/usr/share/nginx/html/$ARTICLE"
fi
systemctl reload caddy 2>/dev/null || true
if command -v nginx >/dev/null 2>&1; then nginx -t && systemctl reload nginx; fi

# Trvalá ochrana před znovuzaplněním disku.
cat >/usr/local/sbin/nasekadan-disk-guard <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
free_kb=$(df -Pk / | awk 'NR==2{print $4}')
if [ "$free_kb" -lt 1048576 ]; then
  journalctl --vacuum-size=150M || true
  apt-get clean || true
  if command -v docker >/dev/null 2>&1; then
    docker builder prune -af || true
    docker image prune -af || true
  fi
  find /tmp -maxdepth 1 -type d -name 'nasekadan-*' -mmin +60 -exec rm -rf {} + 2>/dev/null || true
  find /var/www -maxdepth 1 -type d \( -name 'nasekadan.repair-*' -o -name 'nasekadan.previous-*' \) -mmin +60 -exec rm -rf {} + 2>/dev/null || true
fi
EOF
chmod 0755 /usr/local/sbin/nasekadan-disk-guard
cat >/etc/systemd/system/nasekadan-disk-guard.service <<'EOF'
[Unit]
Description=Ochrana Naše Kadaň před zaplněním disku
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/nasekadan-disk-guard
EOF
cat >/etc/systemd/system/nasekadan-disk-guard.timer <<'EOF'
[Unit]
Description=Pravidelná kontrola disku Naše Kadaň
[Timer]
OnBootSec=2min
OnUnitActiveSec=30min
Persistent=true
[Install]
WantedBy=timers.target
EOF

# Lehká zdravotní kontrola – nic nestaví, nic neklonuje a nic nezapisuje do webu.
cat >/usr/local/sbin/nasekadan-health-check <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
curl -kfsSL --max-time 20 --resolve nasekadan.cz:443:127.0.0.1 https://nasekadan.cz/ >/dev/null
curl -kfsSL --max-time 20 --resolve nasekadan.cz:443:127.0.0.1 https://nasekadan.cz/clanky/ >/dev/null
/usr/local/sbin/nasekadan-disk-guard
EOF
chmod 0755 /usr/local/sbin/nasekadan-health-check
cat >/etc/systemd/system/nasekadan-health-check.service <<'EOF'
[Unit]
Description=Lehká zdravotní kontrola Naše Kadaň
After=network-online.target
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/nasekadan-health-check
EOF
cat >/etc/systemd/system/nasekadan-health-check.timer <<'EOF'
[Unit]
Description=Pravidelná lehká kontrola Naše Kadaň
[Timer]
OnBootSec=3min
OnUnitActiveSec=15min
Persistent=true
[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now nasekadan-disk-guard.timer
systemctl enable --now nasekadan-health-check.timer

# Obnovit všechny GitHub runner služby, které jsou na tomto VPS nainstalované.
mapfile -t runner_services < <(systemctl list-unit-files --type=service --no-legend | awk '$1 ~ /^actions\.runner\./ {print $1}')
for svc in "${runner_services[@]}"; do
  echo "Restart runneru: $svc"
  systemctl restart "$svc" || true
done

# Lokální kontrola přímo proti produkčnímu Caddy/nginx.
stamp="recovery-$(date +%s)"
curl -kfsSL --max-time 25 --resolve nasekadan.cz:443:127.0.0.1 "https://nasekadan.cz/$ARTICLE?$stamp" -o /tmp/nasekadan-recovery-check.html
grep -Fq 'Zoopark Chomutov: výstava kudlanek pokračuje do konce srpna' /tmp/nasekadan-recovery-check.html
! grep -Fq 'Zoopark Chomutov: poslední dny výstavy kudlanek' /tmp/nasekadan-recovery-check.html

echo
echo 'LIVE_OK: kulturní přehled je opravený.'
echo 'Runner služby:'
for svc in "${runner_services[@]}"; do printf '%s: ' "$svc"; systemctl is-active "$svc" || true; done
echo 'Nové časovače:'
systemctl is-active nasekadan-disk-guard.timer || true
systemctl is-active nasekadan-health-check.timer || true
echo 'Disk nyní:'
df -h /
