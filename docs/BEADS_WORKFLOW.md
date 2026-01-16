# Beads Workflow (bd)

This project uses **bd** (beads) for dependency-aware issue tracking. Issues are chained together like beads on a string.

## Key Commands

| Command                               | Description                             |
| ------------------------------------- | --------------------------------------- |
| `bd create "Task name"`               | Create new issue                        |
| `bd list`                             | List all issues                         |
| `bd list --status open`               | Filter by status                        |
| `bd ready`                            | Show issues ready to work (no blockers) |
| `bd show bd-1`                        | View issue details                      |
| `bd update bd-1 --status in_progress` | Update issue status                     |
| `bd close bd-1`                       | Mark issue complete                     |
| `bd dep add bd-1 bd-2`                | Add dependency (bd-2 blocks bd-1)       |

## Workflow Pattern

1. Use `bd ready` to find available work
2. Use `bd update <id> --status in_progress` to claim work
3. Use `bd create` when discovering new tasks during work
4. Use `bd dep add` to link related tasks
5. Use `bd close <id>` when work is complete

## Auto-Sync

bd automatically syncs with git (5s debounce):

- Exports to JSONL after changes
- Imports from JSONL after git pull
- No manual sync needed
