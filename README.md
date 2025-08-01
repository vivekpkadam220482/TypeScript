# Playwright + Applitools Visual Testing Framework

A complete **TypeScript-only** boilerplate for visual testing using Playwright and Applitools Eyes SDK. This framework provides comprehensive visual regression testing capabilities from basic screenshots to enterprise-level cross-browser testing.

## 🎯 Framework Overview

This project demonstrates various visual testing approaches:
- **Basic visual testing** fundamentals
- **Advanced visual testing** with custom configurations
- **Visual Grid testing** for cross-browser coverage
- **Automated screenshot comparison** with CSV processing
- **Runtime configuration** examples
- **Enterprise-level testing** patterns

## 🧪 Test Suite

### Test Files (All TypeScript)

| Test File | Size | Lines | Purpose |
|-----------|------|-------|---------|
| `example.test.ts` | 4.9KB | 159 | Simple starter template for visual testing |
| `basic-visual.test.ts` | 11KB | 302 | Basic visual testing fundamentals |
| `advanced-visual.test.ts` | 14KB | 369 | Advanced visual testing techniques |
| `visual-grid.test.ts` | 15KB | 386 | Visual Grid Runner for enterprise testing |
| `automated-screenshot-comparison.test.ts` | 15KB | 474 | Automated comparison with CSV processing |
| `runtime-config-example.test.ts` | 7.4KB | 213 | Runtime configuration demonstration |
| `setup.ts` | 1.2KB | 34 | Jest test setup and configuration |

**Total: ~1,800+ lines of TypeScript test code**

### Detailed Test Descriptions

#### 🚀 **Example Test** (`example.test.ts`)
- **Purpose**: Simple starter template for visual testing
- **Best for**: Getting started, learning basics
- **Features**: Minimal setup, basic visual checkpoints

#### 📸 **Basic Visual Test** (`basic-visual.test.ts`)
- **Purpose**: Fundamental visual testing patterns
- **Features**:
  - Applitools Eyes initialization
  - Sample HTML page loading
  - Visual checkpoint capture
  - Error handling and cleanup

#### ⚡ **Advanced Visual Test** (`advanced-visual.test.ts`)
- **Purpose**: Advanced visual testing techniques
- **Features**:
  - Advanced Eyes configuration
  - Multiple visual checkpoints per test
  - Element-specific visual testing
  - Custom match levels and ignore regions
  - Cross-browser testing capabilities

#### 🌐 **Visual Grid Test** (`visual-grid.test.ts`)
- **Purpose**: Enterprise-level cross-browser testing
- **Features**:
  - Visual Grid Runner for parallel testing
  - Multiple browser/device combinations
  - Cloud-based visual testing
  - Batch processing for efficiency

#### 🔄 **Automated Screenshot Comparison** (`automated-screenshot-comparison.test.ts`)
- **Purpose**: Bulk visual testing with data processing
- **Features**:
  - CSV file processing for URL lists
  - Automated screenshot capture
  - Detailed reporting and summaries
  - Error aggregation and handling

#### ⚙️ **Runtime Configuration Example** (`runtime-config-example.test.ts`)
- **Purpose**: Alternative configuration methods
- **Features**:
  - Programmatic API key setting
  - Runtime configuration without env variables
  - Dynamic configuration management

## 🎮 Available Test Scripts

### Basic Test Commands

```bash
# Run all tests
npm test

# Run with verbose output
npm run test:debug

# Build TypeScript
npm run build
```

### Individual Test Commands

```bash
# Example test (recommended for beginners)
npm run test:example

# Basic visual testing
npm run test:basic

# Advanced visual testing
npm run test:advanced

# Visual Grid testing
npm run test:grid

# Automated screenshot comparison
npm run test:automated
```

### Tests with API Key Support

```bash
# Run tests with API key parameter
npm run test:basic-with-key --apikey=YOUR_API_KEY
npm run test:advanced-with-key --apikey=YOUR_API_KEY
npm run test:grid-with-key --apikey=YOUR_API_KEY
npm run test:all-with-key --apikey=YOUR_API_KEY
```

