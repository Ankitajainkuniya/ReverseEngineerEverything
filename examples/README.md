# REE Examples

This directory contains examples of using ReverseEngineerEverything.

## Demo

See the framework in action:

```bash
npx ts-node demo.ts
```

This demonstrates:
- Initializing the REE framework
- Registering analyzers
- Example vulnerability findings
- Integration with Claude AI

## Real-world examples

### Analyze a downloaded APK

```bash
ree analyze Instagram.apk
```

Output shows all security issues found, with evidence and remediation advice.

### Use with Claude

In Claude Code or Cursor:

```
User: Analyze my-app.apk and tell me the top 3 security risks

Claude: [Uses REE analyzer]
"I found 7 security issues. The top 3 are:
1. App is debuggable - attackers can inspect it
2. Hardcoded API keys - credential exposure risk
3. Excessive permissions - access to sensitive user data"
```

## Contributing Examples

Have a great example? Open a PR! We'd love to showcase:
- Real-world vulnerability analysis
- Custom analyzer implementations
- Integration with other tools
- Security research techniques using REE
