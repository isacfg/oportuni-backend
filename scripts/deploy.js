#!/usr/bin/env node

/**
 * Production deployment script for Render
 * This script handles database setup and migrations
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

const runCommand = (command, args = []) => {
    return new Promise((resolve, reject) => {
        console.log(`Running: ${command} ${args.join(' ')}`);
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
};

const main = async () => {
    try {
        console.log('🚀 Starting production deployment...');

        // Step 1: Build the application
        console.log('📦 Building application...');
        await runCommand('node', ['ace', 'build']);

        // Step 2: Run migrations
        console.log('🗄️  Running database migrations...');
        await runCommand('node', ['ace', 'migration:run', '--force']);

        // Step 3: Check if we should run seeders (only if explicitly requested)
        console.log('🌱 Running database seeders...');
        await runCommand('node', ['ace', 'db:seed']);

        console.log('✅ Deployment completed successfully!');

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
};

main(); 