# ✅ AI Context System: Ready

## 📁 AI Dev Directory Overview

The `AI Dev` folder is the centralized "brain" for AI-assisted development on the ReconShop project. Each file serves a specific purpose for onboarding or maintaining AI agents.

### 📄 Contents

| File                       | Purpose                                                                                                                                          |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **`AI.md`**                | **Primary Context Source.** Contains 1,200+ lines of architecture, components, types, and logic flow. This is the first file any AI should read. |
| **`update-ai-context.md`** | **Maintenance Guide.** Steps to take after completing a feature to ensure `AI.md` stays synchronized with the codebase.                          |
| **`AI-QUICK-START.md`**    | **User Guide.** A fast reference for developers on how to leverage the AI Dev folder.                                                            |
| **`AI-CONTEXT-SETUP.md`**  | **Configuration log.** A summary of what was implemented during the AI Dev setup process.                                                        |

---

## 🎯 Current Project State for AI

The project has transitioned from a basic client-side demo to a professional **Server-Side Rendered (SSR)** application.

- **Data Source**: Switched from `mockProducts.ts` to the **FakeStore API** (`fakestoreapi.com`).
- **Fetching**: Implemented via Qwik City `routeLoader$`.
- **Mapping**: Real-time product mapping and imaginary discount variety logic implemented in `src/utils/product-mapper.ts`.
- **UI Rules**: Sticky elements, fixed aspect ratios (`object-contain`), and badge collision logic are fully documented in `AI.md`.

---

## 🚀 Recommended AI Workflow

1.  **Read**: Instruct the AI to read everything in the `AI Dev` folder.
2.  **Plan**: Ask the AI to generate an `IMPLEMENTATION_PLAN.md` based on `AI.md` patterns.
3.  **Execute**: Implement features using the verified Qwik/SSR snippets provided in `AI.md`.
4.  **Update**: Use `update-ai-context.md` to refresh the docs after a successful commit.

---

**Last Sync:** February 10, 2026  
**Version:** 2.1 (Post-SSR Implementation)
