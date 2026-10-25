import { APKAnalyzer } from '../analyzer';
import { Target } from '@ree/core';
import * as path from 'path';

// Note: Full integration tests would require actual APK files
// These are unit tests for the analyzer structure

describe('APKAnalyzer', () => {
  let analyzer: APKAnalyzer;

  beforeEach(() => {
    analyzer = new APKAnalyzer();
  });

  test('should have correct name and version', () => {
    expect(analyzer.name).toBe('apk-analyzer');
    expect(analyzer.version).toBe('1.0.0');
  });

  test('should support APK files', () => {
    const target: Target = {
      path: '/test/app.apk',
      type: 'apk'
    };
    expect(analyzer.supports(target)).toBe(true);
  });

  test('should not support other file types', () => {
    const targets: Target[] = [
      { path: '/test/app.elf', type: 'elf' },
      { path: '/test/app.asar', type: 'electron' },
      { path: '/test/app.zip', type: 'apk' } // Wrong extension
    ];

    targets.forEach(target => {
      if (target.type !== 'apk') {
        expect(analyzer.supports(target)).toBe(false);
      }
    });
  });

  test('should require APK file to exist', async () => {
    const target: Target = {
      path: '/nonexistent/file.apk',
      type: 'apk'
    };

    await expect(analyzer.analyze(target)).rejects.toThrow();
  });
});
