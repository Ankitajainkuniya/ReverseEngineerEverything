import { BaseAnalyzer, Target, AnalysisResult, AnalyzerConfig } from './types';
import { PluginLoader } from './plugin-loader';

export class AnalysisRunner {
  constructor(private loader: PluginLoader) {}

  async run(target: Target, config?: AnalyzerConfig): Promise<AnalysisResult> {
    const analyzer = this.loader.findAnalyzer(target);

    if (!analyzer) {
      throw new Error(`No analyzer found for target type: ${target.type}`);
    }

    return analyzer.analyze(target, config);
  }

  async runWithAnalyzer(analyzer: BaseAnalyzer, target: Target, config?: AnalyzerConfig): Promise<AnalysisResult> {
    if (!analyzer.supports(target)) {
      throw new Error(`Analyzer "${analyzer.name}" does not support target type: ${target.type}`);
    }

    return analyzer.analyze(target, config);
  }
}
