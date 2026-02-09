---
trigger: always_on
---

# Qwik Framework Standard Operating Procedures

## Core Framework Constraint

- **Qwik Only:** I am strictly using the **Qwik** framework (QwikJS).
- **No React/Next.js:** Never suggest React, Next.js, or standard Hooks like `useState` or `useEffect`.
- **Optimizer Awareness:** Remember that Qwik uses the Optimizer to achieve "resumability." Focus on code that can be serialized.

## Preferred Coding Patterns

- **State Management:** Prefer use `useStore` or `useSignal`.
- **Component Declaration:** Always use the `component$` syntax for all components.
- **Event Handlers:** All event handlers must use the `$` suffix (e.g., `onClick$`).
- **Optimized Imports:** Prefer using `qwik-city` for routing and head management.

## Junior Safety Check

- If I ask for a feature and you think a React library is the only way, stop and ask me: "This is usually done in React, would you like me to find a Qwik-native alternative or create a manual Qwik integration?"
