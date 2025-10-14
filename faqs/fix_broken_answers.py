#!/usr/bin/env python3
"""
Fix the 0-character answers in ai-jobs page
"""
from bs4 import BeautifulSoup

filename = 'ai-jobs-catholic-teaching.html'

with open(filename, 'r', encoding='utf-8') as f:
    html = f.read()

# Find Q8 and Q9 and check what's wrong
soup = BeautifulSoup(html, 'html.parser')
questions = soup.find_all('h3', class_='faq-question')

print("Checking ai-jobs-catholic-teaching.html for broken answers:\n")

for i, q in enumerate(questions[7:10], 8):  # Q8, Q9, Q10
    question_text = q.text.strip()
    print(f"Q{i}: {question_text}")
    
    # Check next sibling
    sibling = q.find_next_sibling()
    if sibling:
        print(f"  Next element: {sibling.name} with classes: {sibling.get('class')}")
        if sibling.name == 'p':
            print(f"  Text length: {len(sibling.text.strip())}")
            print(f"  First 100 chars: {sibling.text.strip()[:100]}")
    print()

