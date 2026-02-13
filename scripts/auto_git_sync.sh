#!/bin/bash

# Configuration
BRANCH=$(git rev-parse --abbrev-ref HEAD)
REMOTE="origin"
INTERVAL=60 # Seconds between checks

echo "Starting auto-git sync on branch $BRANCH..."

while true; do
  # Check for changes
  if [[ -n $(git status -s) ]]; then
    echo "Changes detected. Committing..."
    git add .
    git commit -m "Auto commit: $(date '+%Y-%m-%d %H:%M:%S')" --no-gpg-sign
    
    # Attempt to push
    if git remote | grep -q "$REMOTE"; then
      echo "Pushing to $REMOTE/$BRANCH..."
      git push "$REMOTE" "$BRANCH"
    else
      echo "No remote '$REMOTE' found. Skipping push."
    fi
  else
    echo "No changes detected."
  fi
  
  sleep "$INTERVAL"
done
