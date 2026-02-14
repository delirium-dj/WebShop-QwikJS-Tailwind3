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

### Step 3: Update the AI context files

6. Follow the instructions from `.github\skills\workflows\update-ai-context.md`. The goal is to keep `AI.md` up to date.

### Step 4: Accessibility & ID Attributes

7. Ensure all visible components have unique ID attributes (completed Feb 13, 2026):
   - unique IDs to interactive elements
   - IDs follow kebab-case naming convention
   - All buttons, forms, sections, and navigation elements should have semantic IDs

### Step 5: Clean Up

8. Delete any temporary log files or "test_copy" files created during the session.
9. Update README.md if needed.
10. Print a message to the user: "Summary complete! See TODO.md for your hand-off notes."
