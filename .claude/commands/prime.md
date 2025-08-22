---
command: "/prime"
category: "Session Management"
purpose: "Load complete project context (alias for /startsession)"
wave-enabled: false
performance-profile: "standard"
---

# /prime - Project Context Loader

Load complete project context from CLAUDE.md. This is an alias for `/startsession` to maintain compatibility with existing workflow.

## Command Syntax

**Basic Usage:**
```
/prime
```

## Implementation

Execute session memory system:

```bash
npm run prime
```

## What This Provides

**Complete Project Context:**
- ✅ Current project state from CLAUDE.md
- ✅ Neo-brutalist design system details
- ✅ Technical stack and architecture
- ✅ Recent session updates and changes
- ✅ Current priorities and next tasks
- ✅ Development workflow and commands

## Purpose

Establishes session context for:
- PJM Studio neo-brutalist portfolio development
- Session continuity and memory
- Current project state awareness
- Effective assistance with latest context

## Relationship to Other Commands

- **Equivalent to**: `/startsession`
- **Counterpart**: `/endsession` (end session and update memory)
- **Workflow**: Use `/prime` at start, `/endsession` at end

## Auto-Persona Activation

None - session management utility command

## Legacy Compatibility

This command maintains compatibility with existing CLAUDE.md instructions that reference "/prime" for session startup.