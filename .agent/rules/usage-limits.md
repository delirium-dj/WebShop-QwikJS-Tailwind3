---
trigger: always_on
---

# AI Usage & Safety Rules

## Quota Management

- **Think Before Acting:** Before running any multi-file refactor, you MUST generate an `IMPLEMENTATION_PLAN.md` and wait for my approval.
- **No Automated Testing Loops:** Do not run unit tests more than 2 times in a row. If they fail twice, stop and ask me for guidance.
- **Browser Limits:** Use the integrated browser only for visual verification of the UI. Do not use it for research or documentation searching.

## Terminal Safety

- **Approval Required:** Always ask for permission before running `pnpm install`, `docker-compose`, or any command that modifies the file system outside of the `src/` folder.
- **Stop on Error:** If a terminal command returns a non-zero exit code (an error), do not try to "brute force" a fix. Stop and explain the error to me first.
