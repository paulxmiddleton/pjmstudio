#!/usr/bin/env node

/**
 * PJM Studio Prime Command
 * Load complete project context for Claude Code sessions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;
const primeFilePath = path.join(projectRoot, 'prime.md');

class PrimeCommand {
    constructor() {
        // No initialization needed for this simple command
    }

    loadContext() {
        if (!fs.existsSync(primeFilePath)) {
            console.error('❌ prime.md file not found in project root');
            return false;
        }

        try {
            const content = fs.readFileSync(primeFilePath, 'utf8');
            console.log('🏰 Loading PJM Studio Project Context...\n');
            console.log(content);
            return true;
        } catch (error) {
            console.error('❌ Error reading prime.md:', error.message);
            return false;
        }
    }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const primeSystem = new PrimeCommand();

switch (command) {
    case 'load':
    case undefined: // Default action when no argument provided
        primeSystem.loadContext();
        break;
        
    default:
        console.log(`
🏰 PJM Studio Prime Command

Usage:
  node prime-command.js           Load project context
  node prime-command.js load      Load project context

This command loads the complete project context from prime.md to establish
proper session understanding for the PJM Studio medieval-themed portfolio website.
`);
        break;
}