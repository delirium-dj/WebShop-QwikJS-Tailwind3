# 🚀 AI Dev Quick Start Guide

## 📦 What's Inside?

Everything you need for AI-assisted development is now centralized in the `AI Dev` directory:

✅ **AI.md** - Full project blueprint (SSR, API, Components, Patterns).  
✅ **update-ai-context.md** - Workflow to keep documentation fresh.  
✅ **AI-CONTEXT-SETUP.md** - Technical setup details and path maps.

---

## 📖 2-Minute Usage Guide

### 1. Give Context to an AI Assistant

If you're working with a new AI (like ChatGPT, Claude, or a different AI agent):

1. Copy the content of **`AI Dev/AI.md`**.
2. Paste it as your first message.
3. Ask: _"Based on this context, help me implement [Feature X]."_

### 2. Implementation Rules

- **SSR First**: Always use `routeLoader$` for data fetching.
- **Qwik Patterns**: Use `component$` and `$`-suffixed event handlers.
- **API Data**: Use `src/services/api/` instead of hardcoded mock data.
- **Styling**: Use Tailwind CSS for all UI work.

### 3. Maintenance

After finishing a task:

1. Open **`AI Dev/update-ai-context.md`**.
2. Follow the "Step 3: Update AI.md Sections" logic.
3. This ensures the _next_ time you use an AI, it knows what you just built.

---

## 📍 Key File Map

| File           | Path                          | Purpose                           |
| :------------- | :---------------------------- | :-------------------------------- |
| **Main Brain** | `AI Dev/AI.md`                | The one-stop-shop for AI context. |
| **Workflow**   | `AI Dev/update-ai-context.md` | Instructions for maintenance.     |
| **Overview**   | `README.md`                   | Public project documentation.     |
| **Roadmap**    | `TODO.md`                     | Current status and next steps.    |

---

**Version:** 2.0 (SSR & API Update)  
**Date:** February 10, 2026  
**Status:** Ready to 🚀
