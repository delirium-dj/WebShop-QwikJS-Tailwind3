---
description: Generates a hand-off summary of today's progress and pending tasks.
---

---

## description: Generates a hand-off summary of today's progress and pending tasks.

# Progress Summary Workflow

### Step 1: Analyze Recent Work

1. Scan all `*.md` files in root directory.
2. Scan the git logs using `git log --oneline`.
3. List all files modified in the `src/` directory.

### Step 2: Write the Summary

4. Analyze a file in the root directory called `TODO.md`.
5. Structure that file so it must include:
   - **What's Finished:** A bulleted list of completed features.
   - **The "Wall":** Any bugs or errors that stopped progress today.
   - **Next Steps:** A clear "To-Do" list for the next session.

### Step 3: Clean Up

6. Delete any temporary log files or "test_copy" files created during the session.
7. Print a message to the user: "Summary complete! See TODO.md for your hand-off notes."
