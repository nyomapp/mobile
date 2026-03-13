#!/bin/bash
# Normalize assets/icons filenames to lowercase in git (fixes EAS Build casing error on Linux).
# On macOS (case-insensitive FS) we must use a two-step git mv to change only casing.
set -e
cd "$(dirname "$0")/.."

rename_one() {
  local path="$1"
  local base=$(basename "$path")
  local low=$(echo "$base" | tr 'A-Z' 'a-z')
  [ "$base" = "$low" ] && return 0
  local dir=$(dirname "$path")
  local temp="${dir}/_casemv_${low}"
  git mv "$path" "$temp" 2>/dev/null || true
  git mv "$temp" "${dir}/${low}" 2>/dev/null || true
}

git ls-files assets/icons | while read f; do
  b=$(basename "$f")
  l=$(echo "$b" | tr 'A-Z' 'a-z')
  if [ "$b" != "$l" ]; then
    rename_one "$f"
  fi
done

echo "Done. Run: git status assets/icons"
