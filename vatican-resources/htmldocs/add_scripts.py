#!/usr/bin/env python3
with open('antiqua-et-nova-2025.html', 'r') as f:
    content = f.read()

# Add scripts before </body>
scripts = '''    <script src="../../js/dcf-core.js"></script>
    <script src="../../js/dcf-ui.js"></script>
    <script src="../../js/dcf-auth.js"></script>
    <script src="../../js/dcf-analytics.js"></script>
    <script src="../../js/dcf-init.js"></script>
'''

content = content.replace('</body>', scripts + '\n</body>')

with open('antiqua-et-nova-2025.html', 'w') as f:
    f.write(content)

print("✅ Added DCF scripts")
