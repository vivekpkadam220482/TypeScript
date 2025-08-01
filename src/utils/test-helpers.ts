/**
 * Test Helper Utilities for Visual Testing
 * 
 * This file contains reusable utilities and helper functions
 * for visual testing with Playwright and Applitools Eyes.
 */

import { Page } from 'playwright';
import { Eyes, Target, Configuration, BrowserType, DeviceName } from '@applitools/eyes-playwright';
import path from 'path';

/**
 * Interface for test configuration options
 */
export interface TestConfig {
  appName?: string;
  testName?: string;
  batchName?: string;
  baselineEnvName?: string;
  browsersToAdd?: Array<{
    width: number;
    height: number;
    browserType: BrowserType;
  }>;
  devicesToAdd?: DeviceName[];
  ignoreRegions?: string[];
  customMatchLevel?: string;
}

/**
 * Helper class for managing visual tests
 */
export class VisualTestHelper {
  private eyes: Eyes;
  private page: Page;
  
  constructor(eyes: Eyes, page: Page) {
    this.eyes = eyes;
    this.page = page;
  }
  
  /**
   * Configure Eyes with standard settings
   */
  static configureEyes(eyes: Eyes, config: TestConfig = {}): void {
    const configuration = new Configuration();
    
    // Basic configuration
    configuration.setAppName(config.appName || 'Visual Testing Demo App');
    configuration.setTestName(config.testName || 'Visual Test');
    
    // Batch configuration
    configuration.setBatch({
      name: config.batchName || process.env.APPLITOOLS_BATCH_NAME || 'Visual Testing Batch',
      id: process.env.APPLITOOLS_BATCH_ID || `batch-${Date.now()}`
    });
    
    // Baseline environment
    if (config.baselineEnvName) {
      configuration.setBaselineEnvName(config.baselineEnvName);
    }
    
    // Add browsers
    if (config.browsersToAdd) {
      config.browsersToAdd.forEach(browser => {
        configuration.addBrowser(browser.width, browser.height, browser.browserType);
      });
    } else {
      // Default browsers
      configuration.addBrowser(1200, 800, BrowserType.CHROME);
      configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    }
    
    // Add devices
    if (config.devicesToAdd) {
      config.devicesToAdd.forEach(device => {
        configuration.addDeviceEmulation(device);
      });
    } else {
      // Default mobile devices
      configuration.addDeviceEmulation(DeviceName.iPhone_11);
      configuration.addDeviceEmulation(DeviceName.Galaxy_S5);
    }
    
    eyes.setConfiguration(configuration);
  }
  
  /**
   * Load the sample HTML page
   */
  async loadSamplePage(): Promise<void> {
    const htmlPath = path.resolve(__dirname, '../sample-page/index.html');
    const fileUrl = `file://${htmlPath}`;
    
    await this.page.goto(fileUrl);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Extra wait for animations
  }
  
  /**
   * Take a full page screenshot with optional name
   */
  async captureFullPage(checkName: string = 'Full Page'): Promise<void> {
    await this.eyes.check(checkName, Target.window().fully());
  }
  
  /**
   * Take a screenshot of a specific region
   */
  async captureRegion(selector: string, checkName?: string): Promise<void> {
    const name = checkName || `Region: ${selector}`;
    await this.eyes.check(name, Target.region(selector));
  }
  
  /**
   * Toggle dark theme and capture the result
   */
  async toggleDarkThemeAndCapture(captureName: string = 'Dark Theme'): Promise<void> {
    await this.page.click('#themeToggle');
    await this.page.waitForTimeout(500); // Wait for theme transition
    await this.captureFullPage(captureName);
  }
  
  /**
   * Open modal and capture the result
   */
  async openModalAndCapture(captureName: string = 'Modal Open'): Promise<void> {
    await this.page.click('#showModal');
    await this.page.waitForSelector('.modal.show', { state: 'visible' });
    await this.page.waitForTimeout(300); // Wait for modal animation
    await this.captureFullPage(captureName);
  }
  
  /**
   * Close modal and capture the result
   */
  async closeModalAndCapture(captureName: string = 'Modal Closed'): Promise<void> {
    await this.page.click('.close');
    await this.page.waitForSelector('.modal.show', { state: 'hidden' });
    await this.page.waitForTimeout(300);
    await this.captureFullPage(captureName);
  }
  
  /**
   * Test hover state on an element
   */
  async testHoverState(selector: string, captureName?: string): Promise<void> {
    await this.page.hover(selector);
    await this.page.waitForTimeout(200);
    const name = captureName || `Hover: ${selector}`;
    await this.captureRegion(selector, name);
  }
  
  /**
   * Test focus state on an element
   */
  async testFocusState(selector: string, captureName?: string): Promise<void> {
    await this.page.focus(selector);
    await this.page.waitForTimeout(200);
    const name = captureName || `Focus: ${selector}`;
    await this.captureRegion(selector, name);
  }
  
