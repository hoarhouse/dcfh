with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Add value attributes to all checkboxes matching tag slugs
checkbox_mappings = {
    'Official Church Documents': 'official-church-documents',
    'Educational Materials': 'educational-materials',
    'Scholarly Works': 'scholarly-works',
    'Practical Guides': 'practical-guides',
    'FAQs & Q&A': 'faqs-qa',
    'Articles & Essays': 'articles-essays',
    'Interfaith Perspectives': 'interfaith-perspectives',
    'AI Ethics & Philosophy': 'ai-ethics-philosophy',
    'Healthcare & Medicine': 'healthcare-medicine',
    'Work & Economy': 'work-economy',
    'Education & Formation': 'education-formation',
    'Warfare & Security': 'warfare-security',
    'Environment & Creation': 'environment-creation',
    'Social Issues': 'social-issues',
    'Governance & Policy': 'governance-policy',
    'Theological Perspectives': 'theological-perspectives',
    'K-12 Students': 'k12-students',
    'K-12 Educators': 'k12-educators',
    'University Students': 'university-students',
    'University Faculty': 'university-faculty',
    'Parish Ministers': 'parish-ministers',
    'Business Leaders': 'business-leaders',
    'Tech Professionals': 'tech-professionals',
    'Policymakers': 'policymakers',
    'Healthcare Professionals': 'healthcare-professionals',
    'General Public': 'general-public',
    'Academic Researchers': 'academic-researchers',
    'Catholic': 'catholic',
    'Buddhist': 'buddhist',
    'Jewish': 'jewish',
    'Islamic': 'islamic',
    'Hindu': 'hindu',
    'Multi-faith/Comparative': 'multi-faith-comparative'
}

for label, slug in checkbox_mappings.items():
    # Find checkboxes followed by this label
    old_pattern = f'<input type="checkbox" style="transform: scale(1.2);">\n                                <span>{label}</span>'
    new_pattern = f'<input type="checkbox" value="{slug}" style="transform: scale(1.2);">\n                                <span>{label}</span>'
    content = content.replace(old_pattern, new_pattern)

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Added value attributes to checkboxes")
