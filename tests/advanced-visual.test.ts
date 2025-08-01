/**
 * Advanced Visual Testing with Playwright and Applitools Eyes
 * 
 * This test demonstrates:
 * - Advanced Eyes configuration
 * - Multiple visual checkpoints in a single test
 * - Element-specific visual testing
 * - Custom match levels and ignore regions
 * - Cross-browser testing capabilities
 */

import { chromium, Browser, Page } from 'playwright';
import { 
  Eyes, 
  Target, 
  Configuration, 
  BrowserType, 
  DeviceName,
  MatchLevel,
  Region
} from '@applitools/eyes-playwright';
import path from 'path';

describe('Advanced Visual Testing', () => {
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

    // Initialize Playwright browser with additional options
    browser = await chromium.launch({ 
      headless: true,
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
  });

  beforeEach(async () => {
    // Reset the flag
    eyesOpened = false;
    
    // Create a new page with viewport configuration
    page = await browser.newPage({
      viewport: { width: 1200, height: 800 }
    });
    
    // Initialize Applitools Eyes with advanced configuration
    eyes = new Eyes();
    
    const configuration = new Configuration();
    
    // Application and test identification
    configuration.setAppName('Visual Testing Demo App - Advanced');
    configuration.setTestName('Advanced UI Interactions');
    
    // Batch configuration for test organization
    configuration.setBatch({
      name: process.env.APPLITOOLS_BATCH_NAME || 'Advanced Visual Testing',
      id: process.env.APPLITOOLS_BATCH_ID || `advanced-batch-${Date.now()}`
    });
    
    // Cross-browser testing configuration
    configuration.addBrowser(1200, 800, BrowserType.CHROME);
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    configuration.addBrowser(1200, 800, BrowserType.EDGE);
    
    // Mobile device testing
    configuration.addDeviceEmulation(DeviceName.iPhone_14_Pro);
    configuration.addDeviceEmulation(DeviceName.Galaxy_S5);
    configuration.addDeviceEmulation(DeviceName.iPad_Pro);
    
    // Advanced matching configuration
    configuration.setMatchLevel(MatchLevel.Strict);
    configuration.setIgnoreCaret(true);
    configuration.setIgnoreDisplacements(false);
    
    // Set baseline environment name for consistent comparisons
    configuration.setBaselineEnvName('Production');
    
    eyes.setConfiguration(configuration);
  });

  afterEach(async () => {
    try {
      // Close Eyes session with failure handling (only if eyes was actually opened)
      if (eyes && eyesOpened) {
        const results = await eyes.close(false);
        
        if (results) {
          console.log(`✅ Advanced test completed: ${results.getName()}`);
          console.log(`   Status: ${results.getStatus()}`);
          console.log(`   Steps: ${results.getSteps()}`);
          console.log(`   Matches: ${results.getMatches()}`);
          console.log(`   Mismatches: ${results.getMismatches()}`);
          console.log(`   Missing: ${results.getMissing()}`);
          console.log(`   URL: ${results.getUrl()}`);
        }
      }
    } catch (error) {
      // Only log as error if Eyes were supposed to be open
      if (eyesOpened) {
        console.error('❌ Error in advanced test:', error);
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
    await browser?.close();
  });

  test('should perform comprehensive UI testing workflow', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally perform comprehensive visual testing');
      
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
      
      console.log(`📖 Loading page for comprehensive testing: ${fileUrl}`);
      
      // Navigate and wait for full load
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // Additional wait for animations
      
      // Open Eyes session
      await eyes.open(page, 'Visual Testing Demo App - Advanced', 'Comprehensive UI Workflow');
      eyesOpened = true;
      
      console.log('👁️  Advanced Eyes session opened');
      
      // 1. Full page baseline
      await eyes.check('1. Initial Page State', Target.window().fully());
      console.log('📸 1. Full page baseline captured');
      
      // 2. Header-specific check with custom match level
      await eyes.check(
        '2. Header Section', 
        Target.region('.header').matchLevel(MatchLevel.Layout)
      );
      console.log('📸 2. Header section captured with layout matching');
      
      // 3. Main content area check
      await eyes.check('3. Main Content Area', Target.region('.main-content'));
      console.log('📸 3. Main content area captured');
      
      // 4. Feature cards check with ignore regions for dynamic content
      await eyes.check(
        '4. Feature Cards', 
        Target.region('.features')
          .ignoreRegions('.feature-card:nth-child(2)') // Ignore middle card if it has dynamic content
      );
      console.log('📸 4. Feature cards captured with ignore regions');
      
      // 5. Interactive element hover state
      await page.hover('.btn-primary');
      await page.waitForTimeout(300); // Wait for hover animation
      await eyes.check('5. Button Hover State', Target.region('.button-container'));
      console.log('📸 5. Button hover state captured');
      
      // 6. Theme toggle interaction
      await page.click('#themeToggle');
      await page.waitForTimeout(500); // Wait for theme transition
      await eyes.check('6. Dark Theme Applied', Target.window().fully());
      console.log('📸 6. Dark theme state captured');
      
      // 7. Modal interaction sequence
      await page.click('#showModal');
      await page.waitForSelector('.modal.show', { state: 'visible' });
      await page.waitForTimeout(300); // Wait for modal animation
      
      await eyes.check(
        '7. Modal Open in Dark Theme', 
        Target.window().fully()
          .ignoreRegions(new Region(0, 0, 50, 50)) // Ignore top-left corner if needed
      );
      console.log('📸 7. Modal in dark theme captured');
      
      // 8. Modal content focus
      await eyes.check('8. Modal Content Focus', Target.region('.modal-content'));
      console.log('📸 8. Modal content focus captured');
      
      // 9. Close modal and return to light theme
      await page.click('.close');
      await page.waitForSelector('.modal.show', { state: 'hidden' });
      await page.click('#themeToggle'); // Switch back to light theme
      await page.waitForTimeout(500);
      
      await eyes.check('9. Final State - Light Theme', Target.window().fully());
      console.log('📸 9. Final state captured');
      
      // 10. Scroll behavior test
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await eyes.check('10. Scrolled to Bottom', Target.window().fully());
      console.log('📸 10. Scrolled state captured');
      
      console.log('✅ Comprehensive UI workflow completed successfully');
      
    } catch (error) {
      console.error('❌ Comprehensive UI test failed:', error);
      throw error;
    }
  });

  test('should test responsive design at different viewports', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally test responsive design across viewports');
      
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      // Still test basic responsive functionality
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Test that the page responds to viewport changes
      await page.setViewportSize({ width: 320, height: 568 });
      await page.waitForTimeout(500);
      const mobileTitle = await page.title();
      expect(mobileTitle).toBe('Visual Testing Sample Page');
      
      console.log('✅ Responsive functionality tested (without visual validation)');
      return;
    }

    try {
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      const viewports = [
        { width: 320, height: 568, name: 'Mobile Portrait' },
        { width: 568, height: 320, name: 'Mobile Landscape' },
        { width: 768, height: 1024, name: 'Tablet Portrait' },
        { width: 1024, height: 768, name: 'Tablet Landscape' },
        { width: 1200, height: 800, name: 'Desktop' },
        { width: 1920, height: 1080, name: 'Large Desktop' }
      ];
      
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      await eyes.open(page, 'Visual Testing Demo App - Advanced', 'Responsive Design Test');
      eyesOpened = true;
      
      console.log('👁️  Responsive design test started');
      
      for (const viewport of viewports) {
        console.log(`📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(500); // Wait for layout adjustment
        
        // Take screenshot for this viewport
        await eyes.check(
          `Responsive - ${viewport.name}`,
          Target.window().fully()
        );
        
        console.log(`📸 ${viewport.name} viewport captured`);
      }
      
      console.log('✅ Responsive design test completed');
      
    } catch (error) {
      console.error('❌ Responsive design test failed:', error);
      throw error;
    }
  });

  test('should test accessibility visual indicators', async () => {
    // Skip visual validation if no API key is set
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual validation - APPLITOOLS_API_KEY not set');
      console.log('   This test would normally test accessibility visual indicators');
      
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      // Still test basic accessibility functionality
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      // Test that focus works on interactive elements
      await page.focus('#themeToggle');
      const focusedElement = await page.evaluate(() => document.activeElement?.id);
      expect(focusedElement).toBe('themeToggle');
      
      console.log('✅ Accessibility functionality tested (without visual validation)');
      return;
    }

    try {
      const htmlPath = path.resolve(__dirname, '../src/sample-page/index.html');
      const fileUrl = `file://${htmlPath}`;
      
      await page.goto(fileUrl);
      await page.waitForLoadState('networkidle');
      
      await eyes.open(page, 'Visual Testing Demo App - Advanced', 'Accessibility Visual Test');
      eyesOpened = true;
      
      console.log('👁️  Accessibility visual test started');
      
      // 1. Initial state
      await eyes.check('A11y - Initial State', Target.window().fully());
      
      // 2. Focus states - Tab through interactive elements
      const focusableElements = [
        '.nav-link:first-child',
        '#themeToggle',
        '#showModal',
        '.feature-card:first-child'
      ];
      
      for (let i = 0; i < focusableElements.length; i++) {
        await page.focus(focusableElements[i]);
        await page.waitForTimeout(200);
        await eyes.check(
          `A11y - Focus State ${i + 1}`,
          Target.region(focusableElements[i]).ignoreRegions() // Clean focus ring capture
        );
        console.log(`📸 Focus state ${i + 1} captured`);
      }
      
      // 3. High contrast simulation (if supported)
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
      await page.waitForTimeout(300);
      await eyes.check('A11y - Reduced Motion Dark Scheme', Target.window().fully());
      
      console.log('✅ Accessibility visual test completed');
      
    } catch (error) {
      console.error('❌ Accessibility visual test failed:', error);
      throw error;
    }
  });
});