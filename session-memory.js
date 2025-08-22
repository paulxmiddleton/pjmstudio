#!/usr/bin/env node

/**
 * PJM Studio Session Memory System
 * Manages session context and project memory for Claude Code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;
const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

class SessionMemory {
    constructor() {
        this.sessionStartTime = new Date();
    }

    /**
     * /endsession - Summarize session and update CLAUDE.md
     */
    async endSession(sessionSummary = '') {
        console.log('🧠 Ending session and updating project memory...\n');
        
        try {
            // Read current CLAUDE.md
            const currentContent = fs.readFileSync(claudeMdPath, 'utf8');
            
            // Generate timestamp
            const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const sessionDuration = Math.round((new Date() - this.sessionStartTime) / 1000 / 60); // minutes
            
            // Create session summary section
            const sessionUpdate = this.generateSessionUpdate(sessionSummary, timestamp, sessionDuration);
            
            // Update CLAUDE.md with new session info
            const updatedContent = this.updateClaudeMd(currentContent, sessionUpdate);
            
            // Write back to file
            fs.writeFileSync(claudeMdPath, updatedContent, 'utf8');
            
            console.log('✅ Session memory updated successfully');
            console.log(`📝 Session duration: ${sessionDuration} minutes`);
            console.log(`📅 Updated: ${timestamp}`);
            console.log('\n🎯 CLAUDE.md updated with session context for next session');
            
            return true;
        } catch (error) {
            console.error('❌ Error updating session memory:', error.message);
            return false;
        }
    }

    /**
     * /startsession - Load project context and display current state
     */
    startSession() {
        console.log('🏰 Starting PJM Studio session - Loading project memory...\n');
        
        try {
            const content = fs.readFileSync(claudeMdPath, 'utf8');
            
            // Extract key information for session start
            const currentState = this.extractCurrentState(content);
            
            console.log('📋 PROJECT CONTEXT LOADED:');
            console.log('═══════════════════════════════════════════════════════════════\n');
            console.log(content);
            console.log('\n═══════════════════════════════════════════════════════════════');
            console.log('\n🎯 SESSION READY - Claude has full project context');
            
            return true;
        } catch (error) {
            console.error('❌ Error loading session memory:', error.message);
            return false;
        }
    }

    generateSessionUpdate(summary, timestamp, duration) {
        return `
### Last Session Update (${timestamp})
**Session Duration**: ${duration} minutes
**Key Changes**: ${summary || 'Session completed - no specific summary provided'}
**Context**: Updated project memory for seamless session continuity

`;
    }

    updateClaudeMd(content, sessionUpdate) {
        // Find the best place to insert session update
        // Look for existing session update section and replace it
        const sessionUpdateRegex = /### Last Session Update.*?\n\n/s;
        
        if (sessionUpdateRegex.test(content)) {
            // Replace existing session update
            return content.replace(sessionUpdateRegex, sessionUpdate);
        } else {
            // Add session update after the main header sections but before project structure
            const insertPoint = content.indexOf('### Project Structure');
            if (insertPoint !== -1) {
                return content.slice(0, insertPoint) + sessionUpdate + content.slice(insertPoint);
            } else {
                // Fallback: add at end
                return content + '\n' + sessionUpdate;
            }
        }
    }

    extractCurrentState(content) {
        // Extract key sections for quick overview
        const sections = {
            identity: this.extractSection(content, '### Identity'),
            currentFeatures: this.extractSection(content, '### Current Features'),
            nextTasks: this.extractSection(content, '### Next Priority Tasks'),
            lastUpdate: this.extractSection(content, '### Last Session Update')
        };
        
        return sections;
    }

    extractSection(content, sectionTitle) {
        const regex = new RegExp(`${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=###|$)`, 'i');
        const match = content.match(regex);
        return match ? match[1].trim() : null;
    }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const sessionMemory = new SessionMemory();

switch (command) {
    case 'end':
    case 'endsession':
        const summary = args.slice(1).join(' ');
        sessionMemory.endSession(summary);
        break;
        
    case 'start':
    case 'startsession':
    case 'prime':
        sessionMemory.startSession();
        break;
        
    default:
        console.log(`
🧠 PJM Studio Session Memory System

Usage:
  node session-memory.js start         Load project context (session startup)
  node session-memory.js end [summary] End session and update CLAUDE.md

Examples:
  node session-memory.js start
  node session-memory.js end "Fixed ASCII positioning issues on store page"

This system maintains project memory between Claude Code sessions by:
- Loading complete context at session start
- Updating CLAUDE.md with session summaries at session end
- Ensuring Claude always has current project state
`);
        break;
}