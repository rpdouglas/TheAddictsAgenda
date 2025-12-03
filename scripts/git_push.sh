#!/bin/bash

# Check if a comment argument is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./scripts/git_push.sh \"Your commit message\""
  exit 1
fi

# Store the commit message in a variable
COMMIT_MESSAGE="$1"
LAST_MSG_FILE=".last_commit_message"

# Check for duplicate message
if [ -f "$LAST_MSG_FILE" ]; then
  LAST_MESSAGE=$(cat "$LAST_MSG_FILE")
  
  if [ "$COMMIT_MESSAGE" == "$LAST_MESSAGE" ]; then
    echo "⚠️  Warning: The commit message is identical to the previous one: \"$COMMIT_MESSAGE\""
    echo "Select an option:"
    echo "  [y] Use this message anyway"
    echo "  [n] Enter a new message"
    echo "  [q] Quit/Cancel"
    read -p "Choice: " choice
    
    case "$choice" in 
      y|Y ) 
        echo "Proceeding with duplicate message..."
        ;;
      n|N )
        read -p "Enter new commit message: " NEW_MSG
        if [ -z "$NEW_MSG" ]; then
           echo "Error: Empty message provided. Aborting."
           exit 1
        fi
        COMMIT_MESSAGE="$NEW_MSG"
        ;;
      * )
        echo "Aborting."
        exit 1
        ;;
    esac
  fi
fi

# Save the current message for next time
echo "$COMMIT_MESSAGE" > "$LAST_MSG_FILE"

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