#!/usr/bin/env bash
#
# Local dev restore — the counterpart to backup-local.sh. Puts the
# database and uploaded media back to a previous snapshot.
#
#   - DB:      pg_restore --clean --if-exists  into the local `devliora` db
#   - uploads: replace wwwroot/uploads/ with the contents of the archive
#
# This ONLY rewrites your local dev environment. Production is never touched.
#
# Usage:
#   ./scripts/restore-local.sh                       # use the latest backup
#   ./scripts/restore-local.sh backups/db/devliora_backup_20260829_1530.dump
#
# When a specific .dump is given, the uploads archive with the closest
# timestamp is used. Otherwise the newest of each is used.
#
# Optional env overrides (defaults shown):
#   CONTAINER=devliora-postgres
#   DB_NAME=devliora
#   DB_USER=agencyadmin

set -euo pipefail

CONTAINER="${CONTAINER:-devliora-postgres}"
DB_NAME="${DB_NAME:-devliora}"
DB_USER="${DB_USER:-agencyadmin}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

DB_BACKUP_DIR="$REPO_ROOT/backups/db"
UPLOADS_BACKUP_DIR="$REPO_ROOT/backups/uploads"
UPLOADS_DEST="$REPO_ROOT/backend/src/Devliora.WebApi/wwwroot/uploads"

latest_of() { # dir, glob  ->  newest matching file by mtime (empty if none)
  find "$1" -maxdepth 1 -type f -name "$2" -printf '%T@ %p\n' 2>/dev/null \
    | sort -rn | head -1 | cut -d' ' -f2-
}

# --- pick the DB dump ----------------------------------------------------
if [ "${1:-}" != "" ]; then
  DB_FILE="$1"
  [ -f "$DB_FILE" ] || { echo "!! No such file: $DB_FILE" >&2; exit 1; }
else
  DB_FILE="$(latest_of "$DB_BACKUP_DIR" '*.dump')"
  [ -n "$DB_FILE" ] || { echo "!! No .dump files in $DB_BACKUP_DIR — run ./scripts/backup-local.sh first." >&2; exit 1; }
fi

# --- pick the matching uploads archive ---------------------------------
UPLOADS_FILE="$(latest_of "$UPLOADS_BACKUP_DIR" '*.tar.gz')"
if [ "${1:-}" != "" ]; then
  # Match on the <ts> embedded in the given dump's filename, if present.
  stamp="$(basename "$DB_FILE" | grep -oE '[0-9]{8}_[0-9]{4}' || true)"
  if [ -n "$stamp" ] && [ -f "$UPLOADS_BACKUP_DIR/uploads_backup_${stamp}.tar.gz" ]; then
    UPLOADS_FILE="$UPLOADS_BACKUP_DIR/uploads_backup_${stamp}.tar.gz"
  fi
fi

# --- confirm ----------------------------------------------------------
echo "About to restore into your LOCAL dev environment:"
echo "  DB dump     : ${DB_FILE#"$REPO_ROOT"/}"
echo "                -> pg_restore --clean --if-exists  into '$DB_NAME' (container '$CONTAINER')"
if [ -n "$UPLOADS_FILE" ]; then
  echo "  uploads     : ${UPLOADS_FILE#"$REPO_ROOT"/}"
  echo "                -> replaces everything in wwwroot/uploads/"
else
  echo "  uploads     : (none found — uploads folder left untouched)"
fi
echo
echo "This DROPS and recreates local tables. Production is NOT affected."
read -r -p "Proceed? type 'yes' to continue: " reply
if [ "$reply" != "yes" ]; then
  echo "Aborted. Nothing changed."
  exit 0
fi

# --- 1. Database -----------------------------------------------------
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "!! Postgres container '$CONTAINER' is not running." >&2
  echo "   Start it with: docker compose -f infra/docker/docker-compose.yml up -d" >&2
  exit 1
fi

echo "==> 1/2  Restoring database (stop the backend first if a DROP hangs on open connections)"
docker exec -i "$CONTAINER" pg_restore --clean --if-exists --no-owner --no-privileges \
  -U "$DB_USER" -d "$DB_NAME" < "$DB_FILE"
echo "         database restored"

# --- 2. Uploads ----------------------------------------------------
if [ -n "$UPLOADS_FILE" ]; then
  echo "==> 2/2  Restoring uploaded media"
  mkdir -p "$UPLOADS_DEST"
  # Clear current contents (keep the dir + .gitkeep), then extract.
  find "$UPLOADS_DEST" -mindepth 1 ! -name '.gitkeep' -delete
  tar -xzf "$UPLOADS_FILE" -C "$(dirname "$UPLOADS_DEST")"
  touch "$UPLOADS_DEST/.gitkeep"
  echo "         $(find "$UPLOADS_DEST" -type f ! -name '.gitkeep' | wc -l) file(s) into wwwroot/uploads/"
else
  echo "==> 2/2  No uploads archive — skipped"
fi

echo
echo "Done. Restart the backend so EF re-checks migrations:"
echo "  cd backend/src/Devliora.WebApi && dotnet run"
