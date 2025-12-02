#!/bin/bash

# Check if a comment argument is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./scripts/git_push.sh \"Your commit message\""
  exit 1
fi

# Store the commit message in a variable
COMMIT_MESSAGE="$1"

# Run the build process
echo "🔨 Running build..."
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting git push."
  exit 1
fi

# Execute the git commands
echo "➕ Adding changes..."
git add .

echo "💾 Committing with message: \"$COMMIT_MESSAGE\""
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Pushing to origin develop..."
git push origin develop

echo "✅ Done!"