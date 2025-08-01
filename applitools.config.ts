/**
 * Applitools Configuration File
 * 
 * This file contains the default configuration for Applitools Eyes.
 * You can override these settings using environment variables or
 * by modifying the configuration in your test files.
 */

interface BrowserInfo {
  width?: number;
  height?: number;
  name?: string;
  deviceName?: string;
}

interface BatchConfig {
  name: string | null;
  id: string | null;
}

interface VisualGridOptions {
  testConcurrency: number;
  isDisabled: boolean;
}

interface AccessibilitySettings {
  level: string;
  guidelinesVersion: string;
}

interface ApplitoolsConfig {
  apiKey: string | null;
  serverUrl: string;
  appName: string;
  batch: BatchConfig;
  branchName: string | null;
  parentBranchName: string | null;
  baselineEnvName: string;
  browsersInfo: BrowserInfo[];
  visualGridOptions: VisualGridOptions;
  matchLevel: string;
  ignoreCaret: boolean;
  ignoreDisplacements: boolean;
  forceFullPageScreenshot: boolean;
  waitBeforeScreenshots: number;
  stitchMode: string;
  showLogs: boolean;
  saveDebugScreenshots: boolean;
  dontCloseBatches: boolean;
  accessibilitySettings: AccessibilitySettings;
  validate(): boolean;
  getConfigForTest(testType?: string): ApplitoolsConfig;
}

const config: ApplitoolsConfig = {
  // Required: Applitools API Key
  // Multiple ways to set the API key (in order of priority):
  // 1. Command line argument: --apiKey=your_key
  // 2. Environment variable: APPLITOOLS_API_KEY
  // 3. GitHub Actions secret: secrets.APPLITOOLS_API_KEY
  // 4. Direct configuration (not recommended for production)
  apiKey: process.argv.find(arg => arg.startsWith('--apiKey='))?.split('=')[1] ||
          process.env.APPLITOOLS_API_KEY ||
          null,
  
  // Optional: Server URL (for private cloud instances)
  serverUrl: process.env.APPLITOOLS_SERVER_URL || 'https://eyesapi.applitools.com',
  
  // Default application name
  appName: 'Cursor Visual Testing Demo App',
  
  // Default batch configuration
  batch: {
    name: process.env.APPLITOOLS_BATCH_NAME || 'Cursor Visual Testing Demo Batch',
    id: process.env.APPLITOOLS_BATCH_ID || null,
  },
  
  // Branch configuration for CI/CD
  branchName: process.env.APPLITOOLS_BRANCH_NAME || null,
  parentBranchName: process.env.APPLITOOLS_PARENT_BRANCH_NAME || null,
  
  // Baseline environment name
  baselineEnvName: process.env.APPLITOOLS_BASELINE_ENV_NAME || 'Production',
  
  // Default browser configurations
  browsersInfo: [
    // Desktop browsers
    { width: 1200, height: 800, name: 'chrome' },
    { width: 1200, height: 800, name: 'firefox' },
    { width: 1200, height: 800, name: 'safari' },
    { width: 1200, height: 800, name: 'edge' },
    
    // Different viewport sizes
    { width: 1920, height: 1080, name: 'chrome' },
    { width: 1366, height: 768, name: 'chrome' },
    { width: 1024, height: 768, name: 'chrome' },
    
    // Mobile devices
    { deviceName: 'iPhone 11' },
    { deviceName: 'Galaxy S5' },
    { deviceName: 'iPad Pro' },
  ],
  
  // Visual Grid Runner configuration
  visualGridOptions: {
    testConcurrency: parseInt(process.env.APPLITOOLS_CONCURRENCY || '5'),
    isDisabled: process.env.APPLITOOLS_IS_DISABLED === 'true',
  },
  
  // Match configuration
  matchLevel: process.env.APPLITOOLS_MATCH_LEVEL || 'Strict',
  ignoreCaret: process.env.APPLITOOLS_IGNORE_CARET !== 'false',
  ignoreDisplacements: process.env.APPLITOOLS_IGNORE_DISPLACEMENTS === 'true',
  
  // Screenshot configuration
  forceFullPageScreenshot: true,
  waitBeforeScreenshots: 1000,
  stitchMode: 'CSS',
  
  // Debugging and logging
  showLogs: process.env.APPLITOOLS_SHOW_LOGS === 'true',
  saveDebugScreenshots: process.env.APPLITOOLS_SAVE_DEBUG_SCREENSHOTS === 'true',
  
  // Failure handling
  dontCloseBatches: process.env.APPLITOOLS_DONT_CLOSE_BATCHES === 'true',
  
  // Accessibility settings
  accessibilitySettings: {
    level: 'AA',
    guidelinesVersion: 'WCAG_2_1',
  },
  
  // Validation function to check if configuration is valid
  validate() {
    if (!this.apiKey) {
      throw new Error(
        '❌ APPLITOOLS_API_KEY is required. Please set it in your environment variables.\n' +
        '   You can get your API key from: https://applitools.com/docs/topics/overview/obtain-api-key.html'
      );
    }
    
    console.log('✅ Applitools configuration validated successfully');
    return true;
  },
  
  // Helper function to get configuration for specific test type
  getConfigForTest(testType = 'basic') {
    const baseConfig = { ...this };
    
    switch (testType) {
      case 'basic':
        return {
          ...baseConfig,
          browsersInfo: [
            { width: 1200, height: 800, name: 'chrome' },
            { width: 1200, height: 800, name: 'firefox' },
          ],
        };
        
      case 'advanced':
        return {
          ...baseConfig,
          browsersInfo: [
            { width: 1200, height: 800, name: 'chrome' },
            { width: 1200, height: 800, name: 'firefox' },
            { width: 1200, height: 800, name: 'safari' },
            { deviceName: 'iPhone 11' },
            { deviceName: 'iPad Pro' },
          ],
        };
        
      case 'grid':
        return baseConfig; // Use full configuration
        
      default:
        return baseConfig;
    }
  },
};

export default config;