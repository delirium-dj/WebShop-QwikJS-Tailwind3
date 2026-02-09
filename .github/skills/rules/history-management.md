---
trigger: always_on
---

# History & Cache Management

## Writing to History

- **Task Logging:** After completing any major task (Refactor, Lint, or Feature addition), you must create a small MD file in `.agent/history/` named `YYYY-MM-DD-task-name.md`.
- **State Snapshots:** This file must contain:
  1. A list of files modified.
  2. The "State of the App" (e.g., "Database connection fixed, but UI still needs Tailwind classes").
  3. The Git Hash (to track exactly which version of the code this report belongs to).

## Semantic Cache Strategy

- **Pre-Flight Check:** Before starting ANY task, you must run `ls .agent/history/` and read the 2 most recent files.
- **Avoid Redundancy:** If the current user request matches a "Success" state in the history and the files haven't changed, DO NOT re-run the logic. Report: "Task already verified in history. No tokens spent."
- **Project Map:** After each change analyze and if neccessary update the `.github\skills\history\project-map.md`
