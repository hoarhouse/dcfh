with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

# Card 2
old_2 = '''                <div class="resource-card" onclick="window.location.href='../blog/the-wisdom-brief/from-mushroom-clouds-to-machine-code-how-the-vatican-spent-35-years-preparing-fo.html'">
                    <div class="resource-meta">
                        <span class="meta-badge blog">The Wisdom Brief</span>
                    </div>
                    <h3 class="resource-title">From Mushroom Clouds to Machine Code: How the Vatican Spent 35 Years Preparing for AI</h3>
                    <p class="resource-description">The historical trajectory from nuclear weapons to AI ethics in Vatican teaching.</p>
                </div>'''

new_2 = '''                <div class="resource-card" onclick="window.location.href='../blog/the-wisdom-brief/from-mushroom-clouds-to-machine-code-how-the-vatican-spent-35-years-preparing-fo.html'">
                    <img src="https://atzommnkkwzgbktuzjti.supabase.co/storage/v1/object/public/media/posts/1760268008766-mushroomtomachinecode.png" alt="From Mushroom Clouds to Machine Code" class="resource-image">
                    <div class="resource-content">
                        <div class="resource-meta">
                            <span class="meta-badge blog">The Wisdom Brief</span>
                        </div>
                        <h3 class="resource-title">From Mushroom Clouds to Machine Code: How the Vatican Spent 35 Years Preparing for AI</h3>
                        <p class="resource-description">The historical trajectory from nuclear weapons to AI ethics in Vatican teaching.</p>
                    </div>
                </div>'''

content = content.replace(old_2, new_2)

# Card 3
old_3 = '''                <div class="resource-card" onclick="window.location.href='../blog/the-wisdom-brief/the-vaticans-warning-about-ai-and-the-end-of-work.html'">
                    <div class="resource-meta">
                        <span class="meta-badge blog">The Wisdom Brief</span>
                    </div>
                    <h3 class="resource-title">The Vatican's Warning About AI and the End of Work</h3>
                    <p class="resource-description">Catholic Social Teaching on automation, employment, and human dignity.</p>
                </div>'''

new_3 = '''                <div class="resource-card" onclick="window.location.href='../blog/the-wisdom-brief/the-vaticans-warning-about-ai-and-the-end-of-work.html'">
                    <img src="https://atzommnkkwzgbktuzjti.supabase.co/storage/v1/object/public/media/featured-media/featured_1760265586553.jpg" alt="The Vatican's Warning About AI and the End of Work" class="resource-image">
                    <div class="resource-content">
                        <div class="resource-meta">
                            <span class="meta-badge blog">The Wisdom Brief</span>
                        </div>
                        <h3 class="resource-title">The Vatican's Warning About AI and the End of Work</h3>
                        <p class="resource-description">Catholic Social Teaching on automation, employment, and human dignity.</p>
                    </div>
                </div>'''

content = content.replace(old_3, new_3)

# Card 4
old_4 = '''                <div class="resource-card" onclick="window.location.href='../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html'">
                    <div class="resource-meta">
                        <span class="meta-badge blog">Educational Materials</span>
                    </div>
                    <h3 class="resource-title">Implementing Vatican AI Ethics: A Practical Checklist</h3>
                    <p class="resource-description">Step-by-step guide for organizations seeking to align with Catholic AI ethics principles.</p>
                </div>'''

new_4 = '''                <div class="resource-card" onclick="window.location.href='../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html'">
                    <img src="https://atzommnkkwzgbktuzjti.supabase.co/storage/v1/object/public/media/featured-media/featured_1760281654216.png" alt="Implementing Vatican AI Ethics" class="resource-image">
                    <div class="resource-content">
                        <div class="resource-meta">
                            <span class="meta-badge blog">Educational Materials</span>
                        </div>
                        <h3 class="resource-title">Implementing Vatican AI Ethics: A Practical Checklist</h3>
                        <p class="resource-description">Step-by-step guide for organizations seeking to align with Catholic AI ethics principles.</p>
                    </div>
                </div>'''

content = content.replace(old_4, new_4)

# Card 5
old_5 = '''                <div class="resource-card" onclick="window.location.href='../blog/ethical-ai-educational-materials/the-future-of-ai-and-humanity-game-changing-or-game-over.html'">
                    <div class="resource-meta">
                        <span class="meta-badge blog">Educational Materials</span>
                    </div>
                    <h3 class="resource-title">The Future of AI and Humanity: Game-Changing or Game Over?</h3>
                    <p class="resource-description">Examining the existential questions surrounding artificial intelligence development.</p>
                </div>'''

new_5 = '''                <div class="resource-card" onclick="window.location.href='../blog/ethical-ai-educational-materials/the-future-of-ai-and-humanity-game-changing-or-game-over.html'">
                    <img src="https://atzommnkkwzgbktuzjti.supabase.co/storage/v1/object/public/media/posts/1759760678584-hassan-pasha-7SjEuEF06Zw-unsplash.jpg" alt="The Future of AI and Humanity" class="resource-image">
                    <div class="resource-content">
                        <div class="resource-meta">
                            <span class="meta-badge blog">Educational Materials</span>
                        </div>
                        <h3 class="resource-title">The Future of AI and Humanity: Game-Changing or Game Over?</h3>
                        <p class="resource-description">Examining the existential questions surrounding artificial intelligence development.</p>
                    </div>
                </div>'''

content = content.replace(old_5, new_5)

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Added images to all 5 Featured Article cards")
