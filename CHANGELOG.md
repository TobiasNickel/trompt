# Changelog

## v1.0.0 - Modern JavaScript Rewrite (2025-10-06)

### 🚀 Breaking Changes
- **ES Modules**: Converted from CommonJS to ES modules (`import`/`export`)
- **Node.js Requirements**: Now requires Node.js ≥ 16.0.0
- **Package Type**: Changed `package.json` type to `"module"`

### ✨ New Features
- **TypeScript Support**: Complete TypeScript definitions with full type safety
  - Comprehensive type definitions for all prompt types
  - Type-safe validation functions
  - Proper IntelliSense support in IDEs
  - Inquirer-style API with full typing
- **Modern Syntax**: Updated to modern JavaScript features
  - Template literals instead of string concatenation
  - Arrow functions with consistent usage
  - `const`/`let` instead of `var`
  - Modern array methods and object spread
- **Better Error Handling**: Improved error messages and validation
- **Enhanced API**: More consistent configuration options
- **Inquirer Compatibility**: Fixed typo in inquirer.prompt method name

### 🔧 Improvements
- **Dependency Updates**: 
  - `chalk` updated from v2.4.1 to v5.3.0
  - `ansi-escapes` updated from v3.1.0 to v6.2.0
  - `eslint` updated from v5.1.0 to v8.57.0
- **Code Quality**:
  - Replaced deprecated `substr()` with `substring()`
  - Better memory management with proper event cleanup
  - Consistent code formatting and style
  - Removed commented-out dead code

### 🛠️ Technical Changes
- **Event Handling**: Improved keypress event management with proper cleanup
- **Promise Patterns**: Modernized promise creation and handling
- **Validation**: Enhanced input validation with better type checking
- **Choice Normalization**: Improved handling of select/checkbox choices
- **Default Values**: Better support for default values in all prompt types

### 🏗️ Development
- **Package Structure**: Added proper `exports` field in package.json
- **Engine Requirements**: Specified Node.js version requirements
- **Updated Keywords**: Enhanced package discoverability

### 📚 Documentation  
- **README**: Completely rewritten with modern examples
- **API Documentation**: Comprehensive usage examples for all prompt types
- **Migration Guide**: Clear guidance for upgrading from v0.x

### 🐛 Bug Fixes
- Fixed typo in `inquirer.propmt` → `inquirer.prompt`
- Fixed boundary conditions in select/checkbox navigation
- Improved number input validation for edge cases
- Better handling of Ctrl+C interrupts

---

### Migration from v0.x

#### Before (v0.x):
```js
const { prompt } = require('trompt');
```

#### After (v1.0.0):
```js
import { prompt } from 'trompt';
```

All existing functionality remains compatible, just update your import statements!