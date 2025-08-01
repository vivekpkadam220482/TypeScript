/**
 * Runtime Configuration for Applitools API Key
 * 
 * This module provides methods to configure Applitools API key at runtime
 * without relying on environment variables or .env files.
 */

import { Eyes, Configuration } from '@applitools/eyes-playwright';

interface RuntimeConfig {
  apiKey: string;
  serverUrl?: string;
  appName?: string;
  batchName?: string;
  batchId?: string;
  branchName?: string;
  parentBranchName?: string;
  baselineEnvName?: string;
}

/**
 * Global runtime configuration storage
 */
let runtimeConfig: RuntimeConfig | null = null;

/**
 * Set the Applitools configuration at runtime
 * @param config Runtime configuration object
 */
export function setApplitoolsConfig(config: RuntimeConfig): void {
  if (!config.apiKey) {
    throw new Error('API key is required in runtime configuration');
  }
  
  runtimeConfig = {
    serverUrl: 'https://eyesapi.applitools.com',
    appName: 'Visual Testing Demo App',
    batchName: `Runtime Test - ${new Date().toISOString()}`,
    batchId: `batch-${Date.now()}`,
    branchName: 'runtime-branch',
    baselineEnvName: 'Production',
    ...config
  };
  
  console.log('✅ Applitools runtime configuration set successfully');
}

/**
 * Get the current runtime configuration
 * @returns Current runtime configuration or null if not set
 */
export function getApplitoolsConfig(): RuntimeConfig | null {
  return runtimeConfig;
}

/**
 * Create and configure an Eyes instance with runtime configuration
 * @param overrideConfig Optional configuration to override runtime config
 * @returns Configured Eyes instance
 */
export function createConfiguredEyes(overrideConfig?: Partial<RuntimeConfig>): Eyes {
  const config = getApplitoolsConfig();
  
  if (!config && !overrideConfig?.apiKey) {
    throw new Error(
      'No runtime configuration found. ' +
      'Please call setApplitoolsConfig() first or provide an API key in overrideConfig.'
    );
  }
  
  const finalConfig = { ...config, ...overrideConfig };
  
  const eyes = new Eyes();
  const configuration = new Configuration();
  
  // Set API key
  if (finalConfig.apiKey) {
    configuration.setApiKey(finalConfig.apiKey);
  }
  
  // Set server URL
  if (finalConfig.serverUrl) {
    configuration.setServerUrl(finalConfig.serverUrl);
  }
  
  // Set app name
  if (finalConfig.appName) {
    configuration.setAppName(finalConfig.appName);
  }
  
  // Set batch configuration
  if (finalConfig.batchName || finalConfig.batchId) {
    configuration.setBatch({
      name: finalConfig.batchName || 'Runtime Batch',
      id: finalConfig.batchId || `batch-${Date.now()}`
    });
  }
  
  // Set branch configuration
  if (finalConfig.branchName) {
    configuration.setBranchName(finalConfig.branchName);
  }
  
  if (finalConfig.parentBranchName) {
    configuration.setParentBranchName(finalConfig.parentBranchName);
  }
  
  // Set baseline environment
  if (finalConfig.baselineEnvName) {
    configuration.setBaselineEnvName(finalConfig.baselineEnvName);
  }
  
  eyes.setConfiguration(configuration);
  
  return eyes;
}

/**
 * Check if runtime configuration is available
 * @returns True if runtime config is set, false otherwise
 */
export function hasRuntimeConfig(): boolean {
  return runtimeConfig !== null && !!runtimeConfig.apiKey;
}

/**
 * Clear the runtime configuration
 */
export function clearRuntimeConfig(): void {
  runtimeConfig = null;
  console.log('🧹 Applitools runtime configuration cleared');
}

/**
 * Get API key from multiple sources (in order of priority):
 * 1. Runtime configuration
 * 2. Command line arguments
 * 3. Environment variables
 * @returns API key string or null if not found
 */
export function getApiKeyFromAnywhere(): string | null {
  // 1. Check runtime configuration
  if (runtimeConfig?.apiKey) {
    return runtimeConfig.apiKey;
  }
  
  // 2. Check command line arguments
  const cmdLineApiKey = process.argv.find(arg => arg.startsWith('--apiKey='))?.split('=')[1];
  if (cmdLineApiKey) {
    return cmdLineApiKey;
  }
  
  // 3. Check environment variables
  if (process.env.APPLITOOLS_API_KEY) {
    return process.env.APPLITOOLS_API_KEY;
  }
  
  return null;
}

/**
 * Validate that an API key is available from any source
 * @returns True if API key is available, false otherwise
 */
export function validateApiKeyAvailability(): boolean {
  return getApiKeyFromAnywhere() !== null;
}

/**
 * Get a comprehensive configuration object from all sources
 * @returns Complete configuration object
 */
export function getComprehensiveConfig(): RuntimeConfig | null {
  const apiKey = getApiKeyFromAnywhere();
  
  if (!apiKey) {
    return null;
  }
  
  return {
    apiKey,
    serverUrl: process.env.APPLITOOLS_SERVER_URL || runtimeConfig?.serverUrl || 'https://eyesapi.applitools.com',
    appName: runtimeConfig?.appName || 'Visual Testing Demo App',
    batchName: process.env.APPLITOOLS_BATCH_NAME || runtimeConfig?.batchName || `Test Run - ${new Date().toISOString()}`,
    batchId: process.env.APPLITOOLS_BATCH_ID || runtimeConfig?.batchId || `batch-${Date.now()}`,
    branchName: process.env.APPLITOOLS_BRANCH_NAME || runtimeConfig?.branchName || 'local-branch',
    parentBranchName: process.env.APPLITOOLS_PARENT_BRANCH_NAME || runtimeConfig?.parentBranchName,
    baselineEnvName: process.env.APPLITOOLS_BASELINE_ENV_NAME || runtimeConfig?.baselineEnvName || 'Production'
  };
}