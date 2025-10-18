#!/usr/bin/env python3
"""
Add Additional Resources sections to the 8 general FAQ files
Links to relevant htmldocs based on topic alignment
"""

import os

# Define mappings of general FAQ files to their related htmldocs
general_faq_mappings = {
    'catholic-ai-ethics.html': [
        ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call for AI Ethics - 2023 Update'),
        ('pope-francis-rome-call-meeting-january-2023.html', 'Rome Call Meeting Report'),
        ('church-and-internet-2002.html', 'Church and Internet - Foundational Teaching'),
        ('ethics-in-internet-2002.html', 'Ethics in Internet - Early Principles'),
    ],
    
    'ai-healthcare.html': [
        ('antiqua-et-nova-2025.html', 'Antiqua et Nova - Healthcare and Human Dignity'),
        ('pope-leo-xiv-ai-ethics-conference-june-2025.html', 'Future AI Ethics in Healthcare'),
        ('pope-francis-centesimus-annus-ai-june-2024.html', 'Social Teaching on AI and Healthcare'),
    ],
    
    'ai-consciousness-souls.html': [
        ('antiqua-et-nova-2025.html', 'Ancient Wisdom on Human Nature and Technology'),
        ('pope-leo-xiv-cardinals-address-may-2025.html', 'Theological Perspectives on AI Consciousness'),
        ('benedict-xvi-digital-culture-2011.html', 'Digital Culture and Human Identity'),
    ],
    
    'ai-jobs-catholic-teaching.html': [
        ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI Labor Issues'),
        ('pope-francis-paris-ai-summit-february-2025.html', 'Paris Summit on Work and AI'),
        ('pope-leo-xiv-tech-executives-vatican-june-2025.html', 'Tech Leaders on Employment'),
        ('benedict-xvi-digital-culture-2011.html', 'Digital Work and Human Dignity'),
    ],
    
    'deepfakes-misinformation.html': [
        ('pope-francis-world-communications-day-2024.html', 'Truth in the Age of AI - 2024'),
        ('pope-francis-world-communications-day-2023.html', 'Combating Digital Deception - 2023'),
        ('towards-full-presence-social-media-2023.html', 'Authentic Presence vs. Manipulation'),
        ('pope-leo-xiv-media-address-may-2025.html', 'Future of Media Ethics'),
    ],
    
    'ai-bias-fairness.html': [
        ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call on Algorithmic Justice'),
        ('pope-francis-paris-ai-summit-february-2025.html', 'International Cooperation on AI Fairness'),
        ('pope-leo-xiv-un-ai-summit-july-2025.html', 'UN Summit on AI and Equality'),
        ('ethics-in-internet-2002.html', 'Early Principles of Digital Justice'),
    ],
    
    'ai-privacy-surveillance.html': [
        ('towards-full-presence-social-media-2023.html', 'Privacy in Social Media Age'),
        ('pope-leo-xiv-digital-missionaries-influencers-july-2025.html', 'Digital Footprints and Privacy'),
        ('church-and-internet-2002.html', 'Church Teaching on Digital Privacy'),
        ('pope-francis-paris-ai-summit-february-2025.html', 'International Privacy Standards'),
    ],
    
    'ai-warfare-weapons.html': [
        ('pope-leo-xiv-un-ai-summit-july-2025.html', 'UN Summit on Autonomous Weapons'),
        ('pope-francis-paris-ai-summit-february-2025.html', 'International Security and AI'),
        ('pope-leo-xiv-ai-ethics-conference-june-2025.html', 'Ethics of Military AI'),
        ('pope-francis-centesimus-annus-ai-june-2024.html', 'Just War Theory and AI'),
    ],
}

def create_additional_resources_section(htmldocs):
    """Create the Additional Resources section HTML for general FAQs"""
    
    section = """
        <!-- Additional Resources from Vatican Archives -->
        <div class="faq-section" id="additional-resources">
            <h2>📚 Additional Vatican Resources</h2>
            
            <div class="faq-item">
                <h3 class="faq-question">Where can I find more Vatican documents on this topic?</h3>
                <p class="faq-answer">For deeper understanding from official Vatican sources, explore these documents:</p>
                
                <ul class="faq-answer">
"""
    
    for filename, title in htmldocs:
        section += f'                    <li><a href="../vatican-resources/htmldocs/{filename}" style="color: #0066cc; text-decoration: none; font-weight: 600;">{title}</a></li>\n'
    
    section += """                </ul>
                
                <p class="faq-answer">These documents provide official Vatican perspectives, historical context, and theological foundations for understanding AI ethics from a Catholic perspective.</p>
            </div>
        </div>
"""
    
    return section

def add_resources_to_faq(faq_file, htmldocs):
    """Add Additional Resources section to a general FAQ file"""
    
    # Read the FAQ file
    try:
        with open(faq_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"  ❌ File not found: {faq_file}")
        return False
    
    # Check if Additional Resources already exists
    if 'id="additional-resources"' in content:
        print(f"  ⚠️  {faq_file} already has Additional Resources section")
        return False
    
    # Create the new section
    new_section = create_additional_resources_section(htmldocs)
    
    # Find insertion point - try multiple patterns
    insertion_markers = [
        '        <!-- Related FAQs Section -->',
        '    <!-- Footer will be injected',
        '    <footer id="main-footer"',
        '</main>'
    ]
    
    inserted = False
    for marker in insertion_markers:
        if marker in content:
            content = content.replace(marker, new_section + '\n' + marker)
            inserted = True
            break
    
    if not inserted:
        print(f"  ❌ Could not find insertion point in {faq_file}")
        return False
    
    # Write back the file
    with open(faq_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    """Process all general FAQ files"""
    
    print("Adding Additional Resources to General FAQ files...")
    print("=" * 60)
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for faq_file, htmldocs in general_faq_mappings.items():
        print(f"\nProcessing {faq_file}:")
        
        if not os.path.exists(faq_file):
            print(f"  ❌ File not found")
            error_count += 1
            continue
        
        if add_resources_to_faq(faq_file, htmldocs):
            print(f"  ✅ Added {len(htmldocs)} htmldoc links")
            success_count += 1
        else:
            skip_count += 1
    
    print("\n" + "=" * 60)
    print(f"Summary:")
    print(f"  ✅ Updated: {success_count} files")
    print(f"  ⚠️  Skipped: {skip_count} files")
    print(f"  ❌ Errors: {error_count} files")
    
    print("\n" + "=" * 60)
    print("Topic Alignment Summary:")
    print("-" * 60)
    print("catholic-ai-ethics.html → Rome Call, Church foundations")
    print("ai-healthcare.html → Human dignity, social teaching")
    print("ai-consciousness-souls.html → Theological perspectives, wisdom")
    print("ai-jobs-catholic-teaching.html → Labor, work dignity, Centesimus Annus")
    print("deepfakes-misinformation.html → Communications Day, truth, media")
    print("ai-bias-fairness.html → Justice, equality, international cooperation")
    print("ai-privacy-surveillance.html → Privacy, social media, digital presence")
    print("ai-warfare-weapons.html → UN summit, security, just war theory")

if __name__ == "__main__":
    main()