#!/usr/bin/env bash
# Vercel build: sync schema, seed (idempotent), build.
# Falls back to the prefixed env vars created by the Neon integration
# (humanade_DATABASE_URL*) when DATABASE_URL isn't set, and prefers the
# unpooled connection for schema changes (Neon recommends direct
# connections for DDL/migrations).
set -euo pipefail

RUNTIME_URL="${DATABASE_URL:-${humanade_DATABASE_URL:-${POSTGRES_PRISMA_URL:-${humanade_POSTGRES_PRISMA_URL:-}}}}"
DIRECT_URL="${DATABASE_URL_UNPOOLED:-${humanade_DATABASE_URL_UNPOOLED:-$RUNTIME_URL}}"

if [ -z "$RUNTIME_URL" ]; then
  echo "ERROR: no database URL found (DATABASE_URL or humanade_DATABASE_URL)." >&2
  exit 1
fi

echo "==> prisma db push (direct connection)"
# --accept-data-loss: db push refuses even benign changes (e.g. adding a
# unique constraint) without it. Schema changes are reviewed before merge;
# check the build log's warning output when changing the schema.
DATABASE_URL="$DIRECT_URL" npx prisma db push --accept-data-loss

echo "==> seeding (skips if database already has listings)"
DATABASE_URL="$DIRECT_URL" npx tsx prisma/seed.ts

echo "==> data fixes (idempotent)"
DATABASE_URL="$DIRECT_URL" npx tsx scripts/fix-la-guaira.ts

echo "==> next build"
DATABASE_URL="$RUNTIME_URL" npx next build
