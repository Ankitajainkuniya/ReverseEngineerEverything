# ReverseEngineerEverything (REE)

Analyze Android apps for security issues in 30 seconds. No setup. No $3K tools. No PhD required.

---

## The Problem

I was hunting for Android vulnerabilities one day and realized I was spending 90% of my time on setup:
- Install Ghidra? 30 minutes
- Get IDA Pro working? Another hour, plus $3,000
- Set up all the dependencies? Hours of pain
- Actually analyze an APK? Finally! (After 2+ hours)

There had to be a better way.

**REE is that better way.**

## The Solution

```bash
npm install -g ree
ree analyze app.apk
```

That's it. Results in 30 seconds. No setup, no config, no pain.

## Who's This For?

- **Bug bounty hunters** who want to analyze 10x more apps in the same time
- **Security researchers** who are tired of tool setup taking longer than analysis
- **Android devs** who want to audit their own apps without learning Ghidra
- **Students** who want to learn security without the gatekeeping
- **Anyone** who wants to find vulnerabilities without the BS

## How It Compares

Real talk - REE isn't trying to replace the heavy hitters like Ghidra or IDA. Those are industrial-grade tools for serious reversing. REE is different:

| What I Want | REE Says | Ghidra Says | IDA Says |
|------------|----------|------------|----------|
| Quick Android audit | Done (30s) | Set up for 2 hours first | Pay $3K then wait |
| Find common vulns | Yep! | Maybe, after learning |  Kinda, but slow |
| No setup headache | Zero config | Install Java, Ghidra, dependencies... | License activation, pray |
| AI to explain issues | Claude explains | Read docs yourself | Buy Copilot extra |

**The honest comparison:** 
- REE: Fast, focused, accessible. Good for finding common Android issues quickly.
- Ghidra: Free, powerful, complex. Great if you want to do deep binary analysis.
- IDA: The professional standard. Worth it if you're doing this for a living.

Pick REE if you want results in seconds. Pick Ghidra/IDA if you want to spend days but understand everything.

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
