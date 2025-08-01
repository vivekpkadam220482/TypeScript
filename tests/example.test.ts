/**
 * Simple Example Visual Test
 * 
 * This is a minimal example to get you started with visual testing.
 * Use this as a template for creating your own visual tests.
 */

import { chromium, Browser, Page } from 'playwright';
import { Eyes, Target, Configuration, BrowserType } from '@applitools/eyes-playwright';
import { VisualTestHelper, EnvironmentValidator } from '../src/utils/test-helpers';

describe('Example Visual Test', () => {
  let browser: Browser;
  let page: Page;
  let eyes: Eyes;
  let helper: VisualTestHelper;
  let eyesOpened: boolean = false;

  beforeAll(async () => {
    // Validate environment before running tests
    const isValidEnvironment = EnvironmentValidator.validate();
    if (!isValidEnvironment) {
      console.warn('⚠️  Environment validation failed - some tests may be skipped');
      console.warn('   Please set APPLITOOLS_API_KEY to run visual tests');
    }

    // Print current configuration
    EnvironmentValidator.printConfig();

    // Initialize browser
    browser = await chromium.launch({ headless: true });
  });

  beforeEach(async () => {
    // Reset the flag
    eyesOpened = false;
    
    // Create new page
    page = await browser.newPage();
    
    // Initialize Eyes
    eyes = new Eyes();
    
    // Configure Eyes using helper
    VisualTestHelper.configureEyes(eyes, {
      appName: 'My Visual Testing App',
      testName: 'Simple Example Test',
      batchName: 'Example Test Batch'
    });
    
    // Create helper instance
    helper = new VisualTestHelper(eyes, page);
  });

  afterEach(async () => {
    try {
      // Close Eyes and get results (only if eyes was actually opened)
      if (eyes && eyesOpened) {
        const results = await eyes.close(false);
        console.log(`✅ Test completed: ${results?.getStatus()}`);
      }
    } catch (error) {
      // Only log as error if Eyes were supposed to be open
      if (eyesOpened) {
        console.error('❌ Test failed:', error);
      }
    } finally {
      // Always abort Eyes session if not closed properly (only if eyes was opened)
      if (eyes && eyesOpened) {
        await eyes.abortIfNotClosed();
      }
      
      // Close the page
      if (page) {
        await page.close();
      }
    }
  });

  afterAll(async () => {
    await browser?.close();
  });

  test('should capture the sample page', async () => {
    // Skip test if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual test - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally capture a visual screenshot of the sample page');
      
      // Still load and validate the page works
      await helper.loadSamplePage();
      const title = await page.title();
      expect(title).toBe('Visual Testing Sample Page');
      console.log('✅ Page loaded successfully (without visual validation)');
      return;
    }
    
    try {
      console.log('🚀 Starting simple visual test...');
      
      // Open Eyes session
      await eyes.open(page, 'My Visual Testing App', 'Simple Page Test');
      eyesOpened = true;
      
      // Load the sample page using helper
      await helper.loadSamplePage();
      
      // Take a screenshot
      await helper.captureFullPage('Sample Page');
      
      console.log('📸 Screenshot captured successfully');
      
    } catch (error) {
      console.error('❌ Simple test failed:', error);
      throw error;
    }
  });

  test('should test theme toggle interaction', async () => {
    // Skip test if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual test - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally capture theme toggle interactions');
      
      // Still test the functionality works
      await helper.loadSamplePage();
      
      // Test theme toggle functionality
      await page.click('#themeToggle');
      await page.waitForTimeout(500);
      
      const bodyClass = await page.getAttribute('body', 'class');
      expect(bodyClass).toContain('dark-theme');
      console.log('✅ Theme toggle functionality works (without visual validation)');
      return;
    }
    
    try {
      console.log('🚀 Starting theme toggle test...');
      
      // Open Eyes session
      await eyes.open(page, 'My Visual Testing App', 'Theme Toggle Test');
      eyesOpened = true;
      
      // Load page
      await helper.loadSamplePage();
      
      // Test theme toggle using helper
      await helper.captureFullPage('Light Theme');
      await helper.toggleDarkThemeAndCapture('Dark Theme');
      
      console.log('📸 Theme toggle test completed');
      
    } catch (error) {
      console.error('❌ Theme toggle test failed:', error);
      throw error;
    }
  });
});