#!/usr/bin/env bash
#
# Copy the PRODUCTION database into the LOCAL dev database so localhost:3000
# shows the same admin-panel-managed content as devliora.com.
#
# SAFETY
#   - The production side is READ-ONLY: `pg_dump` never writes to the source.
#   - Only the LOCAL `devliora` database is modified (dropped objects are
#     re-created from the dump). Production is never touched.
#   - Nothing here runs automatically. You invoke it, and it prints every
#     step before doing it.
#
# PREREQUISITES
#   - SSH access to the VPS (same host used by .github/workflows/deploy.yml).
#   - The local dev stack up:  docker compose -f infra/docker/docker-compose.yml up -d
#
# USAGE
#   VPS_SSH="user@your-vps-host" ./infra/scripts/sync-prod-db-to-local.sh
#
# Optional overrides (defaults shown):
#   PROD_CONTAINER=devliora-postgres      # postgres container name on the VPS
#   LOCAL_CONTAINER=devliora-postgres     # postgres container name locally
#   DB_NAME=devliora
#   DB_USER=agencyadmin
#   DUMP_DIR=./db-dumps                   # gitignored

set -euo pipefail

: "${VPS_SSH:?Set VPS_SSH=user@host (the VPS that runs docker-compose.prod.yml)}"
PROD_CONTAINER="${PROD_CONTAINER:-devliora-postgres}"
LOCAL_CONTAINER="${LOCAL_CONTAINER:-devliora-postgres}"
DB_NAME="${DB_NAME:-devliora}"
DB_USER="${DB_USER:-agencyadmin}"
DUMP_DIR="${DUMP_DIR:-./db-dumps}"

TS="$(date +%Y%m%d_%H%M%S)"
DUMP_FILE="${DUMP_DIR}/prod_${DB_NAME}_${TS}.sql"

mkdir -p "$DUMP_DIR"

echo "==> 1/3  Dumping PRODUCTION db (read-only) via ${VPS_SSH}"
echo "         ssh ${VPS_SSH} docker exec ${PROD_CONTAINER} pg_dump -U ${DB_USER} -d ${DB_NAME} --clean --if-exists --no-owner --no-privileges"
ssh "$VPS_SSH" "docker exec ${PROD_CONTAINER} pg_dump -U ${DB_USER} -d ${DB_NAME} --clean --if-exists --no-owner --no-privileges" > "$DUMP_FILE"
echo "         wrote $(wc -c < "$DUMP_FILE") bytes to ${DUMP_FILE}"

echo "==> 2/3  Sanity-check the dump"
grep -c '^COPY ' "$DUMP_FILE" | xargs echo "         COPY blocks:"
if ! grep -q 'PostgreSQL database dump' "$DUMP_FILE"; then
  echo "         !! dump does not look like pg_dump output — aborting, LOCAL db untouched"
  exit 1
fi

echo "==> 3/3  Restoring into LOCAL db (container: ${LOCAL_CONTAINER}, db: ${DB_NAME})"
echo "         This rewrites ONLY your local dev database. Ctrl-C now to abort."
sleep 4
docker exec -i "$LOCAL_CONTAINER" psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" < "$DUMP_FILE"

echo
echo "Done. Restart the backend so EF re-checks migrations, then reload localhost:3000:"
echo "  cd backend/src/Devliora.WebApi && dotnet run"
echo
echo "Verify:  curl -s http://localhost:5240/api/services | grep -o '\"slug\":\"[a-z-]*\"'"
