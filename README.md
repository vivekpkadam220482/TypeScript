# Playwright + Applitools Visual Testing Framework

A complete **TypeScript-only** boilerplate for visual testing using Playwright and Applitools Eyes SDK. This framework provides comprehensive visual regression testing capabilities from basic screenshots to enterprise-level cross-browser testing.

## Table of Contents

- [🎯 Project Purpose](#-project-purpose)
- [✨ Features](#-features) 
- [🛠️ Framework and Technical Details](#-framework-and-technical-details)
- [👁️ Applitools Configuration](#-applitools-configuration)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#-configuration)
- [📝 Setup Scripts Details](#-setup-scripts-details)
- [🧪 Testing Capabilities](#-testing-capabilities)
- [▶️ Running Tests](#-running-tests)
- [📄 Script Files Summary](#-script-files-summary)
- [🔍 Test Types](#-test-types)
- [🔄 CI/CD Integration](#-cicd-integration)
- [✅ Best Practices](#-best-practices)
- [🛠️ Troubleshooting](#-troubleshooting)

## 🎯 Project Purpose

This project serves as a comprehensive boilerplate and learning resource for implementing visual testing solutions using industry-standard tools. It demonstrates various visual testing approaches from basic fundamentals to enterprise-level testing patterns, providing developers with practical examples and best practices for visual regression testing.

### Key Objectives:
- **Educational Resource**: Learn visual testing fundamentals through practical examples
- **Production-Ready Template**: Use as a starting point for real-world visual testing projects
- **Best Practices Demonstration**: Showcase industry-standard patterns and configurations
- **Scalable Architecture**: Support both simple tests and complex enterprise testing scenarios

## ✨ Features

### Core Capabilities
- ✅ **100% TypeScript** implementation with full type safety
- ✅ **Multiple Testing Patterns** from basic to enterprise-level
- ✅ **Cross-Browser Testing** via Applitools Visual Grid
- ✅ **Automated Screenshot Comparison** with CSV data processing
- ✅ **Runtime Configuration** examples and patterns
- ✅ **Comprehensive Error Handling** and reporting
- ✅ **Batch Processing** for efficient test execution
- ✅ **Custom Match Levels** and ignore regions
- ✅ **Element-Specific Testing** capabilities

### Test Suite Features
- **1,800+ lines of TypeScript test code** across 7 comprehensive test files
- **Progressive Learning Path** from basic to advanced concepts
- **Real-World Examples** with practical implementations
- **Detailed Documentation** for each test pattern
- **Sample HTML Pages** for testing scenarios

## 🛠️ Framework and Technical Details

### Technology Stack
- **Testing Framework**: Jest with TypeScript support
- **Browser Automation**: Playwright
- **Visual Testing**: Applitools Eyes SDK
- **Language**: TypeScript (100% type-safe)
- **Build System**: TypeScript Compiler (tsc)
- **Module System**: ES Modules with modern import/export

### Architecture Highlights
- **TypeScript-First**: No JavaScript dependencies, full type definitions
- **Modular Design**: Separated test patterns for easy learning and maintenance
- **Configuration-Driven**: Flexible setup through environment variables and config files
- **Script Automation**: TypeScript-based setup and utility scripts
- **Modern Tooling**: Latest versions of Playwright, Jest, and Applitools SDK

### Build System
- **Compilation**: Direct TypeScript compilation via `tsc`
- **Test Execution**: TypeScript tests via `ts-jest`
- **Script Running**: TypeScript scripts via `tsx`
- **Module Resolution**: Path mapping for clean imports

## 👁️ Applitools Configuration

### Visual Grid Setup
The framework includes comprehensive Applitools configuration supporting:

- **Multiple Browser Configurations**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Desktop and mobile viewport testing
- **Match Levels**: Strict, Content, Layout, and Exact matching
- **Accessibility Testing**: Built-in accessibility validation
- **Batch Management**: Organized test execution with batch processing

### Configuration Files
- `applitools.config.ts`: Main Applitools configuration
- Environment variables for flexible setup
- Runtime configuration examples for dynamic settings

### Features Utilized
- **Visual Grid Runner**: Parallel cross-browser testing
- **Batch Processing**: Efficient test organization
- **Custom Regions**: Ignore and match regions configuration
- **Test Results Management**: Comprehensive reporting and analysis

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 16 or higher
- **Package Manager**: npm or yarn
- **Operating System**: Windows, macOS, or Linux

### Required Accounts
- **Applitools Account**: Free tier available for getting started
- **Applitools API Key**: Required for test execution

### Development Tools (Recommended)
- **IDE**: VS Code with TypeScript support
- **Git**: For version control
- **Browser**: Chrome, Firefox, or other modern browsers for local testing

## 🚀 Quick Start

### 1. Installation and Setup

```bash
# Clone or download the project
git clone [repository-url]
cd playwright-applitools-framework

# Install dependencies
npm install

# Install Playwright browsers
npm run install:playwright

# Build TypeScript
npm run build

# Run setup script
npm run setup:script
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Required: Applitools API Key
APPLITOOLS_API_KEY=your_api_key_here

# Optional: Batch configuration
APPLITOOLS_BATCH_NAME=Your_Project_Name
APPLITOOLS_BATCH_ID=unique_batch_id

# Optional: Server configuration
APPLITOOLS_SERVER_URL=https://eyesapi.applitools.com

# Development settings
DEBUG=false
NODE_ENV=test
```

### 3. Run Your First Test

```bash
# Start with the example test
npm run test:example
```

### 4. Progressive Learning Path

1. **Beginner**: `npm run test:example` - Learn the basics
2. **Intermediate**: `npm run test:basic` - Understand fundamentals  
3. **Advanced**: `npm run test:advanced` - Learn advanced patterns
4. **Enterprise**: `npm run test:grid` - Cross-browser testing
5. **Automation**: `npm run test:automated` - Bulk processing

## 📁 Project Structure

```
├── tests/                          # Test files directory
│   ├── example.test.ts             # Simple starter template (4.9KB, 159 lines)
│   ├── basic-visual.test.ts        # Basic visual testing (11KB, 302 lines)
│   ├── advanced-visual.test.ts     # Advanced techniques (14KB, 369 lines)
│   ├── visual-grid.test.ts         # Visual Grid testing (15KB, 386 lines)
│   ├── automated-screenshot-comparison.test.ts # Bulk testing (15KB, 474 lines)
│   ├── runtime-config-example.test.ts # Runtime config (7.4KB, 213 lines)
│   └── setup.ts                    # Jest setup configuration (1.2KB, 34 lines)
├── src/                            # Source code directory
│   ├── utils/                      # Utility functions
│   └── sample-page/                # Test HTML pages
│       ├── index.html             # Sample HTML for testing
│       ├── styles.css             # Sample CSS styles
│       └── script.ts              # Sample TypeScript code
├── scripts/                        # Build and utility scripts
│   ├── run-with-api-key.ts        # API key runner script
│   └── setup.ts                   # Project setup script
├── jest.config.ts                  # Jest testing configuration
├── applitools.config.ts            # Applitools Eyes configuration
├── tsconfig.json                   # TypeScript compiler configuration
├── package.json                    # Dependencies and npm scripts
└── .env                           # Environment variables (create this)
```

## ⚙️ Configuration

### Jest Configuration (`jest.config.ts`)
- **TypeScript Support**: Configured with ts-jest preset
- **Timeout Settings**: 60-second timeout for visual tests
- **Module Mapping**: Custom path mapping for clean imports
- **Coverage**: Collection settings for test coverage reporting

### Applitools Configuration (`applitools.config.ts`)
- **Browser Matrix**: Multiple browser and device configurations
- **Visual Grid**: Cloud-based parallel testing setup
- **Match Levels**: Configurable comparison sensitivity
- **Accessibility**: Built-in accessibility testing options

### TypeScript Configuration (`tsconfig.json`)
- **Target**: ES2022 for modern JavaScript features
- **Modules**: ESNext for latest import/export syntax
- **Strict Mode**: Full TypeScript strict checking enabled
- **Path Mapping**: Clean import paths configuration

### Environment Variables
- `APPLITOOLS_API_KEY`: Your Applitools API key (required)
- `APPLITOOLS_BATCH_NAME`: Custom batch name for test organization
- `APPLITOOLS_BATCH_ID`: Unique identifier for test batches
- `APPLITOOLS_SERVER_URL`: Custom server URL if needed
- `DEBUG`: Enable debug logging
- `NODE_ENV`: Environment setting

## 📝 Setup Scripts Details

### Main Setup Command
```bash
npm run setup:script
```

### What the Setup Does
1. **Dependency Installation**: Installs all required npm packages
2. **Playwright Browsers**: Downloads necessary browser binaries
3. **TypeScript Compilation**: Builds the project
4. **Configuration Validation**: Checks configuration files
5. **Environment Setup**: Validates environment variables

### Individual Setup Steps
```bash
# Install dependencies only
npm install

# Install Playwright browsers only
npm run install:playwright

# Build TypeScript only
npm run build

# Validate configuration
npm run validate:config
```

### Script Files
- `scripts/setup.ts`: Main setup orchestration
- `scripts/run-with-api-key.ts`: API key handling utilities
- Custom npm scripts in `package.json` for different scenarios

## 🧪 Testing Capabilities

### Visual Testing Types
1. **Basic Visual Testing**: Fundamental screenshot comparison
2. **Advanced Visual Testing**: Custom configurations and regions
3. **Cross-Browser Testing**: Multiple browser/device combinations
4. **Bulk Testing**: CSV-driven automated testing
5. **Runtime Configuration**: Dynamic test setup

### Test Features
- **Element-Specific Testing**: Target specific page elements
- **Ignore Regions**: Exclude dynamic content from comparison
- **Match Levels**: Different comparison sensitivity options
- **Batch Processing**: Organized test execution
- **Error Aggregation**: Comprehensive error reporting
- **Performance Metrics**: Test execution timing

### Supported Browsers
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Viewport Testing**: Various screen resolutions
- **Device Emulation**: Mobile and tablet testing

## ▶️ Running Tests

### Basic Test Commands
```bash
# Run all tests
npm test

# Run with verbose output
npm run test:debug

# Build before testing
npm run build
```

### Individual Test Execution
```bash
# Example test (recommended for beginners)
npm run test:example

# Basic visual testing
npm run test:basic

# Advanced visual testing
npm run test:advanced

# Visual Grid testing (cross-browser)
npm run test:grid

# Automated screenshot comparison
npm run test:automated

# Runtime configuration examples
npm run test:runtime
```

### Tests with API Key Parameter
```bash
# Run tests with API key parameter (alternative to .env)
npm run test:basic-with-key --apikey=YOUR_API_KEY
npm run test:advanced-with-key --apikey=YOUR_API_KEY
npm run test:grid-with-key --apikey=YOUR_API_KEY
npm run test:all-with-key --apikey=YOUR_API_KEY
```

### Debug and Development Commands
```bash
# Run tests in debug mode
npm run test:debug

# Run specific test file
npx jest tests/example.test.ts

# Run tests with coverage
npm run test:coverage
```

## 📄 Script Files Summary

### Test Files Overview

| Test File | Size | Lines | Purpose | Complexity |
|-----------|------|-------|---------|------------|
| `example.test.ts` | 4.9KB | 159 | Simple starter template | Beginner |
| `basic-visual.test.ts` | 11KB | 302 | Basic visual testing fundamentals | Intermediate |
| `advanced-visual.test.ts` | 14KB | 369 | Advanced visual testing techniques | Advanced |
| `visual-grid.test.ts` | 15KB | 386 | Visual Grid cross-browser testing | Enterprise |
| `automated-screenshot-comparison.test.ts` | 15KB | 474 | CSV-driven bulk testing | Advanced |
| `runtime-config-example.test.ts` | 7.4KB | 213 | Runtime configuration examples | Intermediate |

**Total: ~1,800+ lines of TypeScript test code**

### Utility Scripts
- `scripts/setup.ts`: Project initialization and setup
- `scripts/run-with-api-key.ts`: API key management utilities
- `tests/setup.ts`: Jest test environment configuration

### Configuration Files
- `jest.config.ts`: Test runner configuration
- `applitools.config.ts`: Visual testing configuration
- `tsconfig.json`: TypeScript compiler settings

## 🔍 Test Types

### 1. Example Test (`example.test.ts`)
- **Purpose**: Simple starter template for visual testing
- **Best for**: Getting started, learning basics
- **Features**: Minimal setup, basic visual checkpoints
- **Learning Focus**: Understanding the visual testing workflow

### 2. Basic Visual Test (`basic-visual.test.ts`)
- **Purpose**: Fundamental visual testing patterns
- **Features**: Applitools Eyes initialization, sample page loading, visual checkpoints
- **Learning Focus**: Core visual testing concepts and error handling

### 3. Advanced Visual Test (`advanced-visual.test.ts`)
- **Purpose**: Advanced visual testing techniques
- **Features**: Multiple checkpoints, element-specific testing, custom match levels
- **Learning Focus**: Complex scenarios and configuration options

### 4. Visual Grid Test (`visual-grid.test.ts`)
- **Purpose**: Enterprise-level cross-browser testing
- **Features**: Visual Grid Runner, multiple browser combinations, cloud testing
- **Learning Focus**: Scalable testing architecture

### 5. Automated Screenshot Comparison (`automated-screenshot-comparison.test.ts`)
- **Purpose**: Bulk visual testing with data processing
- **Features**: CSV processing, automated capture, detailed reporting
- **Learning Focus**: Data-driven testing and automation

### 6. Runtime Configuration (`runtime-config-example.test.ts`)
- **Purpose**: Alternative configuration methods
- **Features**: Programmatic API key setting, dynamic configuration
- **Learning Focus**: Flexible configuration patterns

## 🔄 CI/CD Integration

### GitHub Actions Setup
```yaml
name: Visual Tests
on: [push, pull_request]
jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run install:playwright
      - run: npm run build
      - run: npm test
        env:
          APPLITOOLS_API_KEY: ${{ secrets.APPLITOOLS_API_KEY }}
```

### Environment Variables for CI
- Set `APPLITOOLS_API_KEY` in your CI/CD secrets
- Configure `APPLITOOLS_BATCH_NAME` for build identification
- Use `APPLITOOLS_BATCH_ID` for unique batch tracking

### Integration Benefits
- **Automated Visual Regression**: Catch visual bugs early
- **Cross-Browser Coverage**: Test multiple browsers in parallel
- **Pull Request Integration**: Visual diffs in PR reviews
- **Baseline Management**: Automatic baseline updates

## ✅ Best Practices

### Test Organization
1. **Start Simple**: Begin with `example.test.ts` to understand basics
2. **Progressive Learning**: Follow the recommended learning path
3. **Descriptive Naming**: Use clear, descriptive test names
4. **Batch Organization**: Group related tests in batches

### Configuration Management
1. **Environment Variables**: Use `.env` files for local development
2. **CI/CD Secrets**: Store API keys securely in CI/CD systems
3. **Configuration Validation**: Always validate configuration before tests
4. **Runtime Flexibility**: Support both static and dynamic configuration

### Visual Testing Best Practices
1. **Stable Elements**: Focus on stable page elements
2. **Ignore Dynamic Content**: Use ignore regions for timestamps, ads, etc.
3. **Match Levels**: Choose appropriate comparison sensitivity
4. **Baseline Management**: Keep baselines updated and organized

### Code Quality
1. **TypeScript Strict Mode**: Maintain full type safety
2. **Error Handling**: Implement comprehensive error handling
3. **Documentation**: Keep tests well-documented
4. **Modular Design**: Create reusable test utilities

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### API Key Issues
**Problem**: `APPLITOOLS_API_KEY is not set`
**Solution**: 
```bash
# Set environment variable
export APPLITOOLS_API_KEY=your_key_here

# Or create .env file
echo "APPLITOOLS_API_KEY=your_key_here" > .env

# Or use runtime parameter
npm run test:basic-with-key --apikey=your_key_here
```

#### Browser Installation Issues
**Problem**: Playwright browsers not found
**Solution**:
```bash
# Reinstall Playwright browsers
npm run install:playwright

# Or install specific browsers
npx playwright install chromium firefox webkit
```

#### TypeScript Compilation Errors
**Problem**: Build failures or type errors
**Solution**:
```bash
# Clean build
npm run clean
npm run build

# Check TypeScript version
npx tsc --version

# Update dependencies
npm update
```

#### Test Timeout Issues
**Problem**: Tests timing out
**Solution**:
- Increase timeout in `jest.config.ts`
- Check network connectivity
- Verify Applitools service status
- Use `npm run test:debug` for detailed logging

#### Visual Differences
**Problem**: Unexpected visual differences
**Solution**:
1. Review changes in Applitools dashboard
2. Check for dynamic content (timestamps, ads)
3. Use ignore regions for unstable elements
4. Update baselines if changes are expected

#### Environment Setup
**Problem**: Configuration not loading
**Solution**:
```bash
# Verify .env file exists and is readable
cat .env

# Check environment variables
printenv | grep APPLITOOLS

# Validate configuration
npm run validate:config
```

### Debug Mode
Enable detailed logging for troubleshooting:
```bash
# Run tests with debug output
npm run test:debug

# Set debug environment variable
DEBUG=true npm test
```

### Getting Help
- **Applitools Documentation**: [https://applitools.com/docs/](https://applitools.com/docs/)
- **Playwright Documentation**: [https://playwright.dev/](https://playwright.dev/)
- **GitHub Issues**: Report framework-specific issues
- **Community Support**: Stack Overflow with relevant tags

---

## 🔗 Useful Links

- [Applitools Documentation](https://applitools.com/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Jest Documentation](https://jestjs.io/)

## 📝 License

MIT License - Feel free to use this as a template for your visual testing projects.

---

**🎯 Ready to start visual testing?** Run `npm run test:example` to see the framework in action!