#!/bin/bash

echo "🏗️ Destroying containers..."
docker-compose -f docker-compose.dev.yml down -v