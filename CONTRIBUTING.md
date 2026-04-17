# Contributing to ImpactTreasury

Thank you for your interest in contributing to ImpactTreasury! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment following the [README](README.md#quick-start)
4. Create a new branch for your work

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/impacttreasury-giggybank.git
cd impacttreasury-giggybank
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run dev
```

## Making Changes

### Branch Naming

Use descriptive branch names with prefixes:

- `feat/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation changes
- `ui/` — UI/styling changes
- `refactor/` — Code refactoring

Example: `feat/add-new-mint-option`

### Commit Messages

Use conventional commit prefixes:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `ui:` — UI/styling changes
- `ux:` — UX improvements
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

Example: `feat: add multi-image upload support`

## Pull Request Process

1. Update documentation if your changes affect usage
2. Test your changes locally
3. Ensure the build passes (`npm run build`)
4. Create a pull request with a clear description of changes
5. Link any related issues in the PR description

### PR Description Template

```
## Summary
Brief description of changes

## Changes
- Change 1
- Change 2

## Testing
How you tested these changes

## Related Issues
Closes #XX (if applicable)
```

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
