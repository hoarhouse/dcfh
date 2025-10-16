with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Replace first card with image
old_card_1 = '''                <div class="resource-card" onclick="window.location.href='../blog/the-wisdom-brief/the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code.html'">
                    <div class="resource-meta">
                        <span class="meta-badge blog">The Wisdom Brief</span>
                    </div>
                    <h3 class="resource-title">The Vatican's AI Revolution: How Rome Got Big Tech to Sign a Moral Code</h3>
                    <p class="resource-description">The story of how the Vatican brought together tech giants to commit to ethical AI principles.</p>
                </div>'''

new_card_1 = '''                <div class="resource-card" onclick="window.location.href='../blog/the-wisdom-brief/the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code.html'">
                    <img src="https://atzommnkkwzgbktuzjti.supabase.co/storage/v1/object/public/media/posts/1760267419100-sollange-brenis-oCDvUGPSy94-unsplash__1_.jpg" alt="The Vatican's AI Revolution" class="resource-image">
                    <div class="resource-content">
                        <div class="resource-meta">
                            <span class="meta-badge blog">The Wisdom Brief</span>
                        </div>
                        <h3 class="resource-title">The Vatican's AI Revolution: How Rome Got Big Tech to Sign a Moral Code</h3>
                        <p class="resource-description">The story of how the Vatican brought together tech giants to commit to ethical AI principles.</p>
                    </div>
                </div>'''

content = content.replace(old_card_1, new_card_1)

# Update CSS for resource-card to match article-card style
old_css = '''.resource-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #e5e5e5;
        }'''

new_css = '''.resource-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: box-shadow 0.3s ease;
            border: 1px solid #e5e5e5;
        }'''

content = content.replace(old_css, new_css)

# Add new CSS for images and content wrapper
insert_point = content.find('.resource-card:hover {')
new_styles = '''.resource-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
            display: block;
            background: #f0f0f0;
        }

        .resource-content {
            padding: 1.25rem;
        }

        '''

content = content[:insert_point] + new_styles + content[insert_point:]

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Updated first card with image")
