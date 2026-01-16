#!/bin/bash
# run-silent.sh - Portable bash wrapper for context-efficient agent output
#
# Usage: ./scripts/run-silent.sh "description" "command"
#
# On success: prints "✓ description"
# On failure: prints "✗ description" + full output
#
# Designed to minimize context window usage for coding agents.

set -o pipefail

DESCRIPTION="${1:-command}"
COMMAND="${2:-echo 'No command provided'}"

# Create temp file for output capture
TMPFILE=$(mktemp)
trap "rm -f $TMPFILE" EXIT

# Run command and capture output
if eval "$COMMAND" > "$TMPFILE" 2>&1; then
    echo "✓ $DESCRIPTION"
    exit 0
else
    EXIT_CODE=$?
    echo "✗ $DESCRIPTION (exit code: $EXIT_CODE)"
    echo ""
    echo "--- Output ---"
    cat "$TMPFILE"
    echo "--- End Output ---"
    exit $EXIT_CODE
fi
