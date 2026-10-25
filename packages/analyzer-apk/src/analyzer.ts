import { BaseAnalyzer, Target, AnalysisResult, Finding, Evidence, Severity } from '@ree/core';
import AdmZip from 'adm-zip';
import { parseStringPromise } from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface ManifestData {
  manifest?: {
    $?: Record<string, any>;
    'uses-permission'?: Array<{ $?: { 'android:name'?: string } }>;
    application?: Array<{
      activity?: Array<any>;
      service?: Array<any>;
      'broadcast-receiver'?: Array<any>;
      provider?: Array<any>;
      $?: Record<string, any>;
    }>;
  };
}

const DANGEROUS_PERMISSIONS = [
  'android.permission.CAMERA',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.READ_CONTACTS',
  'android.permission.WRITE_CONTACTS',
  'android.permission.READ_CALL_LOG',
  'android.permission.WRITE_CALL_LOG',
  'android.permission.READ_CALENDAR',
  'android.permission.WRITE_CALENDAR',
  'android.permission.RECORD_AUDIO',
  'android.permission.READ_SMS',
  'android.permission.SEND_SMS',
  'android.permission.INTERNET'
];

const SENSITIVE_PATTERNS = [
  { regex: /api[_-]?key|apikey/i, name: 'API Key' },
  { regex: /aws[_-]?key|aws[_-]?secret/i, name: 'AWS Credentials' },
  { regex: /password|passwd|pwd/i, name: 'Password' },
  { regex: /token|auth|secret/i, name: 'Secret/Token' }
];

export class APKAnalyzer extends BaseAnalyzer {
  readonly name = 'apk-analyzer';
  readonly version = '1.0.0';

  supports(target: Target): boolean {
    return target.type === 'apk' && target.path.endsWith('.apk');
  }

  async analyze(target: Target): Promise<AnalysisResult> {
    const findings: Finding[] = [];

    try {
      const zip = new AdmZip(target.path);
      const manifestBuffer = zip.readFile('AndroidManifest.xml');

      if (!manifestBuffer) {
        throw new Error('AndroidManifest.xml not found');
      }

      const manifestStr = manifestBuffer.toString('binary');
      const manifest = await this.parseManifest(manifestStr);

      // Check permissions
      findings.push(...this.checkPermissions(manifest));

      // Check exported components
      findings.push(...this.checkExportedComponents(manifest));

      // Check for debuggable flag
      findings.push(...this.checkDebuggable(manifest));

      // Check for hardcoded secrets
      findings.push(...this.checkForSecrets(zip));

    } catch (error) {
      throw new Error(`Failed to analyze APK: ${error}`);
    }

    const summary = {
      total: findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length,
      info: findings.filter(f => f.severity === 'info').length
    };

    return {
      analyzerId: this.name,
      targetPath: target.path,
      timestamp: new Date(),
      findings,
      summary
    };
  }

  private async parseManifest(data: string): Promise<ManifestData> {
    try {
      // AndroidManifest.xml is in binary format (AXML)
      // Extract readable strings from the manifest
      // This is a simplified parser that works for MVP

      const manifest: ManifestData = {
        manifest: {
          $: {},
          'uses-permission': [],
          application: [{
            activity: [],
            service: [],
            'broadcast-receiver': [],
            provider: [],
            $: {}
          }]
        }
      };

      // Extract permissions (they appear as plain text in AXML)
      const permissionMatches = data.match(/android\.permission\.[A-Z_]+/g) || [];
      manifest.manifest!['uses-permission'] = [...new Set(permissionMatches)].map(p => ({
        $: { 'android:name': p }
      }));

      // Extract component names (Activities, Services, etc.)
      const componentMatches = data.match(/[a-z][a-z0-9.]*\.[A-Za-z][A-Za-z0-9]*Activity/gi) || [];
      manifest.manifest!.application![0].activity = [...new Set(componentMatches)].map(c => ({
        $: { 'android:name': c }
      }));

      // Check for debuggable flag
      if (data.includes('debuggable')) {
        // Try to determine if it's true or false
        const debugIndex = data.indexOf('debuggable');
        const context = data.substring(Math.max(0, debugIndex - 20), debugIndex + 50);
        if (context.includes('\x01\x00')) {
          // Binary true value
          manifest.manifest!.application![0].$!['android:debuggable'] = 'true';
        }
      }

      return manifest;
    } catch (error) {
      throw new Error(`Could not parse AndroidManifest.xml: ${error}`);
    }
  }

