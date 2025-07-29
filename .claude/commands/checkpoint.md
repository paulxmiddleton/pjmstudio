---
command: "/checkpoint"
category: "Project Management"
purpose: "Create complete project snapshots with date/time organization"
wave-enabled: false
performance-profile: "standard"
---

# /checkpoint - Project Checkpoint System

Create complete snapshots of entire PJM Studio codebase with automatic date/time naming.

## Command Syntax

**Basic Usage:**
```
/checkpoint [optional-title]
```

**Examples:**
- `/checkpoint` → `2025-01-29_14-30-15_auto-checkpoint`
- `/checkpoint "social-icons-fixed"` → `2025-01-29_14-30-15_social-icons-fixed`
- `/checkpoint "pre-ecommerce-integration"` → `2025-01-29_14-30-15_pre-ecommerce-integration`

## Implementation

Execute checkpoint system with Node.js:

```javascript
// Create checkpoint
await exec('node checkpoint-system.js create "' + title + '"');

// Auto-checkpoint (no title)
await exec('node checkpoint-system.js create');
```

## What Gets Saved

**Included:**
- ✅ Complete `src/` directory (JS, SCSS, HTML, assets)
- ✅ All HTML files (index.html, home.html, etc.)
- ✅ Configuration files (package.json, vite.config.js)
- ✅ Project documentation (CLAUDE.md, README)
- ✅ All custom scripts and utilities

**Excluded:**
- ❌ node_modules (reconstructible)
- ❌ .git directory (separate version control)
- ❌ dist/ build artifacts  
- ❌ temporary/cache files

## Storage Structure

```
.checkpoints/
├── manifest.json                              # Registry
├── 2025-01-29_14-30-15_social-icons-fixed/   # Complete snapshot
│   ├── metadata.json                         # Details
│   ├── src/                                  # Full copy
│   ├── index.html, home.html, etc.          # All HTML
│   └── ... (complete project)                # Everything
```

## Related Commands

- `/checkpoint-list` - View all saved checkpoints
- `/checkpoint-restore <id>` - Restore to previous state  
- `/checkpoint-delete <id>` - Remove old checkpoints

## Auto-Persona Activation

None - utility command for project management

## Integration Notes

- Creates automatic backup before any restore
- Thread-safe for concurrent development
- Metadata tracking for checkpoint management
- Efficient storage with excluded patterns