# Contributing to NoteMesh 🚀

First off, thank you for considering contributing to NoteMesh! NoteMesh is a community-driven project built to empower thinkers, writers, and engineers worldwide with a local-first knowledge workspace.

Whether you are fixing a typo in documentation, adding a new graph layout algorithm, designing a canvas shape, or writing your first plugin, your contributions are warmly welcomed!

---

## 📌 Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please treat fellow contributors with respect, empathy, and kindness.

---

## 🛠️ Quickstart: Local Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/notemesh.git
   cd notemesh
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run the test suite:**
   ```bash
   npm test
   ```

---

## 🧭 Finding What to Work On

Check our [GitHub Issues](https://github.com/your-username/notemesh/issues) for labeled tasks:
- `good first issue` - Ideal for new contributors and first-time open-source developers!
- `help wanted` - Features and enhancements ready for community help.
- `area/graph` - Knowledge Graph visualization, physics algorithms, and filters.
- `area/canvas` - Freeform diagramming, new shapes, and connectors.
- `area/plugins` - Sample extensions, API improvements, and integrations.

---

## 🌿 Git Branch & Commit Conventions

### 1. Branch Naming
Create a feature branch with a descriptive prefix:
- `feat/canvas-mindmap-layout`
- `fix/wikilink-case-sensitivity`
- `docs/plugin-tutorial`
- `test/graph-builder-coverage`

### 2. Conventional Commits
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat: add diamond shape resize handles to canvas`
- `fix: resolve backlink indexing for uppercase tags`
- `docs: update architecture guide with plugin lifecycle`
- `test: add unit tests for graph repulsion physics`
- `chore: update dependencies to latest patch versions`

---

## 🧪 Quality Standards & Pre-PR Checklist

Before opening a Pull Request, please ensure the following commands pass with zero warnings or errors:

```bash
# 1. Typecheck & Build
npm run build

# 2. Linting
npm run lint

# 3. Unit Tests
npm test
```

---

## 🔌 Authoring a Plugin

Want to extend NoteMesh? Read our [Plugin Development Guide](./docs/plugin-development.md). 
You can implement status bar indicators, custom keyboard shortcuts, or note converters without modifying the core codebase!

---

## 📬 Pull Request Review SLA

As maintainers, we pledge to review community PRs within **48 to 72 hours**. If changes are needed, we will provide friendly, constructive comments to help you get your PR merged smoothly.

Thank you for helping make knowledge tools accessible, open-source, and local-first! ✨
