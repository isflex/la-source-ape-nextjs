#!/bin/bash
# Auto-sync non-amplify changes from apel to flexi
# Called by husky post-commit hook

FLEXI_WORKTREE="../flexi"
APEL_WORKTREE="$(pwd)"

echo "🔄 Sync script (apel → flexi): Checking for changes to sync..."

# Define paths to sync (relative to worktree root)
SYNC_PATHS=(
    "apps/gateway/src/"
    "packages/"
)

# Define paths to exclude from sync
EXCLUDE_PATTERNS=(
    "env/"
    "pnpm-lock.yaml"
    "apps/gateway/public/sitemap.xml"
    "apps/gateway/amplify/"
    "*.log"
    "node_modules/"
    ".DS_Store"
    "apel-gateway.code-workspace"
    ".husky/pre-commit"
)

# Check if flexi worktree exists
if [[ ! -d "$FLEXI_WORKTREE" ]]; then
    echo "⚠️  Flexi worktree not found at $FLEXI_WORKTREE, skipping sync"
    exit 0
fi

cd "$APEL_WORKTREE"

# Get the list of files changed in the last commit
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD)

# Filter for files we care about syncing
SYNC_NEEDED=false
RELEVANT_FILES=""

for file in $CHANGED_FILES; do
    # Check if file is in a sync path
    for sync_path in "${SYNC_PATHS[@]}"; do
        if [[ "$file" == "$sync_path"* ]]; then
            # Check if file should be excluded
            SHOULD_EXCLUDE=false
            for exclude_pattern in "${EXCLUDE_PATTERNS[@]}"; do
                if [[ "$file" == *"$exclude_pattern"* ]]; then
                    SHOULD_EXCLUDE=true
                    break
                fi
            done

            if [[ "$SHOULD_EXCLUDE" = false ]]; then
                SYNC_NEEDED=true
                RELEVANT_FILES="$RELEVANT_FILES\n  - $file"
            fi
        fi
    done
done

if [[ "$SYNC_NEEDED" = false ]]; then
    echo "✅ No relevant changes to sync to flexi"
    exit 0
fi

echo "📋 Files that need syncing:$RELEVANT_FILES"

# Perform the sync
echo "🔄 Syncing changes to flexi worktree..."

# Build rsync exclude args
EXCLUDE_ARGS=""
for exclude_pattern in "${EXCLUDE_PATTERNS[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude=$exclude_pattern"
done

# Sync each path
for sync_path in "${SYNC_PATHS[@]}"; do
    if [[ -d "$sync_path" ]]; then
        echo "  Syncing $sync_path..."
        rsync -av $EXCLUDE_ARGS "$sync_path" "$FLEXI_WORKTREE/$sync_path"
    fi
done

# Check if flexi has changes and auto-commit
cd "$FLEXI_WORKTREE"

if [[ -n $(git status --porcelain) ]]; then
    LAST_COMMIT_MSG=$(git -C "$APEL_WORKTREE" log -1 --format='%h %s')
    echo "📝 Auto-committing synced changes to flexi..."

    git add .
    git status --short
    git commit -m "🔄 Auto-sync from apel: $LAST_COMMIT_MSG

Synced by post-commit hook
Files synced:$RELEVANT_FILES

[skip-ci]"

    echo "✅ Successfully synced and committed changes to flexi"
else
    echo "ℹ️  No changes to commit in flexi (files may be identical)"
fi

echo "🔄 Sync complete"
