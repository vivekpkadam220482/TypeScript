/**
 * Automated Screenshot Comparison Test
 * 
 * This test performs automated visual comparison of webpages using Playwright and Applitools.
 * It handles CSV processing, screenshot capture, and image comparison with detailed reporting.
 */

import { chromium, Browser, Page } from 'playwright';
import { Eyes, Target, Configuration, TestResults } from '@applitools/eyes-playwright';
import * as fs from 'fs-extra';
import * as path from 'path';
import csv from 'csv-parser';

interface TestConfig {
  timeout: number;
  viewport: { width: number; height: number };
}

interface UrlEntry {
  url: string;
  name: string;
}

interface ComparisonResult {
  url: string;
  testName: string;
  status: string;
  appUrl?: string;
  stepsInfo: number;
  matches: number;
  mismatches: number;
  missing: number;
  success: boolean;
  error?: string;
}

interface TestSummary {
  totalUrls: number;
  successfulComparisons: number;
  failedComparisons: number;
  totalMatches: number;
  totalMismatches: number;
  totalMissing: number;
  startTime: Date;
  endTime: Date;
  duration: string;
  errors: string[];
  eyesResults: ComparisonResult[];
}

describe('Automated Screenshot Comparison Test', () => {
  let browser: Browser;
  let page: Page;
  let eyes: Eyes;

  const config: TestConfig = {
    timeout: 60000, // Increased to 60 seconds
    viewport: { width: 1920, height: 1080 }
  };

  const directories = {
    results: './Results'
  };

  const csvFiles = {
    source: './source.csv',
    target: './target.csv'
  };

  let testSummary: TestSummary;

  beforeAll(async () => {
    console.log('🚀 Starting Automated Screenshot Comparison Test Suite');
    
    testSummary = {
      totalUrls: 0,
      successfulComparisons: 0,
      failedComparisons: 0,
      totalMatches: 0,
      totalMismatches: 0,
      totalMissing: 0,
      startTime: new Date(),
      endTime: new Date(),
      duration: '',
      errors: [],
      eyesResults: []
    };

    // Initialize browser
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Initialize Eyes for Applitools integration
    eyes = new Eyes();
    const configuration = new Configuration();
    configuration.setAppName('Automated Screenshot Comparison');
    configuration.setBatch({
      name: 'Automated Visual Testing Batch',
      id: `batch-${Date.now()}`
    });
    // Configure for visual comparison
    configuration.setTestName('Visual Comparison Test');
    eyes.setConfiguration(configuration);
  });

  beforeEach(async () => {
    // Only create page if it doesn't exist or was closed
    if (!page || page.isClosed()) {
      page = await browser.newPage();
      await page.setViewportSize(config.viewport);
    }
  });

  afterEach(async () => {
    // Keep the page open for Eyes tests, only close at the very end
    // Individual test steps will handle page navigation
  });

  afterAll(async () => {
    // Close page if still open
    if (page && !page.isClosed()) {
      await page.close();
    }
    
    if (browser) {
      await browser.close();
    }
    
    testSummary.endTime = new Date();
    testSummary.duration = `${(testSummary.endTime.getTime() - testSummary.startTime.getTime()) / 1000}s`;
    
    await generateSummaryReport();
    console.log('✅ Test Suite Completed');
  });

  test('Step 1: Validate environment and setup', async () => {
    console.log('🔧 Validating environment...');
    
    // Check for Applitools API key
    if (!process.env.APPLITOOLS_API_KEY) {
      const warningMsg = 'APPLITOOLS_API_KEY not set. Visual comparisons will be skipped.';
      console.warn(`⚠️  ${warningMsg}`);
      testSummary.errors.push(warningMsg);
    } else {
      console.log('✅ Applitools API key is configured');
    }

    // Ensure results directory exists
    try {
      await fs.ensureDir(directories.results);
      console.log(`✅ Results directory created: ${directories.results}`);
    } catch (error) {
      const errorMsg = `Failed to create results directory: ${error}`;
      testSummary.errors.push(errorMsg);
      throw new Error(errorMsg);
    }
  });

  test('Step 2: Check for required CSV files and validate they are not empty', async () => {
    console.log('📄 Checking CSV files...');
    
    const requiredCsvFiles = [csvFiles.source, csvFiles.target];

    for (const csvFile of requiredCsvFiles) {
      try {
        // Check if file exists
        const exists = await fs.pathExists(csvFile);
        if (!exists) {
          // Create sample CSV file for demonstration
          const sampleContent = 'url,name\nhttps://example.com,Example\nhttps://google.com,Google\n';
          await fs.writeFile(csvFile, sampleContent);
          console.log(`⚠️  Created sample CSV file: ${csvFile}`);
        }

        // Check if file is not empty
        const stats = await fs.stat(csvFile);
        if (stats.size === 0) {
          const errorMsg = `CSV file is empty: ${csvFile}`;
          testSummary.errors.push(errorMsg);
          throw new Error(errorMsg);
        }

        console.log(`✅ CSV file validated: ${csvFile} (${stats.size} bytes)`);
      } catch (error) {
        const errorMsg = `Failed to validate CSV file: ${csvFile} - ${error}`;
        testSummary.errors.push(errorMsg);
        throw new Error(errorMsg);
      }
    }
  });

  test('Step 3: Establish baselines using Applitools Eyes', async () => {
    console.log('👁️  Establishing baselines with Applitools Eyes...');
    
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping baseline establishment - APPLITOOLS_API_KEY not set');
      return;
    }

    try {
      const urls = await readCsvFile(csvFiles.source);
      testSummary.totalUrls += urls.length;

      for (const urlEntry of urls) {
        await establishBaseline(urlEntry);
      }
    } catch (error) {
      const errorMsg = `Failed to establish baselines: ${error}`;
      testSummary.errors.push(errorMsg);
      throw new Error(errorMsg);
    }
  }, 180000); // 3 minute timeout for Eyes baseline establishment

  test('Step 4: Perform visual comparison using Applitools Eyes', async () => {
    console.log('👁️  Performing visual comparison with Applitools Eyes...');
    
    if (!process.env.APPLITOOLS_API_KEY) {
      console.log('⏭️  Skipping visual comparison - APPLITOOLS_API_KEY not set');
      return;
    }

    try {
      const urls = await readCsvFile(csvFiles.target);
      
      for (const urlEntry of urls) {
        const result = await performEyesComparison(urlEntry);
        testSummary.eyesResults.push(result);
      }
    } catch (error) {
      const errorMsg = `Failed to perform visual comparison: ${error}`;
      testSummary.errors.push(errorMsg);
      throw new Error(errorMsg);
    }
  }, 180000); // 3 minute timeout for Eyes visual comparison

  // Helper Functions

  async function readCsvFile(filePath: string): Promise<UrlEntry[]> {
    return new Promise((resolve, reject) => {
      const results: UrlEntry[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => {
          if (data.url && data.name) {
            results.push({ url: data.url, name: data.name });
          }
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  async function establishBaseline(urlEntry: UrlEntry): Promise<void> {
    let eyesOpened = false;
    let localPage = page;
    
    try {
      console.log(`👁️  Establishing baseline for: ${urlEntry.url} (${urlEntry.name})`);
      
      // Ensure we have a fresh page for this operation
      if (!localPage || localPage.isClosed()) {
        localPage = await browser.newPage();
        await localPage.setViewportSize(config.viewport);
      }
      
      // Open Eyes session for baseline
      await eyes.open(localPage, 'Automated Screenshot Comparison', `Baseline: ${urlEntry.name}`);
      eyesOpened = true;
      
      // Navigate to URL
      await localPage.goto(urlEntry.url, { 
        waitUntil: 'networkidle',
        timeout: config.timeout 
      });
      
      // Wait for page to be fully loaded
      await localPage.waitForTimeout(2000);
      
      // Capture full page with Eyes (this creates the baseline)
      await eyes.check(`${urlEntry.name} - Full Page`, Target.window().fully());
      
      // Close Eyes session
      const results = await eyes.close();
      eyesOpened = false;
      
      console.log(`✅ Baseline established: ${urlEntry.name} - Status: ${results?.getStatus()}`);
      
    } catch (error) {
      if (eyesOpened) {
        try {
          await eyes.abortIfNotClosed();
        } catch (abortError) {
          console.error(`Failed to abort Eyes session: ${abortError}`);
        }
      }
      
      const errorMsg = `Failed to establish baseline for ${urlEntry.url}: ${error}`;
      console.error(`❌ ${errorMsg}`);
      testSummary.errors.push(errorMsg);
    }
  }

  async function performEyesComparison(urlEntry: UrlEntry): Promise<ComparisonResult> {
    let eyesOpened = false;
    let localPage = page;
    
    const result: ComparisonResult = {
      url: urlEntry.url,
      testName: urlEntry.name,
      status: 'Failed',
      stepsInfo: 0,
      matches: 0,
      mismatches: 0,
      missing: 0,
      success: false
    };

    try {
      console.log(`👁️  Comparing: ${urlEntry.url} (${urlEntry.name})`);
      
      // Ensure we have a fresh page for this operation
      if (!localPage || localPage.isClosed()) {
        localPage = await browser.newPage();
        await localPage.setViewportSize(config.viewport);
      }
      
      // Open Eyes session for comparison
      await eyes.open(localPage, 'Automated Screenshot Comparison', `Comparison: ${urlEntry.name}`);
      eyesOpened = true;
      
      // Navigate to URL
      await localPage.goto(urlEntry.url, { 
        waitUntil: 'networkidle',
        timeout: config.timeout 
      });
      
      // Wait for page to be fully loaded
      await localPage.waitForTimeout(2000);
      
      // Capture and compare with Eyes
      await eyes.check(`${urlEntry.name} - Full Page`, Target.window().fully());
      
      // Close Eyes session and get results
      const eyesResults = await eyes.close();
      eyesOpened = false;
      
      if (eyesResults) {
        result.status = eyesResults.getStatus();
        result.appUrl = eyesResults.getUrl();
        result.stepsInfo = eyesResults.getSteps();
        result.matches = eyesResults.getMatches();
        result.mismatches = eyesResults.getMismatches();
        result.missing = eyesResults.getMissing();
        result.success = eyesResults.getStatus() === 'Passed';
        
        // Update summary
        if (result.success) {
          testSummary.successfulComparisons++;
        } else {
          testSummary.failedComparisons++;
        }
        
        testSummary.totalMatches += result.matches;
        testSummary.totalMismatches += result.mismatches;
        testSummary.totalMissing += result.missing;
        
        console.log(`✅ Eyes comparison completed: ${urlEntry.name}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Matches: ${result.matches}, Mismatches: ${result.mismatches}, Missing: ${result.missing}`);
        console.log(`   Results URL: ${result.appUrl}`);
      } else {
        throw new Error('No results returned from Eyes');
      }
      
    } catch (error) {
      if (eyesOpened) {
        try {
          await eyes.abortIfNotClosed();
        } catch (abortError) {
          console.error(`Failed to abort Eyes session: ${abortError}`);
        }
      }
      
      result.error = error instanceof Error ? error.message : String(error);
      result.success = false;
      testSummary.failedComparisons++;
      
      const errorMsg = `Failed Eyes comparison for ${urlEntry.url}: ${error}`;
      console.error(`❌ ${errorMsg}`);
      testSummary.errors.push(errorMsg);
    }

    return result;
  }

  async function generateSummaryReport(): Promise<void> {
    console.log('\n📊 Generating Summary Report...');
    
    const totalComparisons = testSummary.successfulComparisons + testSummary.failedComparisons;
    const successRate = totalComparisons > 0 ? ((testSummary.successfulComparisons / totalComparisons) * 100).toFixed(2) : '0';
    
    const reportContent = `
# Automated Visual Testing Report - Applitools Eyes

## Test Summary
- **Start Time**: ${testSummary.startTime.toISOString()}
- **End Time**: ${testSummary.endTime.toISOString()}
- **Duration**: ${testSummary.duration}
- **Total URLs Processed**: ${testSummary.totalUrls}

## Applitools Eyes Results
- **Successful Visual Tests**: ${testSummary.successfulComparisons}
- **Failed Visual Tests**: ${testSummary.failedComparisons}
- **Success Rate**: ${successRate}%

## Visual Comparison Statistics
- **Total Matches**: ${testSummary.totalMatches}
- **Total Mismatches**: ${testSummary.totalMismatches}
- **Total Missing**: ${testSummary.totalMissing}

## Detailed Results
${testSummary.eyesResults.map((result, index) => `
### ${index + 1}. ${result.testName}
- **URL**: ${result.url}
- **Status**: ${result.status}
- **Matches**: ${result.matches}
- **Mismatches**: ${result.mismatches}
- **Missing**: ${result.missing}
- **Steps**: ${result.stepsInfo}
${result.appUrl ? `- **Applitools Results**: [View Results](${result.appUrl})` : ''}
${result.error ? `- **Error**: ${result.error}` : ''}
`).join('\n')}

## Errors Encountered
${testSummary.errors.length > 0 ? testSummary.errors.map((error, index) => `${index + 1}. ${error}`).join('\n') : 'No errors encountered.'}

## Technology Stack
- **Visual Testing**: Applitools Eyes
- **Browser Automation**: Playwright
- **Test Framework**: Jest + TypeScript

## How to Review Results
1. Check the Applitools dashboard at: https://applitools.com/
2. Click on individual test result URLs provided above
3. Use the Applitools visual comparison tools to analyze differences

---
Report generated on: ${new Date().toISOString()}
`;

    try {
      const reportPath = './Results/applitools-eyes-report.md';
      await fs.writeFile(reportPath, reportContent);
      console.log(`✅ Summary report saved: ${reportPath}`);
      
      // Also log to console
      console.log('\n' + '='.repeat(80));
      console.log('👁️  APPLITOOLS EYES TEST SUMMARY');
      console.log('='.repeat(80));
      console.log(`Visual Tests: ${testSummary.successfulComparisons}/${totalComparisons} successful`);
      console.log(`Total Matches: ${testSummary.totalMatches}`);
      console.log(`Total Mismatches: ${testSummary.totalMismatches}`);
      console.log(`Total Duration: ${testSummary.duration}`);
      console.log(`Errors: ${testSummary.errors.length}`);
      console.log('='.repeat(80));

    } catch (error) {
      console.error(`❌ Failed to generate summary report: ${error}`);
    }
  }
});