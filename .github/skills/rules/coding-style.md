---
trigger: always_on
---

# Documentation & Commenting Rules

## Mandatory Commenting

- **Always Comment:** Every time you generate new code or modify existing code, you MUST include inline comments.
- **Target Audience:** Write comments specifically for a **Newbie or Junior Developer**.
- **The "Why," not just the "What":** Don't just explain what the code is doing (e.g., "increments x"); explain _why_ it is doing it (e.g., "we increment the counter here so the UI knows how many times the user clicked the button").

## Qwik-Specific Comments

- **The "$" Symbol:** Whenever you use a `$` (like in `component$`), add a brief comment explaining that this is for Qwik's "Resumability" or "Lazy Loading."
- **Signals:** When using `useSignal`, explain that this is a "reactive variable" that updates the UI automatically.

## System Specification

- **Operating System Awareness:** Always have in mind that you are working in Windows 10 and using PowerShell as a terminal.
