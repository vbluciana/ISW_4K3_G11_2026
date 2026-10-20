#!/bin/sh
set -eu

mkdir -p /shared/cloudflared
rm -f /shared/cloudflared/frontend-url.txt /shared/cloudflared/cloudflared.log

cleanup() {
  rm -f /shared/cloudflared/frontend-url.txt
  if [ -n "${TUNNEL_PID:-}" ]; then
    kill "$TUNNEL_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

while true; do
  echo "[cloudflared] Iniciando túnel de Cloudflare hacia http://frontend:5173..."
  cloudflared tunnel --no-autoupdate --url http://frontend:5173 --loglevel info > /shared/cloudflared/cloudflared.log 2>&1 &
  TUNNEL_PID=$!

  URL_ACTUAL=""
  while kill -0 "$TUNNEL_PID" 2>/dev/null; do
    if [ -z "$URL_ACTUAL" ] && grep -Eo 'https://[[:alnum:]-]+\.trycloudflare\.com' /shared/cloudflared/cloudflared.log >/tmp/cloudflare-url.txt 2>/dev/null; then
      NUEVA_URL=$(tail -n 1 /tmp/cloudflare-url.txt)
      if [ -n "$NUEVA_URL" ]; then
        echo "$NUEVA_URL" > /shared/cloudflared/frontend-url.tmp
        mv /shared/cloudflared/frontend-url.tmp /shared/cloudflared/frontend-url.txt
        URL_ACTUAL="$NUEVA_URL"
        echo "============================================================"
        echo " [cloudflared] Túnel público activo:"
        echo " $NUEVA_URL"
        echo "============================================================"
      fi
    fi
    sleep 1
  done

  wait "$TUNNEL_PID" || true
  rm -f /shared/cloudflared/frontend-url.txt
  URL_ACTUAL=""
  echo "[cloudflared] Túnel detenido; reintentando en 5 segundos..."
  sleep 5
done
