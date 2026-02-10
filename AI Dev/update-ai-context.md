---
description: Automatically updates the AI.md context file with the latest project structure and documentation after significant changes.
---

# AI Context Document Generator

## Purpose

Keeps the `AI.md` file at the project root up-to-date with the latest project structure, components, types, and development patterns. This skill ensures the web UI AI chat always has current project context.

## When to Run

This skill should be run:

- After completing a major feature implementation
- After restructuring project folders/components
- After adding new core components or contexts
- After updating routing structure
- After changing deployment configuration
- Monthly as maintenance task

## What Gets Updated

The AI.md file includes:

### 1. Project Structure Map

- All folder and file organization
- Component hierarchy
- Routes structure
- Configuration files

### 2. Component Documentation

- Component props and purpose
- Custom hooks
- Provider wrappers
- Component relationships

### 3. Type Definitions

- Product interface
- Cart types
- Image types
- API response types

### 4. Architecture Overview

- State management patterns
- Data flow diagrams
- Context providers
- Event handling patterns

### 5. Configuration Details

- Vite settings
- TypeScript config
- Tailwind theme
- Build commands

### 6. Development Status

- Completed features (✅)
- In-progress items (🔄)
- Planned features (📋)

### 7. Quick Reference Guides

- How to add routes
- How to use cart
- How to add toasts
- How to handle images

## Implementation Steps

### Step 1: Gather Project Information

Run these commands to collect current project state:

```bash
# Get project structure
tree -I 'node_modules|dist' -L 3 > project-tree.txt

# List all components
find src/components -name "*.tsx" -type f > component-list.txt

# List all routes
find src/routes -name "*.tsx" -type f > routes-list.txt

# Get package dependencies
cat package.json | jq '.devDependencies' > dependencies.json
```

### Step 2: Review Source Files

Read these key files to extract latest information:

**Essential Files to Review:**

- `src/root.tsx` - App initialization
- `src/routes/layout.tsx` - Global layout & providers
- `src/components/` - All component files
- `src/contexts/` - All context implementations
- `src/types/` - All TypeScript definitions
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies & scripts
- `tailwind.config.js` - Styling theme
- `README.md` - Project overview
- `TODO.md` - Development roadmap

### Step 3: Update AI.md Sections

Use this template to update each section:

#### Section 1: Overview Update

- Update technology versions if changed
- Update feature list based on TODO.md status
- Update command descriptions if scripts changed

#### Section 2: Project Structure

- Run `tree` command and verify folder structure
- List all new components added
- Document new routes created
- Update component file list

#### Section 3: Components Documentation

- For each new component, document:
  - Purpose and responsibility
  - Props interface
  - Key hooks used
  - Related components
  - Usage example

#### Section 4: Context Updates

- Document any new context providers
- Update context type definitions
- Show new custom hooks
- Update usage examples

#### Section 5: Development Status

- Check `TODO.md` for completed ✅ items
- Move completed items to "Completed" section
- Update "In Progress" items
- Add new planned features

#### Step 4: Verify Links & Examples

- Verify all file paths are correct
- Check all code examples still compile
- Verify import paths use `~/` aliases
- Ensure all TypeScript examples are valid

### Step 5: Format & Finalize

- Ensure consistent markdown formatting
- Verify all code blocks have language specified
- Check table formatting
- Validate all links work
- Run spell check

## Output

The updated `AI.md` file should be:

✅ **Complete** - Contains all necessary project information
✅ **Current** - Reflects latest codebase state
✅ **Accurate** - All paths, names, and examples are correct
✅ **Organized** - Easy to navigate with clear sections
✅ **Exemplary** - Shows best practices and patterns
✅ **Useful** - Provides actionable quick reference guides

## Quality Checklist

Before considering the update complete:

- [ ] Project structure map is accurate
- [ ] All components are documented
- [ ] All contexts are explained
- [ ] All types are listed
- [ ] Code examples compile and are idiomatic
- [ ] File paths are correct
- [ ] Import paths use `~/` aliases
- [ ] Development status reflects TODO.md
- [ ] Architecture diagrams are up-to-date
- [ ] Quick reference guides are useful
- [ ] No broken links or dead references
- [ ] Formatting is consistent
- [ ] Document is searchable and well-organized

## File Management

**Location:** `/AI.md` (root of project)

**Size Target:** 3,000-5,000 lines (comprehensive but focused)

**Format:** Markdown with clear hierarchy

**Version:** Update date in footer each time

**Backup:** Previous version can be archived in `tasks/` if needed

## Usage for Web UI AI

To use this document in web UI chat:

1. Open the `AI.md` file
2. Copy entire content
3. Paste into web UI chat
4. Ask AI to perform tasks with this context

The document should provide enough context for an external AI to:

- Understand project structure
- Make informed component changes
- Add new features correctly
- Maintain code quality standards
- Follow project conventions
- Reference existing patterns

## Related Files

- `.agent/history/project-map.md` - Shorter project overview
- `README.md` - Public project description
- `TODO.md` - Development roadmap
- `tasks/PROGRESS_SUMMARY.md` - Completion tracking

## Notes

- This skill should take 30-60 minutes to run thoroughly
- Can be run incrementally (section by section)
- Best run after feature completion, not mid-feature
- Ask: "Should I update AI.md?" when major changes complete
- Keep previous versions if you need to compare changes

---

**Version:** 1.0  
**Created:** February 9, 2026  
**Last Updated:** February 9, 2026
