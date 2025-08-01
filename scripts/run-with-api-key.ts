#!/usr/bin/env node

/**
 * Script to run tests with Applitools API key passed as command line argument
 * Usage: npx tsx scripts/run-with-api-key.ts --apiKey=YOUR_API_KEY [test-command]
 * 
 * Examples:
 * - npx tsx scripts/run-with-api-key.ts --apiKey=abc123 npm test
 * - npx tsx scripts/run-with-api-key.ts --apiKey=abc123 npm run test:basic
 * - npx tsx scripts/run-with-api-key.ts --apiKey=abc123 npx jest tests/basic-visual.test.ts
 */

import { spawn, ChildProcess } from 'child_process';
import process from 'process';

interface ParsedArguments {
  apiKey: string | null;
  command: string[];
}

function parseArguments(): ParsedArguments {
  const args: string[] = process.argv.slice(2);
  let apiKey: string | null = null;
  let command: string[] = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--apiKey=')) {
      apiKey = arg.split('=')[1];
    } else if (arg === '--apiKey' && i + 1 < args.length) {
      apiKey = args[i + 1];
      i++; // Skip the next argument since it's the API key value
    } else {
      command.push(arg);
    }
  }
  
  return { apiKey, command };
}

function printUsage(): void {
  console.log(`
Usage: npx tsx scripts/run-with-api-key.ts --apiKey=YOUR_API_KEY [test-command]

Examples:
  npx tsx scripts/run-with-api-key.ts --apiKey=abc123 npm test
  npx tsx scripts/run-with-api-key.ts --apiKey=abc123 npm run test:basic
  npx tsx scripts/run-with-api-key.ts --apiKey=abc123 npx jest tests/basic-visual.test.ts

Alternative format:
  npx tsx scripts/run-with-api-key.ts --apiKey abc123 npm test

Environment variables that will be set:
  - APPLITOOLS_API_KEY: Your provided API key
  - APPLITOOLS_BATCH_NAME: Auto-generated batch name
  - APPLITOOLS_BATCH_ID: Auto-generated batch ID
`);
}

function main(): void {
  const { apiKey, command } = parseArguments();
  
  if (!apiKey) {
    console.error('❌ Error: API key is required');
    printUsage();
    process.exit(1);
  }
  
  if (command.length === 0) {
    console.error('❌ Error: Test command is required');
    printUsage();
    process.exit(1);
  }
  
  // Set up environment variables
  const env = {
    ...process.env,
    APPLITOOLS_API_KEY: apiKey,
    APPLITOOLS_BATCH_NAME: `Local Test Run - ${new Date().toISOString()}`,
    APPLITOOLS_BATCH_ID: `batch-${Date.now()}`,
    APPLITOOLS_BRANCH_NAME: process.env.APPLITOOLS_BRANCH_NAME || 'local-development'
  };
  
  console.log('🚀 Starting tests with Applitools API key...');
  console.log(`📦 Batch: ${env.APPLITOOLS_BATCH_NAME}`);
  console.log(`🌿 Branch: ${env.APPLITOOLS_BRANCH_NAME}`);
  console.log(`▶️  Command: ${command.join(' ')}`);
  console.log('');
  
  // Spawn the child process
  const child: ChildProcess = spawn(command[0], command.slice(1), {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  
  // Handle child process events
  child.on('error', (error) => {
    console.error('❌ Failed to start command:', error.message);
    process.exit(1);
  });
  
  child.on('close', (code: number | null) => {
    if (code === 0) {
      console.log('\n✅ Tests completed successfully!');
    } else {
      console.log(`\n❌ Tests failed with exit code ${code}`);
    }
    process.exit(code || 1);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n⏹️  Stopping tests...');
    child.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n⏹️  Terminating tests...');
    child.kill('SIGTERM');
  });
}

// ES module check equivalent to require.main === module
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseArguments, main };