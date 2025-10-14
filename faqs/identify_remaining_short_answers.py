#!/usr/bin/env python3
"""
Identify remaining answers that are 150-249 chars (not critical but could be better)
"""
from bs4 import BeautifulSoup

pages_with_low_avg = [
    'ai-bias-fairness.html',
    'ai-consciousness-souls.html', 
    'ai-healthcare.html'
]

all_short_answers = []

for filename in pages_with_low_avg:
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    print(f"\n{'='*80}")
    print(f"{filename}")
    print(f"{'='*80}\n")
    
    questions = soup.find_all('h3', class_='faq-question')
    
    for i, q in enumerate(questions, 1):
        question_text = q.text.strip()
        
        # Get all answer paragraphs for this question
        answer_parts = []
        sibling = q.find_next_sibling()
        while sibling and sibling.name != 'h3':
            if sibling.name == 'p' and 'faq-answer' in sibling.get('class', []):
                answer_parts.append(sibling.text.strip())
            sibling = sibling.find_next_sibling()
        
        total_answer_text = ' '.join(answer_parts)
        answer_length = len(total_answer_text)
        
        if 150 <= answer_length < 250:
            print(f"⚠️  Q{i} ({answer_length} chars): {question_text[:70]}...")
            all_short_answers.append((filename, i, question_text, answer_length))

print(f"\n{'='*80}")
print(f"SUMMARY: {len(all_short_answers)} answers are 150-249 chars")
print(f"{'='*80}")

if all_short_answers:
    print("\nDo you want to expand these? They're not critical (all above 150 chars)")
    print("Options:")
    print("  A) Expand all of them now (thorough)")
    print("  B) Leave them - 150+ chars is acceptable for LLMs")
    print("  C) Just expand the ones under 200 chars")
else:
    print("\n✅ No answers found in the 150-249 char range!")

