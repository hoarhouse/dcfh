#!/usr/bin/env python3
"""
Add htmldoc links to all Vatican FAQ files
Inserts "Additional Resources" section with links to related htmldocs
"""

import os

# Define mappings of FAQ files to their related htmldocs
faq_htmldoc_mappings = {
    'vatican-rome-call-ai-ethics-faq.html': [
        ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call Update January 2023'),
        ('pope-francis-rome-call-meeting-january-2023.html', 'Rome Call Meeting Report 2023'),
    ],
    
    'vatican-minerva-dialogues-2023-faq.html': [
        ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues Full Analysis'),
        ('pope-leo-xiv-tech-executives-vatican-june-2025.html', 'Future Vatican-Tech Executive Dialogue'),
    ],
    
    'vatican-communications-ai-wisdom-2024-faq.html': [
        ('pope-francis-world-communications-day-2024.html', 'World Communications Day 2024 Full Text'),
        ('pope-francis-world-communications-day-2023.html', 'World Communications Day 2023 Message'),
        ('towards-full-presence-social-media-2023.html', 'Towards Full Presence: Social Media Guidance'),
    ],
    
    'vatican-g7-ai-address-2024-faq.html': [
        ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI Analysis'),
        ('pope-francis-paris-ai-summit-february-2025.html', 'Paris AI Summit Follow-up'),
    ],
    
    'vatican-wef-ai-message-2025-faq.html': [
        ('pope-francis-paris-ai-summit-february-2025.html', 'Paris AI Summit on Economic Ethics'),
        ('pope-leo-xiv-ai-ethics-conference-june-2025.html', 'Future AI Ethics Conference Preview'),
    ],
    
    'vatican-un-security-council-ai-2025-faq.html': [
        ('pope-leo-xiv-un-ai-summit-july-2025.html', 'UN AI Summit Future Developments'),
        ('pope-francis-paris-ai-summit-february-2025.html', 'International AI Cooperation Framework'),
    ],
    
    'vatican-ai-peace-2024-faq.html': [
        ('pope-francis-paris-ai-summit-february-2025.html', 'Paris Summit on AI and Peace'),
        ('pope-leo-xiv-un-ai-summit-july-2025.html', 'UN Peace and AI Initiatives'),
    ],
    
    'vatican-ai-wisdom-faq.html': [
        ('antiqua-et-nova-2025.html', 'Antiqua et Nova: Ancient Wisdom for New Technology'),
        ('benedict-xvi-digital-culture-2011.html', 'Benedict XVI on Digital Culture Foundations'),
    ],
    
    'vatican-common-good-digital-age-2019-faq.html': [
        ('church-and-internet-2002.html', 'Church and Internet: Early Foundations'),
        ('ethics-in-internet-2002.html', 'Ethics in Internet: Fundamental Principles'),
        ('benedict-xvi-digital-culture-2011.html', 'Benedict XVI on Digital Culture Development'),
    ],
    
    'vatican-child-dignity-digital-world-2019-faq.html': [
        ('pope-leo-xiv-digital-missionaries-influencers-july-2025.html', 'Digital Missionaries and Youth Engagement'),
        ('towards-full-presence-social-media-2023.html', 'Social Media and Youth Protection'),
    ],
    
    'vatican-peace-2022-education-work-faq.html': [
        ('antiqua-et-nova-2025.html', 'Education and Wisdom in Digital Age'),
        ('benedict-xvi-digital-culture-2011.html', 'Digital Education Foundations'),
    ],
    
    'vatican-ai-question-of-meaning-faq.html': [
        ('antiqua-et-nova-2025.html', 'Meaning and Wisdom in Technology'),
        ('pope-leo-xiv-cardinals-address-may-2025.html', 'Spiritual Dimensions of AI'),
    ],
}

def create_additional_resources_section(htmldocs):
    """Create the Additional Resources section HTML"""
    
    section = """
        <!-- Additional Resources from Vatican Archives -->
        <div class="faq-section" id="additional-resources">
            <h2>Additional Resources</h2>
            
            <div class="faq-item">
                <h3 class="faq-question">Where can I find more detailed analysis and related documents?</h3>
                <p class="faq-answer">For deeper understanding of these topics, explore these additional Vatican documents and analyses:</p>
                
                <ul class="faq-answer">
"""
    
    for filename, title in htmldocs:
        section += f'                    <li><a href="../vatican-resources/htmldocs/{filename}" style="color: #0066cc; text-decoration: none; font-weight: 600;">{title}</a></li>\n'
    
    section += """                </ul>
                
                <p class="faq-answer">These documents provide additional context, historical development, and future directions for Vatican teaching on AI and technology.</p>
            </div>
        </div>
"""
    
    return section

def add_htmldoc_links(faq_file, htmldocs):
    """Add htmldoc links to a FAQ file"""
    
    # Read the FAQ file
    with open(faq_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if Additional Resources already exists
    if 'id="additional-resources"' in content:
        print(f"  ⚠️  {faq_file} already has Additional Resources section")
        return False
    
    # Create the new section
    new_section = create_additional_resources_section(htmldocs)
    
    # Find insertion point (before Related FAQs Section)
    insertion_marker = '        <!-- Related FAQs Section -->'
    
    if insertion_marker not in content:
        print(f"  ❌ Could not find insertion point in {faq_file}")
        return False
    
    # Insert the new section
    content = content.replace(insertion_marker, new_section + '\n' + insertion_marker)
    
    # Write back the file
    with open(faq_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    """Process all FAQ files"""
    
    print("Adding htmldoc links to Vatican FAQ files...")
    print("=" * 50)
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for faq_file, htmldocs in faq_htmldoc_mappings.items():
        print(f"\nProcessing {faq_file}:")
        
        if not os.path.exists(faq_file):
            print(f"  ❌ File not found")
            error_count += 1
            continue
        
        if add_htmldoc_links(faq_file, htmldocs):
            print(f"  ✅ Added {len(htmldocs)} htmldoc links")
            success_count += 1
        else:
            skip_count += 1
    
    print("\n" + "=" * 50)
    print(f"Summary:")
    print(f"  ✅ Updated: {success_count} files")
    print(f"  ⚠️  Skipped: {skip_count} files")
    print(f"  ❌ Errors: {error_count} files")
    
    # Also create a reference list of all Pope Leo XIV documents
    print("\n" + "=" * 50)
    print("Pope Leo XIV Documents (Future Pope) - Available for all FAQs:")
    leo_docs = [
        'pope-leo-xiv-ai-ethics-conference-june-2025.html',
        'pope-leo-xiv-cardinals-address-may-2025.html',
        'pope-leo-xiv-digital-missionaries-influencers-july-2025.html',
        'pope-leo-xiv-media-address-may-2025.html',
        'pope-leo-xiv-tech-executives-vatican-june-2025.html',
        'pope-leo-xiv-un-ai-summit-july-2025.html',
    ]
    for doc in leo_docs:
        print(f"  - {doc}")

if __name__ == "__main__":
    main()