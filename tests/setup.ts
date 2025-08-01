/**
 * Jest setup file for visual testing
 * This file is run before each test file
 */

// Load environment variables from .env file
import 'dotenv/config';

// Import Playwright test utilities for Jest integration
import 'expect-playwright';

// Extend Jest timeout for visual tests which can take longer
jest.setTimeout(60000);

// Global test configuration
global.console = {
  ...console,
  // Suppress console.log during tests unless debugging
  log: process.env.DEBUG ? console.log : jest.fn(),
  debug: process.env.DEBUG ? console.debug : jest.fn(),
  info: process.env.DEBUG ? console.info : jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Global setup for Applitools environment variables
process.env.APPLITOOLS_BATCH_NAME = process.env.APPLITOOLS_BATCH_NAME || 'Visual Testing Demo';
process.env.APPLITOOLS_BATCH_ID = process.env.APPLITOOLS_BATCH_ID || `batch-${Date.now()}`;

// Ensure required environment variables are set
if (!process.env.APPLITOOLS_API_KEY) {
  console.warn('⚠️  APPLITOOLS_API_KEY is not set. Visual tests will fail.');
  console.warn('   Please set your Applitools API key in .env file or environment variables.');
}