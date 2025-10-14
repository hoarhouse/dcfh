#!/usr/bin/env python3
"""
Find and fix non-natural language questions in ai-healthcare.html
"""
from bs4 import BeautifulSoup

filename = 'ai-healthcare.html'

with open(filename, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

questions = soup.find_all('h3', class_='faq-question')

print("="*80)
print("ANALYZING QUESTIONS IN ai-healthcare.html")
print("="*80)

natural_starters = ['what', 'why', 'how', 'can', 'should', 'does', 'is', 'are', 'will', 'do']

non_natural = []
for i, q in enumerate(questions, 1):
    q_text = q.text.strip()
    first_word = q_text.lower().split()[0]
    
    if first_word not in natural_starters:
        print(f"\n❌ Q{i}: {q_text}")
        print(f"   First word: '{first_word}' - not natural language")
        non_natural.append((i, q_text))
    else:
        print(f"✅ Q{i}: {q_text[:70]}...")

print(f"\n{'='*80}")
print(f"Found {len(non_natural)} questions that need rewording")
print(f"{'='*80}")

if non_natural:
    print("\nSuggested rewording:")
    for i, q_text in non_natural:
        if q_text.startswith("Vatican"):
            print(f"\nQ{i}: {q_text}")
            print(f"  → What does the Vatican teach about...")
        elif q_text.startswith("Catholic"):
            print(f"\nQ{i}: {q_text}")
            print(f"  → What does Catholic teaching say about...")
        else:
            print(f"\nQ{i}: {q_text}")
            print(f"  → How should we think about...")

