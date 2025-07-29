---
command: "/prime"
category: "Project Context"
purpose: "Load complete project context and establish session understanding"
wave-enabled: false
performance-profile: "standard"
---

# /prime - Project Context Loader

Load and display the complete project context from prime.md to establish session understanding for the PJM Studio medieval-themed portfolio website.

## Command Syntax

**Basic Usage:**
```
/prime
```

## Implementation

Execute prime command with Node.js:

```javascript
// Load project context
await exec('node prime-command.js');

// Alternative direct load
await exec('node prime-command.js load');
```

## What This Provides

**Project Overview:**
- ✅ Identity, goals, and design philosophy
- ✅ Current technical architecture status
- ✅ Completed features and next priorities
- ✅ File structure and development commands
- ✅ Asset optimization details
- ✅ Known issues and user preferences

## Purpose

Establishes comprehensive session context for effective assistance with:
- Medieval-themed portfolio development
- E-commerce integration planning  
- Performance optimization
- Content management
- Technical architecture decisions

## Auto-Persona Activation

None - context loading utility command