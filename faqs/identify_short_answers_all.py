#!/usr/bin/env python3
import re

def analyze_answers(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Find all FAQ items - first answer paragraph after each question
    faq_items = re.findall(r'<h3 class="faq-question">(.*?)</h3>\s*<p class="faq-answer">(.*?)</p>', content, re.DOTALL)
    
    print(f"\n=== {filename} ===")
    
    short_answers = []
    for i, (question, answer) in enumerate(faq_items, 1):
        # Clean up the answer text for accurate length
        clean_answer = re.sub(r'<[^>]+>', '', answer).strip()
        length = len(clean_answer)
        
        if length < 250:
            short_answers.append((i, question.strip(), answer.strip(), length))
            print(f"✗ Q{i} ({length} chars): {question.strip()[:50]}...")
    
    print(f"Total short answers: {len(short_answers)}")
    return short_answers

# Analyze all files
files = [
    'ai-bias-fairness-faq.html',
    'ai-jobs-workplace-faq.html', 
    'ai-privacy-surveillance-faq.html',
    'ai-consciousness-souls-faq.html'
]

for file in files:
    analyze_answers(file)