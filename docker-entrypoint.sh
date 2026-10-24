#!/usr/bin/env bash
set -e

run_backend() {
  echo "🚀 Starting backend..."
  cd /app/backend && exec node dist/src/main.js
}

run_frontend() {
  echo "🌐 Starting frontend..."
  cd /app/frontend && exec bun run start
}

run_all() {
  echo "🚀 Starting backend..."
  (cd /app/backend && exec node dist/src/main.js) &
  BACKEND_PID=$!

  echo "🌐 Starting frontend..."
  (cd /app/frontend && exec bun run start) &
  FRONTEND_PID=$!

  cleanup() {
    echo "🛑 Stopping services..."
    kill -TERM "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  }

  trap cleanup SIGINT SIGTERM EXIT
  wait -n "$BACKEND_PID" "$FRONTEND_PID"
}

case "$1" in
  backend)
    run_backend
    ;;
  frontend)
    run_frontend
    ;;
  *)
    run_all
    ;;
esac
