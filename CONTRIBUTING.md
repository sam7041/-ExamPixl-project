# Contributing to ExamPixl

First off, thank you for considering contributing to ExamPixl! It's people like you that make ExamPixl such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs** if possible

### Feature Requests

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title** for the issue
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript / React styleguides
* End all files with a newline
* Avoid platform-dependent code

## Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn
* Git
* TypeScript 5.8+

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/exampixl.git
cd exampixl

# Add upstream remote
git remote add upstream https://github.com/sam7041/exampixl.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Workflow

1. **Create a branch** for your feature: `git checkout -b feature/my-feature`
2. **Make your changes** and test thoroughly
3. **Run linting**: `npm run lint` (must pass with zero errors)
4. **Commit with clear messages**: 
   ```bash
   git commit -m "feat: add new feature description"
   # Use conventional commits:
   # feat: for new features
   # fix: for bug fixes
   # docs: for documentation changes
   # style: for code style changes
   # refactor: for code refactoring
   # test: for test additions
   # chore: for build/dependency changes
   ```
5. **Push to your fork**: `git push origin feature/my-feature`
6. **Open a Pull Request** with a clear description

### Building & Testing

```bash
# Build for production
npm run build

# Check for TypeScript errors
npm run lint

# Preview production build locally
npm run preview

# Clean build artifacts
npm run clean
```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with a relevant emoji:
  - 🎨 when improving the format/structure of the code
  - 🚀 when improving performance
  - 📝 when writing docs
  - 🐛 when fixing a bug
  - ✨ when introducing a new feature
  - 🔒 when dealing with security
  - ⬆️ when upgrading dependencies
  - 🔧 when updating configuration files

### TypeScript/React Styleguide

- Use TypeScript for all new code
- Use functional components with hooks (no class components)
- Use proper type annotations
- Use `const` and `let` (never `var`)
- Use destructuring where possible
- Keep components modular and focused
- Use descriptive variable and function names
- Add JSDoc comments for exported functions and components

Example:
```typescript
/**
 * Compresses an image file
 * @param file - The image file to compress
 * @param quality - Compression quality (0-100)
 * @returns Promise resolving to compressed blob
 */
export async function compressImage(file: File, quality: number): Promise<Blob> {
  // implementation
}
```

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help organize and categorize issues and pull requests.

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `question` - Further information is requested

## Recognition

Contributors will be recognized in:
- The README contributors section
- GitHub contributors page
- Release notes for significant contributions

## Questions?

Feel free to open an issue with the question label or contact the maintainers.

Thank you for contributing! 🎉
