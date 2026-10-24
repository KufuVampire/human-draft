#!/usr/bin/env bash
set -e

# Trap for cleanup on exit (Ctrl+C)
cleanup() {
  echo ""
  echo "🛑 Остановка процессов..."
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

echo "🧹 Очистка кэша Next.js..."
rm -rf frontend/.next

echo "🐘 Запуск PostgreSQL и Redis в Docker..."
docker compose --env-file backend/.env -f docker-compose.dev.yml up -d

echo "⏳ Ожидание готовности PostgreSQL..."
RETRIES=30
until docker exec human-draft-postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  sleep 1
  RETRIES=$((RETRIES - 1))
done

if [ $RETRIES -eq 0 ]; then
  echo "❌ Ошибка: PostgreSQL не запустился вовремя."
  exit 1
fi
echo "✅ PostgreSQL готов к работе!"

echo "📦 Инициализация схемы БД Prisma (generate, push, seed)..."
(cd backend && yarn db:gen && yarn db:push && yarn db:seed)

echo "🚀 Запуск бэкенда в режиме разработки..."
(cd backend && yarn start:dev) &
BACKEND_PID=$!

echo "⏳ Ожидание готовности GraphQL бэкенда..."
RETRIES=30
until curl -s -X POST http://localhost:4000/graphql -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' >/dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  sleep 1
  RETRIES=$((RETRIES - 1))
done

if [ $RETRIES -eq 0 ]; then
  echo "⚠️ Бэкенд еще запускается, стартуем фронтенд..."
else
  echo "✅ Бэкенд доступен на http://localhost:4000/graphql!"
fi

echo "🌐 Запуск фронтенда..."
(cd frontend && bun run dev)
