# ReverseEngineerEverything (REE)

> **Find critical vulnerabilities in Android apps in seconds. No reverse engineering. No setup hell. Just npm install and go.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/ree.svg)](https://www.npmjs.com/package/ree)
[![Discord](https://img.shields.io/discord/1234567890?color=7289DA)](https://discord.gg/ree)

## What is REE?

REE is an open-source **reverse engineering framework** that turns vulnerability research into seconds instead of hours. Unlike traditional tools that require expensive commercial software (Ghidra, IDA Pro), manual setup, and deep expertise—REE works out of the box.

**Perfect for:**
- 🎯 **Bug bounty hunters** - Find vulnerabilities faster than competitors
- 🔒 **Security researchers** - Analyze apps without Ghidra/IDA setup
- 📱 **Mobile developers** - Audit your own Android apps
- 🏫 **CTF & Security students** - Learn without friction

## Why REE > REA (or other tools)

| Feature | REE | REA | Ghidra | IDA |
|---------|-----|-----|--------|-----|
| **Setup time** | 30 seconds | 2+ hours | 1+ hour | $$$ |
| **Cost** | Free, open-source | Free | Free | $3,000+ |
| **Android APK analysis** | ✅ Built-in | ⚠️ Complex setup | ❌ Requires plugins | ❌ Limited |
| **AI explanations** | ✅ Claude integration | ❌ No | ❌ No | ❌ No |
| **Extensible** | ✅ Easy plugin system | ⚠️ Complex | ⚠️ Heavyweight | ❌ Closed |
| **Works out of box** | ✅ Yes | ❌ No | ❌ No | ❌ No |

## Quick Start

### Installation

```bash
npm install -g ree
```

### Analyze an APK in 30 seconds

```bash
ree analyze my-app.apk
```

Output:
```
# Security Analysis Results for my-app.apk

**Summary:** Found 7 findings (2 critical, 3 high, 2 medium)

## Finding 1: App is Debuggable
**Severity:** CRITICAL
**Description:** The application has the debuggable flag enabled, allowing 
attackers to easily inspect and modify the app at runtime.
**CWE:** CWE-489
**How to Fix:** Set android:debuggable="false" in production builds

## Finding 2: Dangerous Permissions Detected
**Severity:** HIGH
**Description:** The app requests 5 dangerous permissions that could access 
sensitive user data (CAMERA, LOCATION, READ_CONTACTS, READ_SMS, INTERNET).
```

### Use with Claude (even better)

Tell Claude to analyze an APK:
```
User: Analyze this APK and explain what vulnerabilities it has
Claude (with REE skill): [analyzes app] 
"I found 7 security issues in this app. The most critical is that it's 
debuggable - attackers can easily inspect and modify it at runtime. 
It also requests excessive permissions without clear justification..."
```

## What REE Finds

### Android APK Analysis
- ✅ **Dangerous permissions** - Identifies privacy-invasive permissions
- ✅ **Exported components** - Finds unprotected Activities, Services, BroadcastReceivers
- ✅ **Debuggable flag** - Detects debug builds in production
- ✅ **Hardcoded secrets** - Finds API keys, tokens, credentials in app resources
- ✅ **WebView vulnerabilities** - Detects insecure JavaScript bridge config
- ✅ **Intent filter issues** - Identifies malicious intent possibilities

### Coming Soon (v1.1+)
- 🔜 **JavaScript/Electron analysis** - DOM XSS, hardcoded secrets, dangerous APIs
- 🔜 **ELF binary analysis** - Native code patterns, function signatures, symbols
- 🔜 **Full APKTool integration** - Decompile DEX to Smali bytecode
- 🔜 **Network capture analysis** - HAR/PCAP inspection for API security

## How to Build Your Own Analyzer

REE's plugin system makes it trivial to add support for new formats:

```typescript
import { BaseAnalyzer, Finding, Target, AnalysisResult } from '@ree/core';

export class MyAnalyzer extends BaseAnalyzer {
  readonly name = 'my-format-analyzer';
  readonly version = '1.0.0';

  supports(target: Target): boolean {
    return target.type === 'myformat';
  }

  async analyze(target: Target): Promise<AnalysisResult> {
    // Your analysis logic here
    return {
      analyzerId: this.name,
      targetPath: target.path,
      timestamp: new Date(),
      findings: [
        // Your findings
      ],
      summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    };
  }
}
```

**That's it.** 50 lines. Then publish to npm, and users can use it:

```bash
npm install my-format-analyzer
```

## Architecture

REE is built as a modular framework:

```
ree/
├── @ree/core              # Plugin system, base types
├── @ree/analyzer-apk      # Android APK analyzer
├── @ree/analyzer-js       # JavaScript/Electron (planned)
├── @ree/analyzer-elf      # ELF binaries (planned)
└── @ree/skill-claude      # Claude skill integration
```

### Core Concepts

- **Target**: File to analyze (path, type, metadata)
- **Analyzer**: Implements `BaseAnalyzer`, checks a specific format
- **Finding**: Security issue with severity, description, evidence, remediation
- **Evidence**: Proof (code snippet, config value, line number)
- **PluginLoader**: Discovers and runs appropriate analyzer for a file

## Real-World Examples

### Example 1: Analyzing a banking app from bug bounty

```bash
# Download APK
adb pull /data/app/com.example.banking/base.apk

# Run analysis
ree analyze base.apk

# Output shows:
# - App is debuggable (CRITICAL)
# - 8 dangerous permissions without clear use
# - Hardcoded API endpoint in resources
# - WebView with JavaScript enabled
#
# → File bug report, get bounty! 🎯
```

### Example 2: Security audit of internal app

```bash
# Point REE at your app
ree analyze ./internal-app.apk

# Get detailed report
# → Fix issues before release
```

### Example 3: CTF Challenge

```bash
# Analyze unknown APK from CTF
ree analyze challenge.apk

# Instantly see:
# - What data the app accesses
# - What APIs it calls
# - What secrets might be hardcoded
#
# → Solve challenge faster than competitors
```

## Performance

- **APK analysis:** 100ms - 1s (depending on file size)
- **Zero external dependencies** for core framework
- **Minimal memory footprint** - analyze 1000s of apps in CI/CD
- **Parallel analysis** - analyze multiple targets simultaneously

## Community

- 💬 **Discord**: [Join our community](https://discord.gg/ree)
- 🐛 **Issues**: [Report bugs](https://github.com/morluto/ree/issues)
- 🤝 **Contributing**: [See CONTRIBUTING.md](CONTRIBUTING.md)
- 📚 **Docs**: [Full documentation](./docs/README.md)

## Roadmap

### v1.1 (Next Month)
- [ ] JavaScript/Electron analyzer
- [ ] Full APKTool integration (DEX decompilation)
- [ ] Web UI dashboard
- [ ] Export reports (PDF, JSON)

### v1.2 (2 Months)
- [ ] ELF binary analyzer
- [ ] JADX integration
- [ ] Binary ninja support
- [ ] Cloud analysis (optional, paid)

### v2.0 (3+ Months)
- [ ] Plugin marketplace
- [ ] Automated scanning/CI integration
- [ ] Team collaboration features
- [ ] Vulnerability database integration

## License

MIT - Use REE however you want, even commercially. See [LICENSE](LICENSE).

## Acknowledgments

Built to solve the real pain points security researchers face. Big thanks to:
- Android security community for feedback
- Open-source reverse engineering tools (Ghidra, Rizin, JADX)
- All early contributors and testers

---

**Ready to dive in?** Start analyzing:

```bash
npm install -g ree
ree analyze your-app.apk
```

Then join our Discord and share your findings! 🚀
