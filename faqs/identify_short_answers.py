#!/usr/bin/env python3
import re

def analyze_answers(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Find all FAQ items
    faq_items = re.findall(r'<h3 class="faq-question">(.*?)</h3>\s*<p class="faq-answer">(.*?)</p>', content, re.DOTALL)
    
    print(f"=== {filename} - Answer Length Analysis ===\n")
    
    short_answers = []
    for i, (question, answer) in enumerate(faq_items, 1):
        # Clean up the answer text for accurate length
        clean_answer = re.sub(r'<[^>]+>', '', answer).strip()
        length = len(clean_answer)
        
        status = "✓" if length >= 250 else "✗"
        print(f"{status} Q{i}: {question.strip()[:60]}...")
        print(f"   Length: {length} chars")
        
        if length < 250:
            short_answers.append((i, question.strip(), answer.strip(), length))
        print()
    
    if short_answers:
        print(f"\nFound {len(short_answers)} answers that need expansion (under 250 chars)")
    else:
        print("\nAll answers are 250+ characters!")
    
    return short_answers

# Analyze ai-healthcare-faq.html
short_answers = analyze_answers('ai-healthcare-faq.html')