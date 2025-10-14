#!/usr/bin/env python3

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all occurrences of the bias card
import re
bias_cards = list(re.finditer(r'<a href="ai-bias-fairness\.html".*?</a>', content, re.DOTALL))

if len(bias_cards) > 1:
    # Remove all but the first occurrence
    for match in reversed(bias_cards[1:]):
        content = content[:match.start()] + content[match.end():]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Removed {len(bias_cards) - 1} duplicate bias card(s)")
else:
    print("✅ No duplicates found")
