---
command: "/checkpoint-delete"
category: "Project Management"
purpose: "Delete old checkpoints to manage storage space"
wave-enabled: false
performance-profile: "optimization"
---

# /checkpoint-delete - Remove Old Checkpoints

Delete specific checkpoints to free up storage space and manage checkpoint history.

## Command Syntax

```
/checkpoint-delete <checkpoint-id>
```

**Example:**
```
/checkpoint-delete 2025-01-29_13-15-42_auto-checkpoint
```

## Implementation

```javascript
await exec('node checkpoint-system.js delete "' + checkpointId + '"');
```

## Deletion Process

1. **🔍 Validation**: Confirms checkpoint exists
2. **🗑️ File Removal**: Deletes entire checkpoint directory
3. **📝 Registry Update**: Removes entry from manifest.json
4. **✅ Confirmation**: Reports successful deletion

## What Gets Deleted

- **Complete Checkpoint**: Entire snapshot directory removed
- **All Files**: Source code, assets, configuration files
- **Metadata**: Checkpoint details and creation info
- **Registry Entry**: Removed from checkpoint list

## Output Example

```
🗑️ Checkpoint '2025-01-29_13-15-42_auto-checkpoint' deleted successfully
```

## Safety Considerations

**⚠️ Warning**: Deletion is permanent and cannot be undone.

**Best Practices:**
- Use `/checkpoint-list` to verify checkpoint ID before deletion
- Keep important milestone checkpoints
- Delete only redundant or outdated snapshots
- Consider checkpoint age and significance

## Common Use Cases

**Storage Management:**
- Remove old auto-checkpoints
- Clean up test/experiment snapshots
- Free space for new checkpoints

**History Cleanup:**
- Remove failed attempt checkpoints
- Delete superseded versions
- Maintain organized checkpoint history

## Related Commands

- `/checkpoint-list` - View all checkpoints to identify deletion candidates
- `/checkpoint [title]` - Create new checkpoint
- `/checkpoint-restore <id>` - Restore before deletion if needed

## Workflow Example

```bash
# 1. List checkpoints to see what's available
/checkpoint-list

# 2. Identify old/unneeded checkpoint
# 3. Delete specific checkpoint
/checkpoint-delete 2025-01-28_10-30-15_old-experiment

# 4. Verify deletion
/checkpoint-list
```

## Storage Impact

Each checkpoint typically stores:
- **Size Range**: 1-5 MB depending on assets
- **File Count**: 100-200 files for complete project
- **Growth Pattern**: Linear increase with checkpoint count

Regular cleanup helps maintain efficient storage usage.