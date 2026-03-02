#!/usr/bin/env bash
# setup-symlinks.sh
# Creates symlinks from the skills repo into the global Claude skills directory.
# Handles Windows/Unix differences and permission issues.
#
# Usage: setup-symlinks.sh <source-repo-dir> <skills-dir>

set -euo pipefail

SOURCE_DIR="$1"
SKILLS_DIR="$2"

SKILLS=(
  ideation-expertise
  product-manager
  issue-creator
  issue-review
  context7-docs
  diagram-skill
  docs-agent
  wp-to-sanity-astro
  write-changelog
  fractional-pm-setup
)

# Ensure skills directory exists
mkdir -p "$SKILLS_DIR"

create_link() {
  local src="$1"
  local dest="$2"

  # Try native ln -s first
  if ln -s "$src" "$dest" 2>/dev/null; then
    echo "LINKED"
    return 0
  fi

  # Try Windows mklink (Git Bash on Windows)
  if command -v cmd &>/dev/null; then
    local win_src win_dest
    win_src=$(cygpath -w "$src" 2>/dev/null || echo "$src")
    win_dest=$(cygpath -w "$dest" 2>/dev/null || echo "$dest")
    if cmd //c "mklink /D \"$win_dest\" \"$win_src\"" &>/dev/null; then
      echo "LINKED"
      return 0
    fi
  fi

  # Fallback: copy
  cp -r "$src" "$dest"
  echo "COPIED"
  return 0
}

echo ""
echo "Installing skills from: $SOURCE_DIR"
echo "Into: $SKILLS_DIR"
echo ""

ok_count=0
linked_count=0
copied_count=0
skipped_count=0
failed_count=0

for skill in "${SKILLS[@]}"; do
  src="$SOURCE_DIR/$skill"
  dest="$SKILLS_DIR/$skill"

  if [ ! -d "$src" ]; then
    printf "  %-25s SKIP (not found in repo)\n" "$skill"
    ((skipped_count++))
    continue
  fi

  # Already a symlink
  if [ -L "$dest" ]; then
    current_target=$(readlink "$dest" 2>/dev/null || true)
    # Normalise paths for comparison
    norm_src=$(cd "$src" && pwd -P 2>/dev/null || echo "$src")
    norm_target=$(cd "$current_target" 2>/dev/null && pwd -P 2>/dev/null || echo "$current_target")

    if [ "$norm_src" = "$norm_target" ]; then
      printf "  %-25s OK (already linked)\n" "$skill"
      ((ok_count++))
      continue
    else
      # Wrong target — re-link
      rm "$dest"
    fi
  elif [ -d "$dest" ]; then
    # Regular directory exists — skip to avoid data loss
    printf "  %-25s SKIP (directory exists, not a symlink)\n" "$skill"
    ((skipped_count++))
    continue
  fi

  result=$(create_link "$src" "$dest")

  if [ "$result" = "LINKED" ]; then
    printf "  %-25s LINKED\n" "$skill"
    ((linked_count++))
  elif [ "$result" = "COPIED" ]; then
    printf "  %-25s COPIED (symlink failed — updates require re-run)\n" "$skill"
    ((copied_count++))
  else
    printf "  %-25s FAILED\n" "$skill"
    ((failed_count++))
  fi
done

echo ""
echo "Done: $ok_count already OK, $linked_count linked, $copied_count copied, $skipped_count skipped, $failed_count failed"
