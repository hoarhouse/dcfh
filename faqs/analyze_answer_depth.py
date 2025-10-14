#!/usr/bin/env python3
"""
Identify short answers that need expansion for LLM optimization
"""
from bs4 import BeautifulSoup

def analyze_page_answers(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    print(f"\n{'='*80}")
    print(f"{filename}")
    print(f"{'='*80}\n")
    
    questions = soup.find_all('h3', class_='faq-question')
    short_answers = []
    
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
        
        if answer_length < 250:
            short_answers.append((i, question_text, answer_length))
            print(f"❌ Q{i} ({answer_length} chars): {question_text[:60]}...")
    
    if not short_answers:
        print("✅ All answers are 250+ characters")
    else:
        print(f"\n📊 {len(short_answers)}/{len(questions)} answers need expansion")
    
    return len(short_answers)

# Analyze all FAQ files
faq_files = [
    'ai-bias-fairness.html',
    'ai-consciousness-souls.html',
    'ai-healthcare.html',
    'ai-jobs-catholic-teaching.html',
    'catholic-ai-ethics.html',
    'deepfakes-misinformation.html'
]

total_short = 0
for faq_file in faq_files:
    count = analyze_page_answers(faq_file)
    total_short += count

print(f"\n{'='*80}")
print(f"TOTAL: {total_short} answers across all pages need expansion to 250+ chars")
print(f"{'='*80}")

print("\n💡 RECOMMENDATION:")
print("This requires editorial work to add:")
print("  • More detailed explanations")
print("  • Additional context and examples")
print("  • Relevant Vatican quotes")
print("  • Real-world applications")
print("\nWould you like me to:")
print("  A) Generate expanded versions of the shortest answers")
print("  B) Create a template for manually expanding them")
print("  C) Skip this for now (least critical for LLM optimization)")
