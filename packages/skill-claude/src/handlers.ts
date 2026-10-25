import { AnalysisRunner, PluginLoader, Target } from '@ree/core';
import { APKAnalyzer } from '@ree/analyzer-apk';

const loader = new PluginLoader();
const runner = new AnalysisRunner(loader);

// Register analyzers
loader.register(new APKAnalyzer());

export async function analyzeTarget(filePath: string): Promise<string> {
  // Determine target type from file extension
  let targetType: 'apk' | 'js' | 'elf' | 'electron' = 'apk';

  if (filePath.endsWith('.apk')) {
    targetType = 'apk';
  } else if (filePath.endsWith('.asar')) {
    targetType = 'electron';
  } else if (filePath.endsWith('.elf') || filePath.endsWith('.so')) {
    targetType = 'elf';
  } else if (filePath.endsWith('.js')) {
    targetType = 'js';
  }

  const target: Target = {
    path: filePath,
    type: targetType
  };

  try {
    const result = await runner.run(target);

    // Format findings for Claude to explain
    let output = `# Security Analysis Results for ${filePath}\n\n`;
    output += `**Summary:** Found ${result.summary.total} findings (${result.summary.critical} critical, ${result.summary.high} high, ${result.summary.medium} medium)\n\n`;

    result.findings.forEach((finding, idx) => {
      output += `## Finding ${idx + 1}: ${finding.title}\n`;
      output += `**Severity:** ${finding.severity.toUpperCase()}\n`;
      output += `**Description:** ${finding.description}\n`;

      if (finding.cwe) {
        output += `**CWE:** ${finding.cwe}\n`;
      }

      output += `**Evidence:**\n`;
      finding.evidence.forEach(e => {
        output += `- ${e.type}: ${e.snippet}\n`;
      });

      if (finding.remediations) {
        output += `**How to Fix:**\n`;
        finding.remediations.forEach(r => {
          output += `- ${r}\n`;
        });
      }

      output += '\n';
    });

    return output;
  } catch (error) {
    throw new Error(`Analysis failed: ${error}`);
  }
}

export function listSupportedFormats(): string {
  const formats = loader.listAnalyzers();
  return `Supported formats:\n${formats.map(f => `- ${f.name} (v${f.version})`).join('\n')}`;
}
