# Frequently Asked Questions

## Installation & Setup

### Q: Do I need Ghidra, IDA, or other tools?
**A:** No! REE works completely standalone. Just `npm install -g ree` and you're done. No external dependencies.

### Q: What version of Node.js do I need?
**A:** Node.js 18.0.0 or higher. Check with `node --version`. 
Install from: https://nodejs.org/

### Q: Can I use Bun instead of npm?
**A:** Not yet, but it's planned. Stick with npm for now.

### Q: Does it work on Windows/Mac/Linux?
**A:** Yes to all! Works on any system with Node.js.

### Q: Why is installation failing?
**A:** See TROUBLESHOOTING.md for common issues. Most common: Node version too old.

---

## Features & Capabilities

### Q: What can REE analyze?
**A:** In v1.0: Android APK files only.
Coming soon: JavaScript/Electron (v1.1), ELF binaries (v1.2).

### Q: Can it analyze [format]?
**A:** 
- ✅ Android APK - Yes, MVP
- ✅ Android App Bundle (.aab) - Soon
- 🔜 JavaScript/Electron - v1.1
- 🔜 ELF binaries - v1.2
- 🔜 Web captures (HAR) - v1.2

See roadmap in README.md.

### Q: How accurate is the detection?
**A:** ~85% for major vulnerabilities (debuggable, dangerous permissions). Some false positives on pattern-based detections (secrets). REA has higher accuracy (~95%), but REE is designed for speed not perfection.

### Q: Can it decompile DEX to Java/Smali?
**A:** Not in v1.0. That's coming in v1.1 with JADX integration.

### Q: Does it do dynamic analysis?
**A:** No, REE is static analysis only. Dynamic analysis planned for future versions.

---

## Comparison with REA

### Q: How is REE different from REA?
**A:** See COMPARISON_WITH_REA.md for detailed comparison. Quick answer:
- REE: Fast (30s), simple, APK-focused, AI-integrated
- REA: Comprehensive (10+ formats), slower (2+ hours setup), deeper analysis

### Q: Should I use REE or REA?
**A:** 
- Use **REE** if you want quick Android APK analysis (bug bounties, dev audits)
- Use **REA** if you need multiple formats or deep binary analysis

Both are great. Different tools for different jobs.

### Q: Will REE replace REA?
**A:** No. REE is faster for APKs, REA is more comprehensive overall. They complement each other.

---

## Usage & Analysis

### Q: Why is my APK showing no findings?
**A:** Possible reasons:
1. App is actually secure (rare but possible)
2. Permissions are obfuscated
3. Manifest couldn't be parsed (try with another APK)

Try with a known vulnerable app first.

### Q: Can I analyze multiple APKs at once?
**A:** Yes! Run in a loop or script:
```bash
for app in *.apk; do ree analyze "$app"; done
```

### Q: How do I export findings?
**A:** Currently prints to console. Pipe to file:
```bash
ree analyze app.apk > findings.txt
```
JSON export coming in v1.1.

### Q: Can I use this in CI/CD?
**A:** Yes! Perfect for CI/CD:
```yaml
- name: Security scan
  run: npm install -g ree && ree analyze app.apk
```

### Q: Why does it say "APK Analyzer not available"?
**A:** The @ree/analyzer-apk module isn't installed. Run `npm install @ree/analyzer-apk` or reinstall REE with `npm install -g ree@latest`.

---

## Claude Integration

### Q: Do I need Claude to use REE?
**A:** No. REE works standalone via CLI. Claude integration is optional and gives you AI explanations.

### Q: How do I use REE with Claude?
**A:** 
1. Use Claude Code / Cursor (IDE integration)
2. Use in Claude.ai directly (web interface)
3. Share output with Claude in chat

Coming soon: Formal skill registration.

### Q: Does Claude integration cost money?
**A:** Only if you don't have a Claude subscription. Free tier gets some usage; pay tier gets unlimited.

### Q: Why are explanations sometimes wrong?
**A:** Claude is powerful but not perfect. Always verify critical findings yourself. REE is a tool to assist, not replace human analysis.

---

## Community & Contributing

### Q: Can I build my own analyzer?
**A:** Yes! See CONTRIBUTING.md. Takes ~50 lines of code and you can publish to npm.

### Q: How do I report bugs?
**A:** Open an issue: https://github.com/Ankitajainkuniya/ReverseEngineerEverything/issues
Use the bug report template for best results.

### Q: How do I request a feature?
**A:** Open an issue with the feature request template.
Check roadmap first (might already be planned).

### Q: Is there a Discord server?
**A:** Discord link coming soon. We're building the community! 
For now, use GitHub Discussions.

### Q: Can I contribute?
**A:** Yes! See CONTRIBUTING.md. We welcome:
- Bug fixes
- New analyzers
- Documentation improvements
- Test cases

---

## Troubleshooting

### Q: I get "command not found: ree"
**A:** See TROUBLESHOOTING.md - likely npm installation issue.

### Q: Tests fail when I build locally
**A:** You might need Jest installed: `npm install --save-dev jest`
Then: `npm test`

### Q: APK parsing fails
**A:** Try with a different APK first (might be obfuscated/unusual).
Report issue with APK details (size, app name, if possible).

---

## Performance & Limits

### Q: How big can the APK be?
**A:** REE has been tested up to 500MB. Larger files may be slow.
Typical APK (20-100MB): <500ms.

### Q: Can I analyze thousands of APKs?
**A:** Yes! Parallelize with scripts:
```bash
parallel ree analyze ::: *.apk
```

### Q: Memory usage?
**A:** ~50MB per analysis. Very lightweight compared to REA.

---

## Business & Licensing

### Q: Is this free?
**A:** Yes, MIT license. Free to use, modify, distribute.

### Q: Can I use it commercially?
**A:** Yes, MIT license allows commercial use.

### Q: Will there be a paid tier?
**A:** Possibly in future (cloud analysis, dashboard). Core tool stays free.

### Q: Do you collect data?
**A:** No. REE is offline-first. No telemetry or tracking.

### Q: Can I use this for penetration testing?
**A:** Yes, for authorized testing. Always get written permission before analyzing anyone else's apps.

---

## What's Next?

### Q: What's coming in v1.1?
**A:** JavaScript/Electron analyzer, JADX integration, JSON export, web dashboard mockups.

### Q: When is v1.1 released?
**A:** Aiming for 4-6 weeks after v1.0 launch. No firm date yet.

### Q: How can I follow updates?
**A:** Watch the GitHub repo for releases: https://github.com/Ankitajainkuniya/ReverseEngineerEverything

### Q: Is there a mailing list?
**A:** Not yet. GitHub Discussions and releases are the best way to stay updated.

---

## Still Have Questions?

- 📖 See TROUBLESHOOTING.md for technical issues
- 🔍 Check existing GitHub issues
- 💬 Open a new GitHub Discussions post
- 🐛 Report bugs with the issue template
- 💡 Request features with the feature template

We're here to help! 🚀
