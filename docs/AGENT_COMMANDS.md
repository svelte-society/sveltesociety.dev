# Context-Efficient Commands for Agents

These commands minimize context window usage by showing full output **only on failure**.

## Commands

| Command               | Description   | Output on Success         |
| --------------------- | ------------- | ------------------------- |
| `bun run agent:test`  | Unit tests    | `✓ unit tests passed`     |
| `bun run agent:e2e`   | E2E tests     | `✓ e2e tests passed`      |
| `bun run agent:check` | Type check    | `✓ type check passed`     |
| `bun run agent:lint`  | Lint check    | `✓ lint passed`           |
| `bun run agent:build` | Build project | `✓ build passed`          |
| `bun run agent:all`   | Full pipeline | `✓ all checks passed`     |
| `bun run agent:json`  | JSON output   | `{"status":"passed",...}` |

## How It Works

- **Success**: Shows `✓ description` (single line)
- **Failure**: Shows `✗ description` + full error output for debugging

## Direct Script Usage

```bash
./scripts/agent-run.sh test:unit      # Run unit tests
./scripts/agent-run.sh all --json     # JSON output for all checks
./scripts/run-silent.sh "task" "cmd"  # Wrap any command
```
