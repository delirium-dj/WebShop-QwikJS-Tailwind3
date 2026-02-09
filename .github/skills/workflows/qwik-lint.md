---
description: Scans the codebase for missing Qwik "$" symbols and non-serializable state.
---

---

## description: Scans the codebase for missing Qwik "$" symbols and non-serializable state.

# Qwik-Lint Workflow

### Prescan with ESlint

1. Before starting the AI linting, run "npm run lint". If ESLint finds errors, do not use AI to fix them. Tell me to fix the ESLint errors first to save tokens

### Step 1: Scan for Missing "$"

2. Search all `.tsx` files in the `src/` directory.
3. Identify any Qwik hooks or events that are missing the `$` suffix.
   - _Check list: component, useTask, useVisibleTask, useComputed, onClick, onChange._
4. If a missing `$` is found, do NOT fix it yet. List the file and line number for me.

### Step 2: State Verification

5. Look for `useSignal` or `useStore` declarations.
6. Flag any instances where complex JavaScript objects (like Class instances or Functions) are being stored directly in state.

### Step 3: Reporting

7. Create a small temporary file called `QWIK_CHECK.md` with a summary of these findings.
8. Ask me: "I found [X] potential Qwik issues. Should I attempt to fix them automatically?"
