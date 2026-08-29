#!/usr/bin/env bash
#
# Local dev backup — snapshots the two things that live ONLY in your local
# environment and are lost if the Docker volume is wiped (`docker compose
# down -v`) or the uploads folder is cleared:
#
#   1. the `devliora-postgres` database  -> backups/db/devliora_backup_<ts>.dump
#   2. wwwroot/uploads/ (uploaded media) -> backups/uploads/uploads_backup_<ts>.tar.gz
#
# Backups older than $RETENTION_DAYS (default 7) are pruned so the folder
# doesn't grow without bound. Nothing here touches production.
#
# Usage:
#   ./scripts/backup-local.sh
#
# Optional env overrides (defaults shown):
#   CONTAINER=devliora-postgres
#   DB_NAME=devliora
#   DB_USER=agencyadmin
#   RETENTION_DAYS=7

set -euo pipefail

CONTAINER="${CONTAINER:-devliora-postgres}"
DB_NAME="${DB_NAME:-devliora}"
DB_USER="${DB_USER:-agencyadmin}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

DB_BACKUP_DIR="$REPO_ROOT/backups/db"
UPLOADS_BACKUP_DIR="$REPO_ROOT/backups/uploads"
UPLOADS_SRC="$REPO_ROOT/backend/src/Devliora.WebApi/wwwroot/uploads"

TS="$(date +%Y%m%d_%H%M)"
DB_FILE="$DB_BACKUP_DIR/devliora_backup_${TS}.dump"
UPLOADS_FILE="$UPLOADS_BACKUP_DIR/uploads_backup_${TS}.tar.gz"

mkdir -p "$DB_BACKUP_DIR" "$UPLOADS_BACKUP_DIR"

# --- 1. Database ------------------------------------------------------------
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "!! Postgres container '$CONTAINER' is not running." >&2
  echo "   Start it with: docker compose -f infra/docker/docker-compose.yml up -d" >&2
  exit 1
fi

echo "==> 1/3  Dumping database '$DB_NAME' from container '$CONTAINER'"
# -F c  = custom format (compressed, restorable with pg_restore --clean)
docker exec "$CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" \
  -F c --no-owner --no-privileges > "$DB_FILE"

# Validate: pg_restore -l must be able to read the archive's table of contents.
if ! docker exec -i "$CONTAINER" pg_restore -l < "$DB_FILE" > /dev/null 2>&1; then
  echo "!! Dump at $DB_FILE is not a valid pg_restore archive — removing it." >&2
  rm -f "$DB_FILE"
  exit 1
fi
echo "         wrote $(du -h "$DB_FILE" | cut -f1)  ->  ${DB_FILE#"$REPO_ROOT"/}"

# --- 2. Uploads -----------------------------------------------------------
echo "==> 2/3  Archiving uploaded media"
if [ -d "$UPLOADS_SRC" ]; then
  # -C the parent so the archive contains a top-level `uploads/` dir.
  tar -czf "$UPLOADS_FILE" -C "$(dirname "$UPLOADS_SRC")" "$(basename "$UPLOADS_SRC")"
  echo "         wrote $(du -h "$UPLOADS_FILE" | cut -f1)  ->  ${UPLOADS_FILE#"$REPO_ROOT"/}  ($(tar -tzf "$UPLOADS_FILE" | grep -c '[^/]$') files)"
else
  echo "         (no uploads folder at $UPLOADS_SRC — skipping)"
fi

# --- 3. Prune old backups -----------------------------------------------
echo "==> 3/3  Pruning backups older than ${RETENTION_DAYS} days"
pruned=0
while IFS= read -r -d '' old; do
  echo "         rm ${old#"$REPO_ROOT"/}"
  rm -f "$old"
  pruned=$((pruned + 1))
done < <(find "$DB_BACKUP_DIR" "$UPLOADS_BACKUP_DIR" -type f \
           \( -name '*.dump' -o -name '*.tar.gz' \) -mtime "+${RETENTION_DAYS}" -print0)
echo "         pruned ${pruned} file(s)"

echo
echo "Done. Restore with:  ./scripts/restore-local.sh"
