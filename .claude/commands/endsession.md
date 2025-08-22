---
command: "/endsession"
category: "Session Management"
purpose: "Summarize session and update project memory for continuity"
wave-enabled: false
performance-profile: "standard"
---

# /endsession - Session Memory Updater

Summarize current session work and update CLAUDE.md with context for seamless next session startup.

## Command Syntax

**Basic Usage:**
```
/endsession
```

**With Summary:**
```
/endsession [summary of session work]
```

## Implementation

Execute session memory system:

```bash
# Basic end session
npm run endsession

# With summary
npm run endsession "Summary of key changes and work completed"
```

## What This Does

**Session Summary & Memory Update:**
- 📝 Records session duration and timestamp
- 🔄 Updates CLAUDE.md with session summary
- 🎯 Captures key changes and progress
- 💾 Maintains project memory continuity
- 🚀 Prepares context for next session

## Purpose

Maintains project memory by:
- Documenting session progress
- Updating project context in CLAUDE.md
- Preventing loss of session work
- Ensuring next session has current state
- Avoiding outdated context issues

## Examples

```
/endsession "Fixed ASCII positioning on store page, resolved 3 engine initialization"

/endsession "Implemented new navigation system with responsive design"

/endsession "Added Stripe integration and tested payment flow"
```

## Auto-Persona Activation

None - session management utility command

## Session Memory Integration

This command integrates with the session memory system to:
- Update CLAUDE.md with session context
- Maintain project memory between sessions
- Document progress and changes
- Ensure seamless session continuity