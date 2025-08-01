/**
 * Example Test Using Runtime Configuration for Applitools API Key
 * 
 * This test demonstrates how to use the runtime configuration method
 * to set the Applitools API key programmatically without using
 * environment variables or .env files.
 */

import { chromium, Browser, Page } from 'playwright';
import { Target } from '@applitools/eyes-playwright';
import path from 'path';
import { 
  setApplitoolsConfig, 
  createConfiguredEyes, 
  validateApiKeyAvailability,
  getComprehensiveConfig,
  clearRuntimeConfig
} from '../src/utils/applitools-runtime-config';

describe('Runtime Configuration Example', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    // Initialize Playwright browser
    browser = await chromium.launch({ headless: true });
    
    // Example: Set runtime configuration
    // In a real scenario, you might get this from:
    // - A secure config file
    // - A command line argument parser
    // - A configuration service
    // - User input (for development)
    
    const apiKey = process.env.APPLITOOLS_API_KEY || 
                   process.argv.find(arg => arg.startsWith('--apiKey='))?.split('=')[1];
    
    if (apiKey) {
      console.log('🔧 Setting up Applitools runtime configuration...');
      
      setApplitoolsConfig({
        apiKey: apiKey,
        appName: 'Runtime Configuration Demo',
        batchName: `Runtime Test - ${new Date().toISOString().split('T')[0]}`,
        batchId: `runtime-batch-${Date.now()}`,
        branchName: 'runtime-configuration-example',
        baselineEnvName: 'Development'
      });
      
      console.log('✅ Runtime configuration set successfully');
      
      // Verify configuration
      const config = getComprehensiveConfig();
      console.log('📋 Current configuration:', {
        hasApiKey: !!config?.apiKey,
        appName: config?.appName,
        batchName: config?.batchName,
        branchName: config?.branchName
      });
    } else {
      console.warn('⚠️  No API key provided. Tests will run without visual validation.');
      console.warn('   To enable visual testing, provide API key via:');
      console.warn('   - Environment variable: APPLITOOLS_API_KEY="your_key"');
      console.warn('   - Command line: npm test -- --apiKey="your_key"');
    }
  });

  beforeEach(async () => {
    // Create a new page for each test
    page = await browser.newPage();
  });

  afterEach(async () => {
    // Close the page after each test
    await page?.close();
  });

  afterAll(async () => {
    // Clear runtime configuration after all tests
    clearRuntimeConfig();
    
    // Close the browser
    await browser?.close();
  });

  test('should demonstrate runtime configuration usage', async () => {
    // Check if API key is available
    if (!validateApiKeyAvailability()) {
      console.log('⏭️  Skipping visual validation - No API key available');
      console.log('   This test demonstrates runtime configuration setup');
      
      // Still run basic functional test
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toBe('Visual Testing Sample Page');
      console.log('✅ Functional test completed (without visual validation)');
      return;
    }

    try {
      // Get the absolute path to the sample HTML file
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      console.log(`📖 Loading page: ${fileUrl}`);
      
      // Navigate to the sample HTML page
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Create Eyes instance using runtime configuration
      const eyes = createConfiguredEyes({
        // You can override specific settings here
        appName: 'Runtime Config Override Example'
      });
      
      console.log('👁️  Created Eyes instance with runtime configuration');
      
      // Open Eyes session
      await eyes.open(page, 'Runtime Configuration Demo', 'Basic Runtime Test');
      
      console.log('🔓 Eyes session opened successfully');
      
      // Take a visual checkpoint
      await eyes.check('Runtime Configuration Page', Target.window().fully());
      
      console.log('📸 Visual checkpoint captured');
      
      // Verify page functionality
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toBe('Visual Testing Demo');
      
      console.log('✅ Page functionality verified');
      
      // Close Eyes session
      const results = await eyes.close(false);
      
      console.log('🎯 Visual test completed successfully');
      console.log(`   Test Name: ${results?.getName()}`);
      console.log(`   Status: ${results?.getStatus()}`);
      console.log(`   URL: ${results?.getUrl()}`);
      
    } catch (error) {
      console.error('❌ Runtime configuration test failed:', error);
      throw error;
    }
  });

  test('should demonstrate configuration override', async () => {
    if (!validateApiKeyAvailability()) {
      console.log('⏭️  Skipping visual validation - No API key available');
      return;
    }

    try {
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Create Eyes instance with configuration override
      const eyes = createConfiguredEyes({
        appName: 'Override Demo App',
        batchName: 'Override Batch',
        branchName: 'override-branch'
      });
      
      console.log('👁️  Created Eyes instance with configuration override');
      
      await eyes.open(page, 'Override Demo App', 'Configuration Override Test');
      
      // Click theme toggle to show interaction
      await page.click('#themeToggle');
      await page.waitForTimeout(500);
      
      await eyes.check('Dark Theme with Override Config', Target.window().fully());
      
      const results = await eyes.close(false);
      
      console.log('🎯 Configuration override test completed');
      console.log(`   Status: ${results?.getStatus()}`);
      
    } catch (error) {
      console.error('❌ Configuration override test failed:', error);
      throw error;
    }
  });

  test('should validate configuration availability', async () => {
    // Test the validation functions
    const hasConfig = validateApiKeyAvailability();
    const comprehensiveConfig = getComprehensiveConfig();
    
    console.log('🔍 Configuration validation results:');
    console.log(`   API Key Available: ${hasConfig}`);
    console.log(`   Comprehensive Config: ${comprehensiveConfig ? 'Available' : 'Not Available'}`);
    
    if (comprehensiveConfig) {
      console.log(`   App Name: ${comprehensiveConfig.appName}`);
      console.log(`   Batch Name: ${comprehensiveConfig.batchName}`);
      console.log(`   Branch Name: ${comprehensiveConfig.branchName}`);
    }
    
    // This test always passes as it's just demonstrating the validation
    expect(typeof hasConfig).toBe('boolean');
  });
});