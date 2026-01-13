#!/bin/bash

echo "🧹 Cleaning cache..."
rm -rf frontend/.next

echo "🏗️ Building and starting containers..."
docker-compose -f docker-compose.dev.yml up --build -d
yarn db:gen
yarn db:push
yarn start:dev