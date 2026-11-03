#!/bin/sh
set -eu
mkdir -p dist/server dist/.openai/drizzle
node scripts/generate-catalog.mjs
node scripts/build-room-function.mjs
node scripts/build.mjs
cp .openai/hosting.json dist/.openai/hosting.json
cp -R drizzle/. dist/.openai/drizzle/
