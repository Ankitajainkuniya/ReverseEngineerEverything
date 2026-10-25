import { BaseAnalyzer, Target } from './types';

export class PluginLoader {
  private analyzers: Map<string, BaseAnalyzer> = new Map();

  register(analyzer: BaseAnalyzer): void {
    this.analyzers.set(analyzer.name, analyzer);
  }

  getAnalyzer(name: string): BaseAnalyzer | undefined {
    return this.analyzers.get(name);
  }

  findAnalyzer(target: Target): BaseAnalyzer | undefined {
    for (const analyzer of this.analyzers.values()) {
      if (analyzer.supports(target)) {
        return analyzer;
      }
    }
    return undefined;
  }

  listAnalyzers(): Array<{ name: string; version: string }> {
    return Array.from(this.analyzers.values()).map(a => ({
      name: a.name,
      version: a.version
    }));
  }
}