  private checkPermissions(manifest: ManifestData): Finding[] {
    const findings: Finding[] = [];

    if (!manifest.manifest?.['uses-permission']) {
      return findings;
    }

    const permissions = manifest.manifest['uses-permission'];
    const dangerousFound = permissions.filter(p =>
      DANGEROUS_PERMISSIONS.includes(p.$?.['android:name'] || '')
    );

    if (dangerousFound.length > 0) {
      findings.push({
        id: crypto.randomUUID(),
        severity: 'high',
        title: 'Dangerous Permissions Detected',
        description: `The app requests ${dangerousFound.length} dangerous permissions that could access sensitive user data.`,
        evidence: dangerousFound.map((p, idx) => ({
          type: 'metadata',
          source: 'AndroidManifest.xml',
          snippet: p.$?.['android:name'] || 'unknown'
        })),
        cwe: 'CWE-250',
        tags: ['permissions', 'privacy']
      });
    }

    return findings;
  }

  private checkExportedComponents(manifest: ManifestData): Finding[] {
    const findings: Finding[] = [];

    if (!manifest.manifest?.application) {
      return findings;
    }

    const app = manifest.manifest.application[0];
    const exportedComponents = [];

    // Check activities
    if (app.activity) {
      exportedComponents.push(...app.activity.filter((a: any) => a.$?.['android:exported'] === 'true'));
    }

    // Check services
    if (app.service) {
      exportedComponents.push(...app.service.filter((s: any) => s.$?.['android:exported'] === 'true'));
    }

    // Check broadcast receivers
    if (app['broadcast-receiver']) {
      exportedComponents.push(...app['broadcast-receiver'].filter((b: any) => b.$?.['android:exported'] === 'true'));
    }

    if (exportedComponents.length > 0) {
      findings.push({
        id: crypto.randomUUID(),
        severity: 'medium',
        title: 'Exported Components Without Protection',
        description: `Found ${exportedComponents.length} exported components that can be accessed by other apps. Ensure they are protected with proper permissions.`,
        evidence: exportedComponents.map(c => ({
          type: 'metadata',
          source: 'AndroidManifest.xml',
          snippet: c.$?.['android:name'] || 'unknown'
        })),
        cwe: 'CWE-927',
        tags: ['exposure', 'components']
      });
    }

    return findings;
  }

  private checkDebuggable(manifest: ManifestData): Finding[] {
    const findings: Finding[] = [];

    if (manifest.manifest?.application?.[0].$?.['android:debuggable'] === 'true') {
      findings.push({
        id: crypto.randomUUID(),
        severity: 'critical',
        title: 'App is Debuggable',
        description: 'The application has the debuggable flag enabled, allowing attackers to easily inspect and modify the app at runtime.',
        evidence: [{
          type: 'metadata',
          source: 'AndroidManifest.xml',
          snippet: 'android:debuggable="true"'
        }],
        cwe: 'CWE-489',
        tags: ['debuggable', 'security-config'],
        remediations: ['Set android:debuggable="false" in production builds']
      });
    }

    return findings;
  }

  private checkForSecrets(zip: AdmZip): Finding[] {
    const findings: Finding[] = [];
    const secretsFound: Map<string, Array<{file: string; snippet: string}>> = new Map();

    zip.getEntries().forEach(entry => {
      if (entry.entryName.match(/\.(xml|properties|conf|json|gradle|config)$/i)) {
        try {
          const content = entry.getData().toString('utf8', 0, 10000);
          SENSITIVE_PATTERNS.forEach(pattern => {
            if (pattern.regex.test(content)) {
              if (!secretsFound.has(pattern.name)) {
                secretsFound.set(pattern.name, []);
              }
              secretsFound.get(pattern.name)!.push({
                file: entry.entryName,
                snippet: content.substring(0, 100)
              });
            }
          });
        } catch {
          // Binary file, ignore
        }
      }
    });

    if (secretsFound.size > 0) {
      findings.push({
        id: crypto.randomUUID(),
        severity: 'critical',
        title: 'Hardcoded Secrets Detected',
        description: `Found ${secretsFound.size} potential hardcoded secrets in configuration files.`,
        evidence: Array.from(secretsFound.entries()).map(([name, locs]) => ({
          type: 'code',
          source: locs[0].file,
          snippet: `${name} pattern`
        })),
        cwe: 'CWE-798',
        tags: ['secrets', 'credentials'],
        remediations: ['Remove all hardcoded secrets', 'Use secure server-side configuration', 'Use Android Keystore']
      });
    }

    return findings;
  }
}
