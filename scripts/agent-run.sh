#!/bin/bash
# agent-run.sh - Enhanced runner for coding agents with context-efficient output
#
# Usage: ./scripts/agent-run.sh <command> [--json]
#
# Commands:
#   test:unit  - Run unit tests (bun test)
#   test:e2e   - Run E2E tests with agent reporter
#   check      - Run type checking
#   lint       - Run linter/formatter
#   build      - Build the project
#   all        - Run check, lint, test:unit, build in sequence
#
# Options:
#   --json     - Output results in JSON format
#
# On success: prints "✓ description" (or JSON with status: "passed")
# On failure: prints "✗ description" + relevant error output (or JSON with errors)

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
CMD="${1:-help}"
JSON_MODE=false
if [[ "$2" == "--json" ]] || [[ "$1" == "--json" ]]; then
    JSON_MODE=true
    if [[ "$1" == "--json" ]]; then
        CMD="${2:-help}"
    fi
fi

# Colors (disabled in JSON mode)
if [[ "$JSON_MODE" == false ]]; then
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    NC='\033[0m' # No Color
else
    GREEN=''
    RED=''
    NC=''
fi

# Output helper
output_success() {
    local desc="$1"
    local duration="$2"
    if [[ "$JSON_MODE" == true ]]; then
        echo "{\"status\":\"passed\",\"description\":\"$desc\",\"duration\":\"${duration}s\"}"
    else
        echo -e "${GREEN}✓${NC} $desc (${duration}s)"
    fi
}

output_failure() {
    local desc="$1"
    local exit_code="$2"
    local output="$3"
    local duration="$4"
    if [[ "$JSON_MODE" == true ]]; then
        # Escape output for JSON
        local escaped_output
        escaped_output=$(echo "$output" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g' | tr '\n' ' ' | sed 's/  */ /g')
        echo "{\"status\":\"failed\",\"description\":\"$desc\",\"exitCode\":$exit_code,\"duration\":\"${duration}s\",\"output\":\"$escaped_output\"}"
    else
        echo -e "${RED}✗${NC} $desc (exit code: $exit_code, ${duration}s)"
        echo ""
        echo "$output"
    fi
}

# Run a command silently and report result
run_silent() {
    local desc="$1"
    local cmd="$2"

    local tmpfile
    tmpfile=$(mktemp)
    trap "rm -f $tmpfile" RETURN

    local start_time
    start_time=$(date +%s)

    if eval "$cmd" > "$tmpfile" 2>&1; then
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - start_time))
        output_success "$desc" "$duration"
        return 0
    else
        local exit_code=$?
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - start_time))
        local output
        output=$(cat "$tmpfile")
        output_failure "$desc" "$exit_code" "$output" "$duration"
        return $exit_code
    fi
}

# Run E2E tests with agent reporter
run_e2e() {
    local desc="E2E tests"
    local tmpfile
    tmpfile=$(mktemp)
    trap "rm -f $tmpfile" RETURN

    local start_time
    start_time=$(date +%s)

    # Use the existing test:integration script with AGENT_MODE for minimal reporter output
    # The webServer in playwright.config.ts handles building and serving
    if AGENT_MODE=1 bun run test:integration > "$tmpfile" 2>&1; then
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - start_time))

        # Extract pass count from agent reporter output if present
        local pass_info
        pass_info=$(grep -E "^✓.*tests passed" "$tmpfile" | tail -1)
        if [[ -n "$pass_info" ]]; then
            output_success "E2E tests - $pass_info" "$duration"
        else
            output_success "$desc" "$duration"
        fi
        return 0
    else
        local exit_code=$?
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - start_time))
        local output
        output=$(cat "$tmpfile")
        output_failure "$desc" "$exit_code" "$output" "$duration"
        return $exit_code
    fi
}

# Show help
show_help() {
    echo "Usage: ./scripts/agent-run.sh <command> [--json]"
    echo ""
    echo "Commands:"
    echo "  test:unit  - Run unit tests (bun test)"
    echo "  test:e2e   - Run E2E tests with agent reporter"
    echo "  check      - Run type checking"
    echo "  lint       - Run linter/formatter check"
    echo "  build      - Build the project"
    echo "  all        - Run check, lint, test:unit, build in sequence"
    echo ""
    echo "Options:"
    echo "  --json     - Output results in JSON format"
    echo ""
    echo "Examples:"
    echo "  ./scripts/agent-run.sh test:unit"
    echo "  ./scripts/agent-run.sh all --json"
}

# Run command based on input
case "$CMD" in
    test:unit|test)
        run_silent "unit tests" "bun test src/ tests/unit/"
        ;;
    test:e2e|e2e)
        run_e2e
        ;;
    check)
        run_silent "type check" "bun run check"
        ;;
    lint)
        run_silent "lint" "bun run --bun prettier --check ."
        ;;
    build)
        run_silent "build" "bun run build"
        ;;
    all)
        # Run all checks in sequence, stop on first failure
        all_start=$(date +%s)
        failed=false
        results=()

        run_silent "type check" "bun run check"
        if [[ $? -ne 0 ]]; then failed=true; fi

        run_silent "lint" "bun run --bun prettier --check ."
        if [[ $? -ne 0 ]]; then failed=true; fi

        run_silent "unit tests" "bun test src/ tests/unit/"
        if [[ $? -ne 0 ]]; then failed=true; fi

        run_silent "build" "bun run build"
        if [[ $? -ne 0 ]]; then failed=true; fi

        all_end=$(date +%s)
        all_duration=$((all_end - all_start))

        echo ""
        if [[ "$failed" == true ]]; then
            if [[ "$JSON_MODE" == true ]]; then
                echo "{\"status\":\"failed\",\"description\":\"all checks\",\"duration\":\"${all_duration}s\"}"
            else
                echo -e "${RED}✗${NC} some checks failed (total: ${all_duration}s)"
            fi
            exit 1
        else
            if [[ "$JSON_MODE" == true ]]; then
                echo "{\"status\":\"passed\",\"description\":\"all checks\",\"duration\":\"${all_duration}s\"}"
            else
                echo -e "${GREEN}✓${NC} all checks passed (total: ${all_duration}s)"
            fi
            exit 0
        fi
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $CMD"
        echo ""
        show_help
        exit 1
        ;;
esac
