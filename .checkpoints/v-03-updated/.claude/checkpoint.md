# Checkpoint Commands

Custom checkpoint system for PJM Studio - complete project versioning with date/time organization.

## Usage

### `/checkpoint [title]` - Create Checkpoint
Create a complete snapshot of the entire codebase with automatic date/time naming.

**Examples:**
- `/checkpoint` - Creates: `2025-01-29_14-30-15_auto-checkpoint`
- `/checkpoint "social-icons-fixed"` - Creates: `2025-01-29_14-30-15_social-icons-fixed`
- `/checkpoint "pre-ecommerce-integration"` - Creates: `2025-01-29_14-30-15_pre-ecommerce-integration`

**What gets saved:**
- ✅ Complete `src/` directory (JS, SCSS, HTML, assets)
- ✅ All HTML files (index.html, home.html, etc.)
- ✅ Configuration files (package.json, vite.config.js, etc.)
- ✅ Project documentation (CLAUDE.md, README, etc.)
- ❌ Excludes: node_modules, .git, dist, temp files

### `/checkpoint-list` - List All Checkpoints
View all saved checkpoints with metadata.

**Shows:**
- Checkpoint ID with timestamp
- Custom title
- Creation date/time  
- Number of files saved
- Storage size

### `/checkpoint-restore <id>` - Restore Checkpoint
Completely restore project to a previous checkpoint state.

**Process:**
1. Automatically backs up current state first
2. Clears current project files  
3. Restores all files from chosen checkpoint
4. Provides rollback checkpoint in case of issues

**Example:**
```
/checkpoint-restore 2025-01-29_14-30-15_social-icons-fixed
```

### `/checkpoint-delete <id>` - Delete Checkpoint
Remove a checkpoint to free up space.

**Example:**
```  
/checkpoint-delete 2025-01-29_14-30-15_old-version
```

## Technical Details

**Storage Location:** `.checkpoints/` directory
**Naming Format:** `YYYY-MM-DD_HH-MM-SS_custom-title`
**Metadata:** Each checkpoint includes JSON metadata with creation time, file count, and size
**Safety:** All restore operations create automatic backups before proceeding

## File Structure
```
.checkpoints/
├── manifest.json                              # Registry of all checkpoints
├── 2025-01-29_14-30-15_social-icons-fixed/   # Complete project snapshot
│   ├── metadata.json                         # Checkpoint details
│   ├── src/                                  # Full source code copy
│   ├── index.html                            # Landing page
│   ├── home.html                             # Home page  
│   ├── package.json                          # Dependencies
│   └── ... (all project files)               # Everything else
└── 2025-01-29_15-45-22_pre-ecommerce/        # Another checkpoint
```

## Integration with Development Workflow

**Recommended Usage:**
- Create checkpoints before major changes
- Use descriptive titles for important milestones
- Regular auto-checkpoints during development sessions
- Keep system checkpoints for rollback safety

**Example Workflow:**
1. `/checkpoint "before-header-redesign"` - Save current state
2. Make changes to header design
3. `/checkpoint "header-redesign-complete"` - Save successful changes
4. If issues arise: `/checkpoint-restore 2025-01-29_14-30-15_before-header-redesign`