## 🔧 Setup and Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Applitools account and API key

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install:playwright

# Build TypeScript
npm run build

# Run setup script
npm run setup:script
```

### Environment Configuration

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

## 🔷 TypeScript-Only Framework

This project is **100% TypeScript** with no JavaScript dependencies:

### What's Included
- ✅ **TypeScript configuration** (`tsconfig.json`)
- ✅ **Type-safe test files** (`.test.ts`)
- ✅ **Typed configuration files** (`.config.ts`)
- ✅ **TypeScript scripts** (`scripts/*.ts`)
- ✅ **Full type definitions** for all APIs

### What's Removed
- ❌ **Babel configuration** - No longer needed
- ❌ **JavaScript files** - All converted to TypeScript
- ❌ **babel-jest** - Replaced with ts-jest
- ❌ **Mixed JS/TS setup** - Pure TypeScript only

### Build System
- **TypeScript Compiler**: Direct compilation via `tsc`
- **Jest Integration**: TypeScript tests via `ts-jest`
- **Script Execution**: TypeScript scripts via `tsx`
- **ES Modules**: Modern import/export syntax

## 📁 Project Structure

```
├── tests/                          # Test files
│   ├── example.test.ts             # Simple example
│   ├── basic-visual.test.ts        # Basic patterns
│   ├── advanced-visual.test.ts     # Advanced techniques
│   ├── visual-grid.test.ts         # Cross-browser testing
│   ├── automated-screenshot-comparison.test.ts # Bulk testing
│   ├── runtime-config-example.test.ts # Config examples
│   └── setup.ts                    # Jest setup
├── src/                            # Source code
│   ├── utils/                      # Utilities
│   └── sample-page/                # Test page
│       ├── index.html             # Sample HTML
│       ├── styles.css             # Sample styles
│       └── script.ts              # Sample TypeScript
├── scripts/                        # Build scripts
│   ├── run-with-api-key.ts        # API key runner
│   └── setup.ts                   # Setup script
├── jest.config.ts                  # Jest configuration
├── applitools.config.ts            # Applitools configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies & scripts
```

## 🚀 Getting Started

### Quick Start (Recommended)

1. **Install and setup**:
   ```bash
   npm install
   npm run setup
   ```

2. **Set your API key**:
   ```bash
   # Option 1: Environment variable
   export APPLITOOLS_API_KEY=your_key_here
   
   # Option 2: .env file
   echo "APPLITOOLS_API_KEY=your_key_here" > .env
   ```

3. **Run example test**:
   ```bash
   npm run test:example
   ```

### Step-by-Step Learning Path

1. **Start with**: `npm run test:example` - Learn basics
2. **Move to**: `npm run test:basic` - Understand fundamentals  
3. **Advance to**: `npm run test:advanced` - Learn advanced patterns
4. **Scale up**: `npm run test:grid` - Enterprise-level testing
5. **Automate**: `npm run test:automated` - Bulk processing

## 📊 Test Results and Reporting

### Applitools Dashboard
- Visual test results appear in your Applitools dashboard
- Batch organization for test runs
- Visual differences highlighted
- Approval workflow for changes

### Local Reporting
- Console output with detailed results
- Summary reports in `Results/` directory
- Error logging and aggregation
- Performance metrics

## 🛠️ Configuration Options

### Jest Configuration (`jest.config.ts`)
- TypeScript preset with ts-jest
- 60-second timeout for visual tests
- Custom module path mapping
- Coverage collection settings

### Applitools Configuration (`applitools.config.ts`)
- Multiple browser configurations
- Visual Grid settings
- Match level configurations
- Accessibility testing options

### TypeScript Configuration (`tsconfig.json`)
- ES2022 target for modern features
- ESNext modules for import/export
- Strict type checking enabled
- Path mapping for clean imports

## 🔗 Useful Links

- [Applitools Documentation](https://applitools.com/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Jest Documentation](https://jestjs.io/)

## 📝 License

MIT License - Feel free to use this as a template for your visual testing projects.

---

**🎯 Ready to start visual testing?** Run `npm run test:example` to see the framework in action!