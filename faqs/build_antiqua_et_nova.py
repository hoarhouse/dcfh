#!/usr/bin/env python3
"""Build Antiqua et Nova Vatican resource page"""

# Read the template
with open('../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace metadata
html = html.replace(
    'LVII World Day of Peace 2024 - Artificial Intelligence and Peace',
    'Antiqua et Nova - Artificial Intelligence and Human Intelligence (2025)'
)

html = html.replace(
    "Pope's 2024 World Day of Peace message on peace, justice, and human dignity. Essential Catholic social teaching on building a more peaceful world.",
    "Vatican's comprehensive 2025 document on the relationship between artificial intelligence and human intelligence. Essential Catholic teaching on AI ethics, human dignity, and technology."
)

# Replace URLs
html = html.replace(
    'lvii-world-day-of-peace-2024-artificial-intelligence-and-peace',
    'antiqua-et-nova-2025'
)

# Update date
html = html.replace(
    '"datePublished": "2025-10-10T09:11:16.720375+00:00"',
    '"datePublished": "2025-01-28T00:00:00.000Z"'
)

# Write output
with open('../vatican-resources/antiqua-et-nova-2025.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Created antiqua-et-nova-2025.html")
print("Next: Manually add the full document content starting at line 2414")
