#!/usr/bin/env python3

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove the wrongly inserted card at the end (it's in the JavaScript)
# Find and remove lines containing the deepfakes card that are after line 260
cleaned_lines = []
in_wrong_card = False
for i, line in enumerate(lines):
    # Skip the wrongly placed card
    if i > 260 and 'deepfakes-misinformation.html' in line:
        in_wrong_card = True
    if in_wrong_card and '</a>' in line:
        in_wrong_card = False
        continue
    if not in_wrong_card:
        cleaned_lines.append(line)

# Now insert the card in the correct location - after line 259 (the ai-jobs card)
# Line 259 is index 258 in 0-based array
# We need to find the closing </a> for that card and insert after it

deepfakes_card = '''
            <a href="deepfakes-misinformation.html" class="faq-card">
                <div class="faq-card-icon">🎭</div>
                <h2 class="faq-card-title">Deepfakes, Misinformation & Truth</h2>
                <p class="faq-card-description">Catholic response to AI deception and protecting reality in the digital age. Vatican guidance on recognizing deepfakes and defending truth.</p>
                <span class="faq-card-arrow">→</span>
            </a>
'''

# Find the ai-jobs card closing tag and insert after it
output = []
found_jobs_card = False
for i, line in enumerate(cleaned_lines):
    output.append(line)
    if 'ai-jobs-catholic-teaching.html' in line:
        found_jobs_card = True
    if found_jobs_card and '</a>' in line:
        output.append(deepfakes_card + '\n')
        found_jobs_card = False

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(output)

print("✅ Fixed card insertion in correct location")
