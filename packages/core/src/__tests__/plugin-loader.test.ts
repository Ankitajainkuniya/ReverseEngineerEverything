import { PluginLoader, BaseAnalyzer, Target, AnalysisResult } from '../index';

class MockAnalyzer extends BaseAnalyzer {
  readonly name = 'mock-analyzer';
  readonly version = '1.0.0';

  supports(target: Target): boolean {
    return target.type === 'mock';
  }

  async analyze(target: Target): Promise<AnalysisResult> {
    return {
      analyzerId: this.name,
      targetPath: target.path,
      timestamp: new Date(),
      findings: [],
      summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    };
  }
}

describe('PluginLoader', () => {
  let loader: PluginLoader;

  beforeEach(() => {
    loader = new PluginLoader();
  });

  test('should register an analyzer', () => {
    const analyzer = new MockAnalyzer();
    loader.register(analyzer);

    expect(loader.getAnalyzer('mock-analyzer')).toBe(analyzer);
  });

  test('should find analyzer by target type', () => {
    const analyzer = new MockAnalyzer();
    loader.register(analyzer);

    const target: Target = { path: '/test.mock', type: 'mock' };
    expect(loader.findAnalyzer(target)).toBe(analyzer);
  });

  test('should return undefined for unsupported target', () => {
    const analyzer = new MockAnalyzer();
    loader.register(analyzer);

    const target: Target = { path: '/test.unknown', type: 'apk' };
    expect(loader.findAnalyzer(target)).toBeUndefined();
  });

  test('should list registered analyzers', () => {
    const analyzer = new MockAnalyzer();
    loader.register(analyzer);

    const analyzers = loader.listAnalyzers();
    expect(analyzers).toHaveLength(1);
    expect(analyzers[0].name).toBe('mock-analyzer');
    expect(analyzers[0].version).toBe('1.0.0');
  });
});
