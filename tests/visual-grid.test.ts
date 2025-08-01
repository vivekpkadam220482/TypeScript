/**
 * Visual Grid Runner Testing with Playwright and Applitools Eyes
 * 
 * This test demonstrates:
 * - Visual Grid Runner for cross-browser testing
 * - Batch processing of multiple browser/device combinations
 * - Efficient cloud-based visual testing
 * - Advanced configuration for enterprise-level testing
 */

import { chromium, Browser, Page } from 'playwright';
import { 
  Eyes, 
  Target, 
  Configuration, 
  BrowserType, 
  DeviceName,
  VisualGridRunner,
  BatchInfo,
  MatchLevel,
  StitchMode
} from '@applitools/eyes-playwright';
import path from 'path';

describe('Visual Grid Cross-Browser Testing', () => {
  let browser: Browser;
  let page: Page;
  let eyes: Eyes;
  let runner: VisualGridRunner;
  let eyesOpened: boolean = false;

  beforeAll(async () => {
    // Check environment
    if (!process.env.APPLITOOLS_API_KEY) {
      console.warn('⚠️  APPLITOOLS_API_KEY is not set. Visual validation will be skipped.');
      console.warn('   Tests will run in functional-only mode.');
      console.warn('   Get your API key from: https://applitools.com/docs/topics/overview/obtain-api-key.html');
    }

    // Initialize Visual Grid Runner with concurrency settings
    // This allows multiple browser configurations to run in parallel
    runner = new VisualGridRunner({ testConcurrency: 5 });
    
    // Initialize Playwright browser
    browser = await chromium.launch({ headless: true });
    
    console.log('🌐 Visual Grid Runner initialized with 5 concurrent tests');
  });

  beforeEach(async () => {
    // Reset the flag
    eyesOpened = false;
    
    // Create a new page
    page = await browser.newPage({
      viewport: { width: 1200, height: 800 }
    });
    
    // Initialize Eyes with Visual Grid Runner
    eyes = new Eyes(runner);
    
    // Create comprehensive configuration for cross-browser testing
    const configuration = new Configuration();
    
    // Application identification
    configuration.setAppName('Visual Testing Demo App - Grid');
    configuration.setTestName('Cross-Browser Visual Validation');
    
    // Batch configuration for organizing test results
    const batchInfo = new BatchInfo('Visual Grid Demo Batch');
    batchInfo.setId(`grid-batch-${Date.now()}`);
    configuration.setBatch(batchInfo);
    
    // Configure multiple desktop browsers
    configuration.addBrowser(1200, 800, BrowserType.CHROME);
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    configuration.addBrowser(1200, 800, BrowserType.SAFARI);
    configuration.addBrowser(1200, 800, BrowserType.EDGE);
    
    // Configure different viewport sizes for Chrome
    configuration.addBrowser(1920, 1080, BrowserType.CHROME); // Full HD
    configuration.addBrowser(1366, 768, BrowserType.CHROME);  // Common laptop
    configuration.addBrowser(1024, 768, BrowserType.CHROME);  // Tablet landscape
    
    // Configure mobile devices
    configuration.addDeviceEmulation(DeviceName.iPhone_11);
    configuration.addDeviceEmulation(DeviceName.iPhone_14_Pro);
    configuration.addDeviceEmulation(DeviceName.iPhone_5SE);
    configuration.addDeviceEmulation(DeviceName.Galaxy_S5);
    configuration.addDeviceEmulation(DeviceName.Galaxy_Note_2);
    configuration.addDeviceEmulation(DeviceName.iPad_Pro);
    configuration.addDeviceEmulation(DeviceName.iPad_Air_2);
    
    // Advanced Visual Grid configuration
    configuration.setMatchLevel(MatchLevel.Strict);
    configuration.setIgnoreCaret(true);
    configuration.setStitchMode(StitchMode.CSS);
    configuration.setForceFullPageScreenshot(true);
    configuration.setWaitBeforeScreenshots(1000); // Wait 1 second before screenshots
    
    // Set baseline environment
    configuration.setBaselineEnvName('Cross-Browser-Baseline');
    
    // Configure server URL if using private cloud (optional)
    // configuration.setServerUrl('https://your-private-cloud.applitools.com');
    
    eyes.setConfiguration(configuration);
  });

  afterEach(async () => {
    try {
      // Close Eyes session (only if eyes was actually opened)
      if (eyes && eyesOpened) {
        await eyes.closeAsync();
        console.log('👁️  Eyes session closed');
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
      await page?.close();
    }
  });

  afterAll(async () => {
    try {
      // Get all test results from the Visual Grid Runner
      const allTestResults = await runner.getAllTestResults(false);
      
      console.log('\n📊 VISUAL GRID TEST RESULTS SUMMARY');
      console.log('=====================================');
      
      let passed = 0;
      let failed = 0;
      let unresolved = 0;
      
      // Handle test results - check if it's an array or has results method
      const resultsArray = Array.isArray(allTestResults) ? allTestResults : allTestResults.getAllResults ? allTestResults.getAllResults() : [];
      
      for (const testResult of resultsArray) {
        const result = testResult.getTestResults ? testResult.getTestResults() : testResult;
        if (result) {
          console.log(`\n📱 Test: ${result.getName ? result.getName() : 'Unknown'}`);
          console.log(`   Status: ${result.getStatus ? result.getStatus() : 'Unknown'}`);
          console.log(`   Browser: ${result.getHostApp ? result.getHostApp() : 'Unknown'}`);
          console.log(`   OS: ${result.getHostOS ? result.getHostOS() : 'Unknown'}`);
          console.log(`   Viewport: ${result.getHostDisplaySize ? result.getHostDisplaySize()?.getWidth() + 'x' + result.getHostDisplaySize()?.getHeight() : 'Unknown'}`);
          console.log(`   Steps: ${result.getSteps ? result.getSteps() : 0}`);
          console.log(`   Matches: ${result.getMatches ? result.getMatches() : 0}`);
          console.log(`   Mismatches: ${result.getMismatches ? result.getMismatches() : 0}`);
          console.log(`   Missing: ${result.getMissing ? result.getMissing() : 0}`);
          console.log(`   URL: ${result.getUrl ? result.getUrl() : 'Not available'}`);
          
          const status = result.getStatus ? result.getStatus() : 'Unknown';
          switch (status) {
            case 'Passed':
              passed++;
              break;
            case 'Failed':
              failed++;
              break;
            case 'Unresolved':
              unresolved++;
              break;
          }
        }
      }
      
      console.log('\n📈 OVERALL SUMMARY');
      console.log(`   ✅ Passed: ${passed}`);
      console.log(`   ❌ Failed: ${failed}`);
      console.log(`   ⚠️  Unresolved: ${unresolved}`);
      console.log(`   📊 Total: ${passed + failed + unresolved}`);
      
      if (failed > 0) {
        console.log('\n⚠️  Some visual tests failed. Check the Applitools dashboard for details.');
      }
      
    } catch (error) {
      console.error('❌ Error getting test results:', error);
    } finally {
      await browser?.close();
    }
  });

  test('should run cross-browser visual validation', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally run cross-browser visual validation');
      
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
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      console.log(`📖 Loading page for cross-browser testing: ${fileUrl}`);
      
      // Navigate to the sample page
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Open Eyes session
      await eyes.open(page, 'Visual Testing Demo App - Grid', 'Cross-Browser Validation');
      eyesOpened = true;
      
      console.log('👁️  Visual Grid session opened - testing across multiple browsers');
      
      // 1. Initial page state across all configured browsers/devices
      await eyes.check('Initial Page Load', Target.window().fully());
      console.log('📸 Initial page captured across all browsers');
      
      // 2. Interactive state - theme toggle
      await page.click('#themeToggle');
      await page.waitForTimeout(500);
      await eyes.check('Dark Theme State', Target.window().fully());
      console.log('📸 Dark theme captured across all browsers');
      
      // 3. Modal interaction
      await page.click('#showModal');
      await page.waitForSelector('.modal.show', { state: 'visible' });
      await page.waitForTimeout(300);
      await eyes.check('Modal Open State', Target.window().fully());
      console.log('📸 Modal state captured across all browsers');
      
      // 4. Close modal and return to light theme
      await page.click('.close');
      await page.waitForSelector('.modal.show', { state: 'hidden' });
      await page.click('#themeToggle');
      await page.waitForTimeout(500);
      await eyes.check('Final Light Theme State', Target.window().fully());
      console.log('📸 Final state captured across all browsers');
      
      console.log('✅ Cross-browser visual validation test completed');
      console.log('🚀 Tests are now running in parallel across all configured browsers and devices');
      
    } catch (error) {
      console.error('❌ Cross-browser visual test failed:', error);
      throw error;
    }
  });

  test('should validate component-specific rendering across browsers', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally validate component rendering across browsers');
      
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      // Still test component functionality
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Test that components are present
      const headerVisible = await page.isVisible('header');
      const cardsVisible = await page.isVisible('.feature-card');
      expect(headerVisible).toBe(true);
      expect(cardsVisible).toBe(true);
      console.log('✅ Component functionality tested (without visual validation)');
      return;
    }

    try {
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Open Eyes session for component testing
      await eyes.open(page, 'Visual Testing Demo App - Grid', 'Component Cross-Browser Test');
      eyesOpened = true;
      
      console.log('👁️  Component-specific cross-browser testing started');
      
      // Test individual components across browsers
      await eyes.check('Header Component', Target.region('.header'));
      console.log('📸 Header component tested across browsers');
      
      await eyes.check('Navigation Component', Target.region('.nav'));
      console.log('📸 Navigation component tested across browsers');
      
      await eyes.check('Main Card Component', Target.region('.card'));
      console.log('📸 Main card component tested across browsers');
      
      await eyes.check('Feature Cards Grid', Target.region('.features'));
      console.log('📸 Feature cards grid tested across browsers');
      
      await eyes.check('Button Container', Target.region('.button-container'));
      console.log('📸 Button container tested across browsers');
      
      await eyes.check('Footer Component', Target.region('.footer'));
      console.log('📸 Footer component tested across browsers');
      
      console.log('✅ Component-specific cross-browser testing completed');
      
    } catch (error) {
      console.error('❌ Component cross-browser test failed:', error);
      throw error;
    }
  });

  test('should test form rendering and interactions', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally test form rendering and interactions');
      
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      // Still test form functionality
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Test that interactive elements work
      const buttonClickable = await page.isEnabled('#themeToggle');
      const modalButton = await page.isEnabled('#showModal');
      expect(buttonClickable).toBe(true);
      expect(modalButton).toBe(true);
      console.log('✅ Interactive elements tested (without visual validation)');
      return;
    }

    try {
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Open Eyes session for form testing
      await eyes.open(page, 'Visual Testing Demo App - Grid', 'Interactive Elements Cross-Browser Test');
      eyesOpened = true;
      
      console.log('👁️  Interactive elements cross-browser testing started');
      
      // Test button states
      await eyes.check('Default Button States', Target.region('.button-container'));
      
      // Test hover states
      await page.hover('#themeToggle');
      await page.waitForTimeout(200);
      await eyes.check('Button Hover State', Target.region('.button-container'));
      
      // Test focus states
      await page.focus('#themeToggle');
      await page.waitForTimeout(200);
      await eyes.check('Button Focus State', Target.region('.button-container'));
      
      // Test active states
      await page.mouse.down();
      await page.waitForTimeout(100);
      await eyes.check('Button Active State', Target.region('.button-container'));
      await page.mouse.up();
      
      console.log('✅ Interactive elements cross-browser testing completed');
      
    } catch (error) {
      console.error('❌ Interactive elements test failed:', error);
      throw error;
    }
  });
});