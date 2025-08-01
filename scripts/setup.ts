#!/usr/bin/env node

/**
 * Setup Script for Playwright + Applitools Visual Testing
 * 
 * This script helps with initial setup and provides utilities for
 * managing the visual testing environment.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Colors for console output
interface Colors {
  reset: string;
  bright: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
}

const colors: Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message: string): void {
  log(`\n${colors.bright}${colors.blue}${'='.repeat(50)}${colors.reset}`);
  log(`${colors.bright}${colors.blue} ${message}${colors.reset}`);
  log(`${colors.bright}${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
}

function logSuccess(message: string): void {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message: string): void {
  log(`⚠️  ${message}`, colors.yellow);
}

function logError(message: string): void {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message: string): void {
  log(`ℹ️  ${message}`, colors.cyan);
}

function runCommand(command: string, description: string): boolean {
  try {
    log(`\n🔄 ${description}...`, colors.cyan);
    execSync(command, { stdio: 'inherit' });
    logSuccess(`${description} completed`);
    return true;
  } catch (error: any) {
    logError(`${description} failed: ${error.message}`);
    return false;
  }
}

function checkFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function createFileFromTemplate(templatePath: string, targetPath: string, replacements: Record<string, string> = {}): boolean {
  try {
    if (checkFileExists(targetPath)) {
      logWarning(`File ${targetPath} already exists, skipping...`);
      return false;
    }

    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Apply replacements
    Object.entries(replacements).forEach(([key, value]) => {
      content = content.replace(new RegExp(key, 'g'), value);
    });

    fs.writeFileSync(targetPath, content);
    logSuccess(`Created ${targetPath}`);
    return true;
  } catch (error: any) {
    logError(`Failed to create ${targetPath}: ${error.message}`);
    return false;
  }
}

function validateEnvironment(): boolean {
  logHeader('Environment Validation');

  // Check Node.js version
  const nodeVersion = process.version;
  log(`Node.js version: ${nodeVersion}`);
  
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 16) {
    logError('Node.js version 16 or higher is required');
    return false;
  }
  logSuccess('Node.js version is compatible');

  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log(`npm version: ${npmVersion}`);
    logSuccess('npm is available');
  } catch (error) {
    logError('npm is not available');
    return false;
  }

  // Check for Applitools API key
  const apiKey = process.env.APPLITOOLS_API_KEY;
  if (!apiKey) {
    logWarning('APPLITOOLS_API_KEY environment variable is not set');
    logInfo('You will need to set this before running visual tests');
    logInfo('Get your API key from: https://applitools.com/docs/topics/overview/obtain-api-key.html');
  } else {
    logSuccess('APPLITOOLS_API_KEY is set');
  }

  return true;
}

function setupProject(): boolean {
  logHeader('Project Setup');

  // Check if package.json exists
  if (!checkFileExists('package.json')) {
    logError('package.json not found. Make sure you\'re in the project root directory.');
    return false;
  }

  // Install dependencies
  if (!runCommand('npm install', 'Installing dependencies')) {
    return false;
  }

  // Install Playwright browsers
  if (!runCommand('npx playwright install', 'Installing Playwright browsers')) {
    return false;
  }

  // Build TypeScript
  if (!runCommand('npm run build', 'Building TypeScript')) {
    return false;
  }

  // Create .env file if it doesn't exist
  if (!checkFileExists('.env')) {
    // Create a basic .env file
    const envContent = `# Applitools Configuration
# Copy this file and add your actual values

# Required: Your Applitools API Key
# Get this from: https://applitools.com/docs/topics/overview/obtain-api-key.html
APPLITOOLS_API_KEY=your_applitools_api_key_here

# Optional: Batch configuration
APPLITOOLS_BATCH_NAME=Visual Testing Demo
APPLITOOLS_BATCH_ID=

# Optional: Branch configuration for CI/CD
# APPLITOOLS_BRANCH_NAME=main
# APPLITOOLS_PARENT_BRANCH_NAME=main

# Development/Debug settings
DEBUG=false
NODE_ENV=test
`;
    fs.writeFileSync('.env', envContent);
    logSuccess('Created .env file');
    logInfo('Please edit .env file and add your APPLITOOLS_API_KEY');
    logInfo('Get your API key from: https://applitools.com/docs/topics/overview/obtain-api-key.html');
  }

  return true;
}

function runTests(testType: string = 'all'): boolean {
  logHeader(`Running ${testType} Tests`);

  let command;
  switch (testType) {
    case 'basic':
      command = 'npm run test:basic';
      break;
    case 'advanced':
      command = 'npm run test:advanced';
      break;
    case 'grid':
      command = 'npm run test:grid';
      break;
    case 'example':
      command = 'npx jest tests/example.test.ts';
      break;
    case 'all':
    default:
      command = 'npm test';
      break;
  }

  return runCommand(command, `Running ${testType} tests`);
}

function showUsage(): void {
  log(`
${colors.bright}Usage: node scripts/setup.js [command]${colors.reset}

${colors.bright}Commands:${colors.reset}
  ${colors.green}validate${colors.reset}    - Validate environment and dependencies
  ${colors.green}setup${colors.reset}       - Install dependencies and setup project
  ${colors.green}test${colors.reset}        - Run all tests
  ${colors.green}test:basic${colors.reset}  - Run basic visual tests
  ${colors.green}test:advanced${colors.reset} - Run advanced visual tests
  ${colors.green}test:grid${colors.reset}   - Run Visual Grid tests
  ${colors.green}test:example${colors.reset} - Run example tests
  ${colors.green}help${colors.reset}        - Show this help message

${colors.bright}Examples:${colors.reset}
  node scripts/setup.js setup
  node scripts/setup.js test:basic
  node scripts/setup.js validate

${colors.bright}Environment Variables:${colors.reset}
  ${colors.cyan}APPLITOOLS_API_KEY${colors.reset}    - Your Applitools API key (required)
  ${colors.cyan}APPLITOOLS_BATCH_NAME${colors.reset} - Name for test batches
  ${colors.cyan}DEBUG${colors.reset}                 - Enable debug logging (true/false)

${colors.bright}Get Started:${colors.reset}
  1. Run: ${colors.green}node scripts/setup.js setup${colors.reset}
  2. Edit .env file with your Applitools API key
  3. Run: ${colors.green}node scripts/setup.js test:example${colors.reset}
`);
}

function main(): void {
  const command = process.argv[2];

  log(`${colors.bright}${colors.magenta}🎯 Playwright + Applitools Visual Testing Setup${colors.reset}\n`);

  switch (command) {
    case 'validate':
      if (validateEnvironment()) {
        logSuccess('Environment validation passed');
      } else {
        process.exit(1);
      }
      break;

    case 'setup':
      if (validateEnvironment() && setupProject()) {
        logSuccess('Project setup completed successfully');
        logInfo('Next steps:');
        logInfo('1. Edit .env file with your Applitools API key');
        logInfo('2. Run: node scripts/setup.js test:example');
      } else {
        process.exit(1);
      }
      break;

    case 'test':
      if (runTests('all')) {
        logSuccess('All tests completed');
      } else {
        process.exit(1);
      }
      break;

    case 'test:basic':
      if (runTests('basic')) {
        logSuccess('Basic tests completed');
      } else {
        process.exit(1);
      }
      break;

    case 'test:advanced':
      if (runTests('advanced')) {
        logSuccess('Advanced tests completed');
      } else {
        process.exit(1);
      }
      break;

    case 'test:grid':
      if (runTests('grid')) {
        logSuccess('Visual Grid tests completed');
      } else {
        process.exit(1);
      }
      break;

    case 'test:example':
      if (runTests('example')) {
        logSuccess('Example tests completed');
      } else {
        process.exit(1);
      }
      break;

    case 'help':
    case '--help':
    case '-h':
      showUsage();
      break;

    default:
      if (command) {
        logError(`Unknown command: ${command}`);
      }
      showUsage();
      break;
  }
}

// Run the main function if this script is executed directly
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, validateEnvironment, setupProject, runTests, showUsage };