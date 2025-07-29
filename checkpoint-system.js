#!/usr/bin/env node

/**
 * PJM Studio Checkpoint System
 * Custom versioning system for complete project snapshots
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;
const checkpointsDir = path.join(projectRoot, '.checkpoints');
const manifestPath = path.join(checkpointsDir, 'manifest.json');

// Files/folders to exclude from checkpoints
const EXCLUDE_PATTERNS = [
    'node_modules',
    '.git',
    'dist',
    '.checkpoints',
    'checkpoint-system.js',
    '.DS_Store',
    '*.log',
    'tmp',
    'temp'
];

class CheckpointSystem {
    constructor() {
        this.ensureCheckpointsDir();
        this.manifest = this.loadManifest();
    }

    ensureCheckpointsDir() {
        if (!fs.existsSync(checkpointsDir)) {
            fs.mkdirSync(checkpointsDir, { recursive: true });
        }
    }

    loadManifest() {
        if (fs.existsSync(manifestPath)) {
            try {
                return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            } catch (e) {
                console.warn('Warning: Could not parse manifest.json, creating new one');
            }
        }
        return { checkpoints: [] };
    }

    saveManifest() {
        fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
    }

    generateTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    }

    shouldExclude(filePath) {
        const relativePath = path.relative(projectRoot, filePath);
        return EXCLUDE_PATTERNS.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(relativePath);
            }
            return relativePath.includes(pattern);
        });
    }

    copyFileRecursive(src, dest) {
        const stats = fs.statSync(src);
        
        if (stats.isDirectory()) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            
            const files = fs.readdirSync(src);
            for (const file of files) {
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);
                
                if (!this.shouldExclude(srcPath)) {
                    this.copyFileRecursive(srcPath, destPath);
                }
            }
        } else {
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(src, dest);
        }
    }

    async createCheckpoint(customTitle = null) {
        const timestamp = this.generateTimestamp();
        let checkpointId;
        let title;
        
        if (customTitle) {
            // Custom title: use title as-is, no timestamp prefix
            title = customTitle;
            checkpointId = customTitle.replace(/[^a-zA-Z0-9-_]/g, '-');
        } else {
            // No custom title: use timestamp with auto-checkpoint
            title = 'auto-checkpoint';
            checkpointId = `${timestamp}_${title}`;
        }
        
        const checkpointDir = path.join(checkpointsDir, checkpointId);

        console.log(`📸 Creating checkpoint: ${checkpointId}`);

        // Create checkpoint directory
        fs.mkdirSync(checkpointDir, { recursive: true });

        // Copy all project files
        const projectFiles = fs.readdirSync(projectRoot);
        let fileCount = 0;

        for (const file of projectFiles) {
            const srcPath = path.join(projectRoot, file);
            const destPath = path.join(checkpointDir, file);
            
            if (!this.shouldExclude(srcPath)) {
                this.copyFileRecursive(srcPath, destPath);
                fileCount++;
            }
        }

        // Create metadata
        const metadata = {
            id: checkpointId,
            timestamp: new Date().toISOString(),
            title: title,
            description: customTitle ? `Custom checkpoint: ${customTitle}` : 'Automatic checkpoint',
            fileCount: this.countFiles(checkpointDir),
            size: this.getFolderSize(checkpointDir)
        };

        fs.writeFileSync(
            path.join(checkpointDir, 'metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        // Update manifest
        this.manifest.checkpoints.unshift(metadata);
        this.saveManifest();

        console.log(`✅ Checkpoint created successfully!`);
        console.log(`📁 Location: .checkpoints/${checkpointId}`);
        console.log(`📊 Files saved: ${metadata.fileCount}`);
        console.log(`💾 Size: ${this.formatSize(metadata.size)}`);

        return checkpointId;
    }

    listCheckpoints() {
        if (this.manifest.checkpoints.length === 0) {
            console.log('📝 No checkpoints found');
            return;
        }

        console.log('📋 Available Checkpoints:\n');
        
        this.manifest.checkpoints.forEach((checkpoint, index) => {
            const date = new Date(checkpoint.timestamp).toLocaleString();
            console.log(`${index + 1}. ${checkpoint.id}`);
            console.log(`   Title: ${checkpoint.title}`);
            console.log(`   Date: ${date}`);
            console.log(`   Files: ${checkpoint.fileCount}`);
            console.log(`   Size: ${this.formatSize(checkpoint.size)}`);
            console.log('');
        });
    }

    async restoreCheckpoint(checkpointId) {
        const checkpoint = this.manifest.checkpoints.find(cp => cp.id === checkpointId);
        
        if (!checkpoint) {
            console.error(`❌ Checkpoint '${checkpointId}' not found`);
            return false;
        }

        const checkpointDir = path.join(checkpointsDir, checkpointId);
        
        if (!fs.existsSync(checkpointDir)) {
            console.error(`❌ Checkpoint directory not found: ${checkpointDir}`);
            return false;
        }

        console.log(`🔄 Restoring checkpoint: ${checkpointId}`);
        console.log(`📅 Created: ${new Date(checkpoint.timestamp).toLocaleString()}`);
        console.log(`📝 Title: ${checkpoint.title}`);

        // Create backup of current state
        const backupId = await this.createCheckpoint('pre-restore-backup');
        console.log(`💾 Current state backed up as: ${backupId}`);

        // Clear current project (except excluded items)
        this.clearProject();

        // Restore files from checkpoint
        const checkpointFiles = fs.readdirSync(checkpointDir);
        
        for (const file of checkpointFiles) {
            if (file === 'metadata.json') continue;
            
            const srcPath = path.join(checkpointDir, file);
            const destPath = path.join(projectRoot, file);
            
            this.copyFileRecursive(srcPath, destPath);
        }

        console.log(`✅ Checkpoint restored successfully!`);
        console.log(`🔙 Previous state saved as backup: ${backupId}`);
        
        return true;
    }

    clearProject() {
        const projectFiles = fs.readdirSync(projectRoot);
        
        for (const file of projectFiles) {
            const filePath = path.join(projectRoot, file);
            
            if (!this.shouldExclude(filePath)) {
                if (fs.statSync(filePath).isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(filePath);
                }
            }
        }
    }

    deleteCheckpoint(checkpointId) {
        const checkpointIndex = this.manifest.checkpoints.findIndex(cp => cp.id === checkpointId);
        
        if (checkpointIndex === -1) {
            console.error(`❌ Checkpoint '${checkpointId}' not found`);
            return false;
        }

        const checkpointDir = path.join(checkpointsDir, checkpointId);
        
        if (fs.existsSync(checkpointDir)) {
            fs.rmSync(checkpointDir, { recursive: true, force: true });
        }

        this.manifest.checkpoints.splice(checkpointIndex, 1);
        this.saveManifest();

        console.log(`🗑️ Checkpoint '${checkpointId}' deleted successfully`);
        return true;
    }

    countFiles(dir) {
        let count = 0;
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                count += this.countFiles(filePath);
            } else {
                count++;
            }
        }
        
        return count;
    }

    getFolderSize(dir) {
        let size = 0;
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                size += this.getFolderSize(filePath);
            } else {
                size += stats.size;
            }
        }
        
        return size;
    }

    formatSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const system = new CheckpointSystem();

switch (command) {
    case 'create':
        const title = args[1];
        system.createCheckpoint(title);
        break;
        
    case 'list':
        system.listCheckpoints();
        break;
        
    case 'restore':
        const checkpointId = args[1];
        if (!checkpointId) {
            console.error('❌ Please specify checkpoint ID');
            process.exit(1);
        }
        system.restoreCheckpoint(checkpointId);
        break;
        
    case 'delete':
        const deleteId = args[1];
        if (!deleteId) {
            console.error('❌ Please specify checkpoint ID');
            process.exit(1);
        }
        system.deleteCheckpoint(deleteId);
        break;
        
    default:
        console.log(`
🏰 PJM Studio Checkpoint System

Usage:
  node checkpoint-system.js create [title]     Create a new checkpoint
  node checkpoint-system.js list               List all checkpoints  
  node checkpoint-system.js restore <id>       Restore a checkpoint
  node checkpoint-system.js delete <id>        Delete a checkpoint

Examples:
  node checkpoint-system.js create "social-icons-fixed"
  node checkpoint-system.js create
  node checkpoint-system.js restore 2025-01-29_14-30-15_social-icons-fixed
  node checkpoint-system.js list
`);
        break;
}