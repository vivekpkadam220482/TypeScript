/**
 * Basic Visual Testing with Playwright and Applitools Eyes
 * 
 * This test demonstrates:
 * - Initializing Applitools Eyes
 * - Loading a sample HTML page
 * - Taking visual checkpoints
 * - Proper cleanup and error handling
 */

import { chromium, Browser, Page } from 'playwright';
import { Eyes, Target, Configuration, BrowserType, DeviceName } from '@applitools/eyes-playwright';
import path from 'path';

describe('Basic Visual Testing', () => {
  let browser: Browser;
  let page: Page;
  let eyes: Eyes;
  let eyesOpened: boolean = false;

  beforeAll(async () => {
    // Check environment
    if (!process.env.APPLITOOLS_API_KEY) {
      console.warn('⚠️  APPLITOOLS_API_KEY is not set. Visual validation will be skipped.');
      console.warn('   Tests will run in functional-only mode.');
      console.warn('   Get your API key from: https://applitools.com/docs/topics/overview/obtain-api-key.html');
    }

    // Initialize Playwright browser
    browser = await chromium.launch({ headless: true });
  });

  beforeEach(async () => {
    // Reset the flag
    eyesOpened = false;
    
    // Create a new page for each test
    page = await browser.newPage();
    
    // Initialize Applitools Eyes
    eyes = new Eyes();
    
    // Configure Eyes with browser and device settings
    const configuration = new Configuration();
    configuration.setAppName('Visual Testing Demo App');
    configuration.setTestName('Basic Visual Test');
    
    // Set the batch name for grouping tests in the dashboard
    configuration.setBatch({
      name: process.env.APPLITOOLS_BATCH_NAME || 'Visual Testing Demo',
      id: process.env.APPLITOOLS_BATCH_ID || `batch-${Date.now()}`
    });
    
    // Optional: Set specific browser configurations for testing
    configuration.addBrowser(800, 600, BrowserType.CHROME);
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    configuration.addBrowser(1024, 768, BrowserType.SAFARI);
    
    // Optional: Add mobile device testing
    configuration.addDeviceEmulation(DeviceName.iPhone_11);
    configuration.addDeviceEmulation(DeviceName.Galaxy_S5);
    
    eyes.setConfiguration(configuration);
  });

  afterEach(async () => {
    try {
      // Close Eyes session and get test results (only if eyes was actually opened)
      if (eyes && eyesOpened) {
        const results = await eyes.close(false);
        console.log(`✅ Visual test completed: ${results?.getName()}`);
        console.log(`   Status: ${results?.getStatus()}`);
        console.log(`   URL: ${results?.getUrl()}`);
      }
    } catch (error) {
      // Only log as error if Eyes were supposed to be open
      if (eyesOpened) {
        console.error('❌ Error closing Eyes session:', error);
      }
    } finally {
      // Always abort Eyes session if not closed properly (only if eyes was opened)
      if (eyes && eyesOpened) {
        await eyes.abortIfNotClosed();
      }
      
      // Close the page
      await page?.close();
    }
  });

  afterAll(async () => {
    // Close the browser
    await browser?.close();
  });

  test('should capture initial page load', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally capture the initial page load');
      
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      // Still test page loading and basic functionality
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).toBe('Visual Testing Sample Page');
      console.log('✅ Page loaded successfully (without visual validation)');
      return;
    }

    try {
      // Get the absolute path to the sample HTML file
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      console.log(`📖 Loading page: ${fileUrl}`);
      
      // Navigate to the sample HTML page
      await page.goto(fileUrl);
      
      // Wait for the page to fully load
      await page.waitForLoadState('networkidle');
      
      // Open Eyes session - this starts the visual testing
      await eyes.open(page, 'Visual Testing Demo App', 'Basic Page Load Test');
      eyesOpened = true;
      
      console.log('👁️  Eyes session opened successfully');
      
      // Take a visual checkpoint of the entire page
      await eyes.check('Initial Page Load', Target.window().fully());
      
      console.log('📸 Initial page screenshot captured');
      
      // Verify that key elements are present
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toBe('Visual Testing Demo');
      
      const themeToggleVisible = await page.locator('#themeToggle').isVisible();
      expect(themeToggleVisible).toBe(true);
      
      const showModalVisible = await page.locator('#showModal').isVisible();
      expect(showModalVisible).toBe(true);
      
      console.log('✅ Page elements verified');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  });

  test('should capture page after theme toggle', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally capture theme toggle interactions');
      
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      // Still test theme toggle functionality
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Test theme toggle functionality
      await page.click('#themeToggle');
      await page.waitForTimeout(500);
      
      const bodyClass = await page.getAttribute('body', 'class');
      expect(bodyClass).toContain('dark-theme');
      console.log('✅ Theme toggle functionality works (without visual validation)');
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
      
      // Open Eyes session
      await eyes.open(page, 'Visual Testing Demo App', 'Theme Toggle Test');
      eyesOpened = true;
      
      console.log('👁️  Eyes session opened for theme toggle test');
      
      // Take initial screenshot
      await eyes.check('Before Theme Toggle', Target.window().fully());
      console.log('📸 Initial state captured');
      
      // Click the theme toggle button
      await page.click('#themeToggle');
      
      // Wait for the theme transition to complete
      await page.waitForTimeout(500);
      
      // Verify the dark theme class is applied
      const bodyClass = await page.getAttribute('body', 'class');
      expect(bodyClass).toContain('dark-theme');
      
      // Take screenshot after theme change
      await eyes.check('After Dark Theme Toggle', Target.window().fully());
      console.log('📸 Dark theme state captured');
      
      // Toggle back to light theme
      await page.click('#themeToggle');
      await page.waitForTimeout(500);
      
      // Take final screenshot
      await eyes.check('After Light Theme Toggle', Target.window().fully());
      console.log('📸 Light theme state captured');
      
    } catch (error) {
      console.error('❌ Theme toggle test failed:', error);
      throw error;
    }
  });

  test('should capture modal interaction', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally capture modal interactions');
      
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      // Still test modal functionality
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Test modal functionality
      await page.click('#showModal');
      await page.waitForSelector('.modal.show', { state: 'visible' });
      
      const modalVisible = await page.isVisible('.modal.show');
      expect(modalVisible).toBe(true);
      console.log('✅ Modal functionality works (without visual validation)');
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
      
      // Open Eyes session
      await eyes.open(page, 'Visual Testing Demo App', 'Modal Interaction Test');
      eyesOpened = true;
      
      console.log('👁️  Eyes session opened for modal test');
      
      // Take initial screenshot
      await eyes.check('Before Modal', Target.window().fully());
      console.log('📸 Initial state captured');
      
      // Click the show modal button
      await page.click('#showModal');
      
      // Wait for modal to appear
      await page.waitForSelector('.modal.show', { state: 'visible' });
      
      // Verify modal is visible
      const modalVisible = await page.locator('.modal.show').isVisible();
      expect(modalVisible).toBe(true);
      
      // Take screenshot with modal open
      await eyes.check('With Modal Open', Target.window().fully());
      console.log('📸 Modal open state captured');
      
      // Close modal by clicking the X button
      await page.click('.close');
      
      // Wait for modal to close
      await page.waitForSelector('.modal.show', { state: 'hidden' });
      
      // Take final screenshot
      await eyes.check('After Modal Close', Target.window().fully());
      console.log('📸 Modal closed state captured');
      
    } catch (error) {
      console.error('❌ Modal interaction test failed:', error);
      throw error;
    }
  });
});