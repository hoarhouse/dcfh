with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Find the Most Used FAQs card and add the All FAQs link
old_faqs = '''                        <li><a href="../faqs/ai-consciousness-souls.html">Can AI Be Conscious? Church Teaching</a></li>
                    </ul>
                </div>

                <div class="collection-card">'''

new_faqs = '''                        <li><a href="../faqs/ai-consciousness-souls.html">Can AI Be Conscious? Church Teaching</a></li>
                        <li><a href="../faqs/index.html" style="font-weight: 600; color: #000;">→ View All FAQs</a></li>
                    </ul>
                </div>

                <div class="collection-card">'''

content = content.replace(old_faqs, new_faqs)

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Added 'View All FAQs' link to Most Used FAQs card")
