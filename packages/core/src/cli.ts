#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { PluginLoader, AnalysisRunner, Target } from './index';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp();
    process.exit(0);
  }

  if (args[0] === 'analyze' && args[1]) {
    await analyzeFile(args[1]);
  } else if (args[0] === 'list') {
    await listAnalyzers();
  } else {
    console.error(`Unknown command: ${args[0]}`);
    printHelp();
    process.exit(1);
  }
}

async function analyzeFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Determine target type
  const ext = path.extname(filePath).toLowerCase();
  let targetType: 'apk' | 'elf' | 'js' | 'electron' = 'apk';

  if (ext === '.apk') targetType = 'apk';
  else if (ext === '.asar') targetType = 'electron';
  else if (ext === '.elf' || ext === '.so') targetType = 'elf';
  else if (ext === '.js') targetType = 'js';

  const target: Target = {
    path: path.resolve(filePath),
    type: targetType
  };

  const loader = new PluginLoader();

  // Load analyzers dynamically to avoid circular dependencies
  try {
    const { APKAnalyzer } = await import('../analyzer-apk/dist/index');
    loader.register(new APKAnalyzer());
  } catch (error) {
    console.warn('APK Analyzer not available. Install with: npm install @ree/analyzer-apk');
  }

  const runner = new AnalysisRunner(loader);

  try {
    console.log(`🔍 Analyzing ${path.basename(filePath)}...`);
    const result = await runner.run(target);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Analysis Complete`);
    console.log(`${'='.repeat(60)}\n`);

    console.log(`File: ${result.targetPath}`);
    console.log(`Analyzer: ${result.analyzerId}`);
    console.log(`Timestamp: ${result.timestamp.toISOString()}\n`);

    console.log(`📈 Summary:`);
    console.log(`   Total findings: ${result.summary.total}`);
    console.log(`   🔴 Critical: ${result.summary.critical}`);
    console.log(`   🟠 High: ${result.summary.high}`);
    console.log(`   🟡 Medium: ${result.summary.medium}`);
    console.log(`   🔵 Low: ${result.summary.low}`);
    console.log(`   ⚪ Info: ${result.summary.info}\n`);

    result.findings.forEach((finding, idx) => {
      console.log(`${idx + 1}. ${finding.title}`);
      console.log(`   Severity: ${finding.severity.toUpperCase()}`);
      console.log(`   ${finding.description}`);
      if (finding.cwe) console.log(`   CWE: ${finding.cwe}`);
      if (finding.evidence.length > 0) {
        console.log(`   Evidence:`);
        finding.evidence.forEach(e => {
          console.log(`     - ${e.snippet}`);
        });
      }
      console.log('');
    });

    console.log(`${'='.repeat(60)}`);
    console.log(`✨ Use with Claude for AI-powered analysis!`);
    console.log(`${'='.repeat(60)}`);

  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}

async function listAnalyzers() {
  const loader = new PluginLoader();

  // Load available analyzers
  try {
    const { APKAnalyzer } = await import('../analyzer-apk/dist/index');
    loader.register(new APKAnalyzer());
  } catch {
    // Analyzer not available
  }

  const analyzers = loader.listAnalyzers();
  console.log('📦 Available Analyzers:\n');
  analyzers.forEach(a => {
    console.log(`  ${a.name} (v${a.version})`);
  });
}

function printHelp() {
  console.log(`
ReverseEngineerEverything (REE) v1.0.0
Open-source reverse engineering framework for security researchers

Usage:
  ree analyze <file>    Analyze a file (APK, ELF, JS, etc.)
  ree list             List all available analyzers
  ree --help           Show this help message

Examples:
  ree analyze app.apk
  ree analyze binary.elf
  ree list

For more info: https://github.com/morluto/ree
  `);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
