---
description: Automatically generates a README.md for Qwik components to document props and signals.
---

---

## description: Automatically generates a README.md for Qwik components to document props and signals.

# Qwik-Docs Generator

### Step 1: Component Analysis

1. Scan the current file or folder for the `component$` declaration.
2. Identify the `interface Props` or the props destructured in the function arguments.

### Step 2: Extracting the "Magic"

3. List all `useSignal` and `useStore` variables used within the component.
4. Explain what each prop does and if it requires a `$` (serialized) function.

### Step 3: File Creation

5. Create a `filename-README.md` in the same folder as the component.
6. Use the following template:
   - **Component Name:** (e.g., `<MyButton />`)
   - **Props Table:** Name, Type, and Description.
   - **Usage Example:** A small code snippet showing how to call this component.
7. Print a message: "Documentation generated! This will help me remember this component's logic next time."
