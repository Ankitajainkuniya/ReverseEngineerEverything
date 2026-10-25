# Contributing to ReverseEngineerEverything

We welcome all contributions! REE is designed to be extensible, and we're especially excited about new analyzers.

## Adding a New Analyzer

Want to add support for a new format? Here's how:

### 1. Create a new package

```bash
mkdir packages/analyzer-YOUR-FORMAT
cd packages/analyzer-YOUR-FORMAT
npm init -y
```

### 2. Implement BaseAnalyzer

```typescript
import { BaseAnalyzer, Finding, Target, AnalysisResult } from '@ree/core';

export class YourAnalyzer extends BaseAnalyzer {
  readonly name = 'your-analyzer';
  readonly version = '1.0.0';

  supports(target: Target): boolean {
    return target.type === 'yourformat';
  }

  async analyze(target: Target): Promise<AnalysisResult> {
    // Your implementation here
    return {
      analyzerId: this.name,
      targetPath: target.path,
      timestamp: new Date(),
      findings: [],
      summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    };
  }
}
```

### 3. Add dependencies

```bash
npm install @ree/core
```

### 4. Create tests

Add tests in `src/__tests__/` directory.

### 5. Submit PR

- Create a fork
- Create a feature branch: `git checkout -b feat/add-xyz-analyzer`
- Commit: `git commit -am 'Add XYZ analyzer'`
- Push: `git push origin feat/add-xyz-analyzer`
- Open PR with:
  - Clear description of the format/target
  - Examples of analyzed files
  - Test results

## Bug Reports

Found a bug? Please open an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS)

## Feature Requests

Have an idea for REE? Open an issue describing:
- What problem it solves
- How it benefits security researchers
- Example use case

## Code Style

We use TypeScript with strict mode. Please:
- Run `npm run build` before committing
- Add types for all functions
- Write clear, self-documenting code
- No `any` types without justification

## Questions?

Join our Discord or open an issue! We're here to help.

---

**Thanks for contributing to security research! 🔒**
