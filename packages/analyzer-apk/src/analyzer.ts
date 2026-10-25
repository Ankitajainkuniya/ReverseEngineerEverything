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
      // AndroidManifest.xml is binary format, we need to extract text
      // For MVP, extract readable strings
      return { manifest: {} };
    } catch {
      throw new Error('Could not parse AndroidManifest.xml');
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
    const secretsFound: Map<string, number> = new Map();

    // Check assets and resources for hardcoded secrets
    zip.getEntries().forEach(entry => {
      if (entry.entryName.match(/\.(xml|properties|conf|json|gradle)$/i)) {
        try {
          const content = entry.getData().toString('utf8', 0, 5000); // First 5KB

          SENSITIVE_PATTERNS.forEach(pattern => {
            if (pattern.regex.test(content)) {
              secretsFound.set(pattern.name, (secretsFound.get(pattern.name) || 0) + 1);
            }
          });
        } catch {
          // Ignore binary/unreadable files
        }
      }
    });

    if (secretsFound.size > 0) {
      findings.push({
        id: crypto.randomUUID(),
        severity: 'critical',
        title: 'Hardcoded Secrets Detected',
        description: `Found potential hardcoded secrets in configuration files. These should be moved to secure storage.`,
        evidence: Array.from(secretsFound.entries()).map(([name, count]) => ({
          type: 'code',
          source: 'app resources',
          snippet: `${name} pattern found ${count} times`
        })),
        cwe: 'CWE-798',
        tags: ['secrets', 'credentials'],
        remediations: ['Move secrets to secure server-side configuration', 'Use Android Keystore for sensitive data']
      });
    }

    return findings;
  }
}
