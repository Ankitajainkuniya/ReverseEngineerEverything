# Quick Start Guide

Get REE running in 60 seconds.

## 1. Install (30 seconds)

```bash
npm install -g ree
```

Verify installation:
```bash
ree --help
```

Expected output:
```
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

For more info: https://github.com/Ankitajainkuniya/ReverseEngineerEverything
```

✅ **Done!** REE is installed.

---

## 2. Get a Test APK (15 seconds)

Option A: Download from Play Store
```bash
# Use a tool like `adb` to pull an APK:
adb pull /data/app/com.example.app/base.apk
```

Option B: Use a sample app
```bash
# Any Android APK will work
# For testing, you can download from APK Mirror or similar
```

Option C: Build one yourself
```bash
# Android Studio → Build → Build APK
```

---

## 3. Run Analysis (15 seconds)

```bash
ree analyze your-app.apk
```

### Example Output

```
============================================================
📊 Analysis Complete
============================================================

File: /path/to/your-app.apk
Analyzer: apk-analyzer
Timestamp: 2024-10-25T12:34:56.789Z

📈 Summary:
   Total findings: 7
   🔴 Critical: 2
   🟠 High: 3
   🟡 Medium: 2
   🔵 Low: 0
   ⚪ Info: 0

1. App is Debuggable
   Severity: CRITICAL
   The android:debuggable flag is enabled in production. Attackers can easily inspect and modify the app at runtime.
   CWE: CWE-489
   Evidence:
     - android:debuggable="true"

2. Dangerous Permissions Detected
   Severity: HIGH
   The app requests 5 dangerous permissions that could access sensitive user data.
   CWE: CWE-250
   Evidence:
     - android.permission.CAMERA
     - android.permission.ACCESS_FINE_LOCATION
     - android.permission.READ_CONTACTS
     - android.permission.READ_SMS
     - android.permission.INTERNET

3. Exported Components Without Protection
   Severity: MEDIUM
   Found 2 exported components that can be accessed by other apps.
   CWE: CWE-927
   Evidence:
     - com.example.app.MainActivity (exported)
     - com.example.app.AppService (exported)

4. Hardcoded Secrets Detected
   Severity: CRITICAL
   Found 1 potential hardcoded secrets in configuration files.
   CWE: CWE-798
   Evidence:
     - API Key pattern found in res/values/strings.xml

[... more findings ...]

============================================================
✨ Use with Claude for AI-powered analysis!
============================================================
```

---

## 4. Understand Findings

Each finding includes:

- **Severity**: How serious is this?
  - 🔴 **Critical** - Immediate security risk
  - 🟠 **High** - Significant vulnerability
  - 🟡 **Medium** - Should be fixed
  - 🔵 **Low** - Minor issue
  - ⚪ **Info** - Informational

- **Title** - What is the issue?

- **Description** - Why is this a problem?

- **CWE** - Common Weakness Enumeration reference (https://cwe.mitre.org/)

- **Evidence** - Where was this found?

---

## 5. Get AI Explanations (Optional)

Share findings with Claude to get explanations:

### Option 1: In Claude Code / Cursor

1. Open Claude Code / Cursor in your IDE
2. Ask: "Analyze this APK and explain the vulnerabilities"
3. Share the REE output
4. Claude explains each finding

### Option 2: In Claude.ai (Web)

1. Go to claude.ai
2. Paste your `ree analyze` output
3. Ask: "What are the security implications of these findings?"
4. Get detailed explanations

### Example Exchange

```
You: I analyzed an Android app with REE. Here are the findings:
[paste ree analyze output]

Claude: I can see several security issues here:

1. **Debuggable Build (CRITICAL)** - This is the most serious. 
   An attacker can use Android Debug Bridge (adb) to inspect the app's 
   memory, intercept function calls, and modify behavior at runtime.
   
   Fix: Remove android:debuggable="true" from AndroidManifest.xml 
   before publishing to Play Store.

2. **Excessive Permissions (HIGH)** - The app requests Camera, Location, 
   and Contacts access. Make sure...

[Claude provides detailed explanations]
```

---

## 6. Common Next Steps

### For Bug Bounty Hunters

```bash
# Analyze the app
ree analyze target-app.apk

# Get Claude explanation
# (share output in Claude or use skill)

# File bug report with findings + evidence
# Collect bounty! 💰
```

### For Developers (Auditing Your App)

```bash
# Analyze your app's debug build
ree analyze app-debug.apk

# Fix the issues found
# - Remove debuggable flag in release build
# - Minimize permissions
# - Protect exported components

# Re-analyze release build
ree analyze app-release.apk

# Should have fewer findings ✅
```

### For Security Researchers

```bash
# Batch analyze multiple apps
for app in *.apk; do
  echo "Analyzing $app..."
  ree analyze "$app" >> results.txt
done

# Share results
# Contribute findings to disclosure programs
```

### For CI/CD Integration

```bash
# GitHub Actions example
- name: Security scan
  run: |
    npm install -g ree
    ree analyze build/app.apk
```

---

## 7. Explore More Features

### List available analyzers

```bash
ree list
```

Output:
```
📦 Available Analyzers:

  apk-analyzer (v1.0.0)
```

(More analyzers coming in v1.1+)

### Export findings to file

```bash
# Save to text file
ree analyze app.apk > findings.txt

# Save to pipe to another tool
ree analyze app.apk | grep CRITICAL
```

### Analyze in batch

```bash
# Analyze all APKs in directory
for app in *.apk; do
  echo "=== Analyzing $app ==="
  ree analyze "$app"
done
```

---

## 8. What's Next?

### Learn More
- 📖 Read **README.md** for full documentation
- ❓ Check **FAQ.md** for common questions
- 🆘 See **TROUBLESHOOTING.md** if something fails
- 🔄 Read **COMPARISON_WITH_REA.md** to understand positioning

### Contribute
- 🚀 Build your own analyzer: See **CONTRIBUTING.md**
- 🐛 Report bugs: Open a GitHub issue
- 💡 Request features: Use feature request template

### Stay Updated
- ⭐ Star the repo: https://github.com/Ankitajainkuniya/ReverseEngineerEverything
- 👀 Watch releases: Enable notifications on GitHub
- 💬 Join community: Discord link coming soon

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| `ree: command not found` | See TROUBLESHOOTING.md |
| "APK Analyzer not available" | Run `npm install -g ree@latest` |
| No findings detected | Check if APK is valid with `unzip -t app.apk` |
| Analysis hangs | APK might be >500MB; very large files are slow |

---

## Performance Expectations

| APK Size | Time | Notes |
|----------|------|-------|
| <20MB | ~100ms | Very fast |
| 20-100MB | ~300ms | Standard |
| 100-300MB | ~1s | Acceptable |
| 300-500MB | ~5s | Slow |
| >500MB | ~10s+ | Known limitation |

---

## Tips for Best Results

1. **Test with known vulnerable apps first** - Confirm it works
2. **Use release APKs when possible** - More realistic findings
3. **Always verify findings** - REE is pattern-based, not perfect
4. **Share with Claude** - AI explanations are powerful
5. **Report issues** - Help us improve!

---

## You're Ready! 🚀

You now know how to:
- ✅ Install REE
- ✅ Analyze APKs
- ✅ Understand findings
- ✅ Get AI explanations
- ✅ Use in your workflow

**Next:** Analyze your first app and find some vulnerabilities!

---

**Questions?** Check FAQ.md or open an issue on GitHub.