  /**
   * Run a complete UI interaction workflow
   */
  async runCompleteWorkflow(): Promise<void> {
    console.log('🔄 Starting complete UI workflow...');
    
    // 1. Initial state
    await this.captureFullPage('1. Initial State');
    
    // 2. Dark theme
    await this.toggleDarkThemeAndCapture('2. Dark Theme Applied');
    
    // 3. Modal in dark theme
    await this.openModalAndCapture('3. Modal in Dark Theme');
    
    // 4. Close modal
    await this.closeModalAndCapture('4. Modal Closed');
    
    // 5. Return to light theme
    await this.toggleDarkThemeAndCapture('5. Light Theme Restored');
    
    console.log('✅ Complete UI workflow finished');
  }
  
  /**
   * Test responsive design at different viewports
   */
  async testResponsiveDesign(): Promise<void> {
    const viewports = [
      { width: 320, height: 568, name: 'Mobile Portrait' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 1200, height: 800, name: 'Desktop' },
      { width: 1920, height: 1080, name: 'Large Desktop' }
    ];
    
    console.log('📱 Testing responsive design...');
    
    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(500);
      await this.captureFullPage(`Responsive: ${viewport.name}`);
      console.log(`✅ ${viewport.name} captured`);
    }
  }
}

/**
 * Environment validation utilities
 */
export class EnvironmentValidator {
  /**
   * Validate that all required environment variables are set
   */
  static validate(): boolean {
    const required = ['APPLITOOLS_API_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn('⚠️  Missing optional environment variables:');
      missing.forEach(key => {
        console.warn(`   - ${key}`);
      });
      console.warn('\nVisual tests will be skipped without these variables.');
      console.warn('You can get your API key from: https://applitools.com/docs/topics/overview/obtain-api-key.html');
      return false;
    }
    
    console.log('✅ Environment validation passed');
    return true;
  }
  
  /**
   * Print current environment configuration
   */
  static printConfig(): void {
    console.log('\n🔧 Current Environment Configuration:');
    console.log('=====================================');
    console.log(`APPLITOOLS_API_KEY: ${process.env.APPLITOOLS_API_KEY ? '***SET***' : 'NOT SET'}`);
    console.log(`APPLITOOLS_BATCH_NAME: ${process.env.APPLITOOLS_BATCH_NAME || 'Not set'}`);
    console.log(`APPLITOOLS_BATCH_ID: ${process.env.APPLITOOLS_BATCH_ID || 'Auto-generated'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
    console.log(`DEBUG: ${process.env.DEBUG || 'false'}`);
    console.log('=====================================\n');
  }
}

/**
 * Test result utilities
 */
export class TestResultHelper {
  /**
   * Format and display test results
   */
  static displayResults(results: any): void {
    if (!results) {
      console.log('⚠️  No test results available');
      return;
    }
    
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Name: ${results.getName()}`);
    console.log(`Status: ${results.getStatus()}`);
    console.log(`Steps: ${results.getSteps()}`);
    console.log(`Matches: ${results.getMatches()}`);
    console.log(`Mismatches: ${results.getMismatches()}`);
    console.log(`Missing: ${results.getMissing()}`);
    console.log(`URL: ${results.getUrl()}`);
    console.log('================\n');
  }
  
  /**
   * Check if test passed
   */
  static isPassed(results: any): boolean {
    return results && results.getStatus() === 'Passed';
  }
  
  /**
   * Check if test failed
   */
  static isFailed(results: any): boolean {
    return results && results.getStatus() === 'Failed';
  }
}

/**
 * Common selectors used in tests
 */
export const Selectors = {
  // Navigation
  header: '.header',
  nav: '.nav',
  navLink: '.nav-link',
  
  // Main content
  mainContent: '.main-content',
  card: '.card',
  container: '.container',
  
  // Buttons
  themeToggle: '#themeToggle',
  showModal: '#showModal',
  buttonContainer: '.button-container',
  
  // Modal
  modal: '#modal',
  modalContent: '.modal-content',
  modalClose: '.close',
  
  // Features
  features: '.features',
  featureCard: '.feature-card',
  
  // Footer
  footer: '.footer',
} as const;

/**
 * Common test patterns
 */
export const TestPatterns = {
  /**
   * Standard page load test
   */
  pageLoad: async (helper: VisualTestHelper): Promise<void> => {
    await helper.loadSamplePage();
    await helper.captureFullPage('Page Load');
  },
  
  /**
   * Theme toggle test
   */
  themeToggle: async (helper: VisualTestHelper): Promise<void> => {
    await helper.loadSamplePage();
    await helper.captureFullPage('Before Theme Toggle');
    await helper.toggleDarkThemeAndCapture('After Theme Toggle');
  },
  
  /**
   * Modal interaction test
   */
  modalInteraction: async (helper: VisualTestHelper): Promise<void> => {
    await helper.loadSamplePage();
    await helper.captureFullPage('Before Modal');
    await helper.openModalAndCapture('Modal Open');
    await helper.closeModalAndCapture('Modal Closed');
  },
} as const;