/**
 * REE Demo - Showcase the framework working with a sample APK analysis
 *
 * This demonstrates:
 * 1. Loading the framework
 * 2. Registering an analyzer
 * 3. Running analysis on a target
 * 4. Formatting findings for output
 */

import { PluginLoader, AnalysisRunner, Target, Finding } from '../packages/core/src/index';
import { APKAnalyzer } from '../packages/analyzer-apk/src/analyzer';

async function demonstrateREE() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     ReverseEngineerEverything (REE) - Framework Demo       ║
║         Security Analysis Framework for Researchers        ║
╚════════════════════════════════════════════════════════════╝
`);

  // 1. Initialize the framework
  console.log('📦 Initializing REE framework...\n');
  const loader = new PluginLoader();
  const runner = new AnalysisRunner(loader);

  // 2. Register analyzers
  console.log('🔧 Registering analyzers...');
  const apkAnalyzer = new APKAnalyzer();
  loader.register(apkAnalyzer);
  console.log(`   ✅ APK Analyzer v${apkAnalyzer.version}\n`);

  // 3. List registered analyzers
  console.log('📋 Available Analyzers:');
  loader.listAnalyzers().forEach(analyzer => {
    console.log(`   • ${analyzer.name} (v${analyzer.version})`);
  });
  console.log();

  // 4. Show example findings (simulated for demo)
  console.log('🔍 Example: Running analysis on a hypothetical Android APK...\n');
  showExampleFindings();

  // 5. Show how to use with Claude
  console.log(`
╔════════════════════════════════════════════════════════════╗
║              Using REE with Claude AI                      ║
╚════════════════════════════════════════════════════════════╝

When using REE with Claude, you get AI-powered insights:

   User: "Analyze app.apk"

   Claude (with REE):
   "I found 5 security issues in this app. The most critical is
    that it's debuggable - meaning an attacker could easily inspect
    and modify the app at runtime. This should be disabled in
    production. The app also requests excessive permissions..."
`);

  // 6. Show next steps
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                   Getting Started                          ║
╚════════════════════════════════════════════════════════════╝

1. Install REE:
   npm install -g ree

2. Analyze an Android app:
   ree analyze myapp.apk

3. Get AI explanations:
   Use in Claude Code or Cursor with the REE skill

4. Build your own analyzer:
   See CONTRIBUTING.md for details

5. Join the community:
   https://discord.gg/ree

`);
}

function showExampleFindings() {
  const exampleFindings: Finding[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'App is Debuggable',
      description: 'The android:debuggable flag is enabled in production. Attackers can easily inspect and modify the app at runtime.',
      evidence: [{
        type: 'metadata',
        source: 'AndroidManifest.xml',
        snippet: 'android:debuggable="true"'
      }],
      cwe: 'CWE-489',
      tags: ['debuggable', 'critical'],
      remediations: ['Set android:debuggable="false" in production builds']
    },
    {
      id: '2',
      severity: 'high',
      title: 'Dangerous Permissions Detected',
      description: 'The app requests 6 dangerous permissions that could access sensitive user data.',
      evidence: [
        { type: 'metadata', source: 'AndroidManifest.xml', snippet: 'android.permission.CAMERA' },
        { type: 'metadata', source: 'AndroidManifest.xml', snippet: 'android.permission.ACCESS_FINE_LOCATION' },
        { type: 'metadata', source: 'AndroidManifest.xml', snippet: 'android.permission.READ_CONTACTS' },
      ],
      cwe: 'CWE-250',
      tags: ['permissions', 'privacy'],
      remediations: ['Only request permissions that are absolutely necessary']
    },
    {
      id: '3',
      severity: 'medium',
      title: 'Exported Components Without Protection',
      description: 'Found 3 exported components that can be accessed by other apps.',
      evidence: [
        { type: 'metadata', source: 'AndroidManifest.xml', snippet: 'com.example.MainActivity (exported)' },
      ],
      cwe: 'CWE-927',
      tags: ['exposure']
    }
  ];

  console.log('📊 Analysis Results:\n');
  console.log(`   🔴 Critical: ${exampleFindings.filter(f => f.severity === 'critical').length}`);
  console.log(`   🟠 High:     ${exampleFindings.filter(f => f.severity === 'high').length}`);
  console.log(`   🟡 Medium:   ${exampleFindings.filter(f => f.severity === 'medium').length}`);
  console.log(`\n   Total: ${exampleFindings.length} findings\n`);

  exampleFindings.forEach((finding, idx) => {
    const severityEmoji = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵',
      info: '⚪'
    };

    console.log(`${severityEmoji[finding.severity]} ${idx + 1}. ${finding.title}`);
    console.log(`   ${finding.description}`);
    if (finding.cwe) {
      console.log(`   CWE: ${finding.cwe}`);
    }
    console.log();
  });
}

demonstrateREE().catch(console.error);
