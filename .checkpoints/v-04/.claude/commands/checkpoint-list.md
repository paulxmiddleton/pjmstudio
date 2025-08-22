---
command: "/checkpoint-list"
category: "Project Management"  
purpose: "List all saved project checkpoints with metadata"
wave-enabled: false
performance-profile: "optimization"
---

# /checkpoint-list - View All Checkpoints

Display all saved project checkpoints with detailed metadata.

## Command Syntax

```
/checkpoint-list
```

## Implementation

```javascript
await exec('node checkpoint-system.js list');
```

## Output Format

```
📋 Available Checkpoints:

1. 2025-01-29_14-30-15_social-icons-fixed
   Title: social-icons-fixed
   Date: 1/29/2025, 2:30:15 PM
   Files: 127
   Size: 2.4 MB

2. 2025-01-29_13-15-42_auto-checkpoint  
   Title: auto-checkpoint
   Date: 1/29/2025, 1:15:42 PM
   Files: 124
   Size: 2.3 MB
```

## Metadata Displayed

- **Checkpoint ID**: Unique timestamp-based identifier
- **Title**: Custom or auto-generated name
- **Creation Date**: Human-readable timestamp
- **File Count**: Number of files in snapshot
- **Storage Size**: Disk space used

## Related Commands

- `/checkpoint [title]` - Create new checkpoint
- `/checkpoint-restore <id>` - Restore checkpoint
- `/checkpoint-delete <id>` - Delete checkpoint

## Use Cases

- Planning which checkpoint to restore
- Managing storage space  
- Tracking project milestones
- Identifying checkpoint age and scope