---
command: "/checkpoint-restore"
category: "Project Management"
purpose: "Restore project to previous checkpoint state"
wave-enabled: false  
performance-profile: "standard"
---

# /checkpoint-restore - Restore Project State

Completely restore the entire project to a previous checkpoint state.

## Command Syntax

```
/checkpoint-restore <checkpoint-id>
```

**Example:**
```
/checkpoint-restore 2025-01-29_14-30-15_social-icons-fixed
```

## Implementation

```javascript
await exec('node checkpoint-system.js restore "' + checkpointId + '"');
```

## Safety Process

1. **🔍 Validation**: Verifies checkpoint exists
2. **💾 Auto-Backup**: Creates `pre-restore-backup` checkpoint of current state
3. **🧹 Clean Slate**: Removes current project files (preserves excluded items)
4. **📋 Restoration**: Copies all files from selected checkpoint
5. **✅ Verification**: Confirms successful restoration

## What Gets Restored

**Complete Project State:**
- ✅ All source code (`src/` directory)
- ✅ All HTML pages (index.html, home.html, etc.)
- ✅ Configuration files (package.json, vite.config.js)
- ✅ Documentation and project files
- ✅ All custom scripts and assets

**Preserved Items:**
- ❌ node_modules (run `npm install` after restore)
- ❌ .git repository (version control preserved)
- ❌ .checkpoints directory (checkpoint system preserved)

## Output Example

```
🔄 Restoring checkpoint: 2025-01-29_14-30-15_social-icons-fixed
📅 Created: 1/29/2025, 2:30:15 PM
📝 Title: social-icons-fixed
💾 Current state backed up as: 2025-01-29_16-45-33_pre-restore-backup
✅ Checkpoint restored successfully!
🔙 Previous state saved as backup: 2025-01-29_16-45-33_pre-restore-backup
```

## Post-Restore Steps

1. **Install Dependencies**: `npm install` (if package.json changed)
2. **Restart Dev Server**: `npm run dev` (if running)
3. **Verify Functionality**: Test restored features

## Rollback Safety

If restoration causes issues:
```
/checkpoint-restore 2025-01-29_16-45-33_pre-restore-backup
```

## Related Commands

- `/checkpoint-list` - Find checkpoint ID to restore
- `/checkpoint [title]` - Create checkpoint before major changes
- `/checkpoint-delete <id>` - Clean up unwanted checkpoints

## Use Cases

- **Bug Recovery**: Revert to working state after breaking changes
- **Feature Rollback**: Remove problematic features
- **Experiment Safety**: Try changes with easy rollback
- **Milestone Return**: Go back to known good states