# FAQ Linking Template - Standard Structure

## Additional Vatican Resources Section

```html
        <!-- Additional Resources from Vatican Archives -->
        <div class="faq-section" id="additional-resources">
            <h2>📚 Additional Vatican Resources</h2>
            
            <div class="faq-item">
                <h3 class="faq-question">Where can I find more Vatican documents on this topic?</h3>
                <p class="faq-answer">For deeper understanding from official Vatican sources, explore these documents:</p>
                
                <ul class="faq-answer">
                    <li><a href="../vatican-resources/htmldocs/[FILENAME].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Document Title]</a></li>
                    <li><a href="../vatican-resources/htmldocs/[FILENAME].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Document Title]</a></li>
                    <li><a href="../vatican-resources/htmldocs/[FILENAME].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Document Title]</a></li>
                    <li><a href="../vatican-resources/htmldocs/[FILENAME].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Document Title]</a></li>
                </ul>
                
                <p class="faq-answer">These documents provide official Vatican perspectives, historical context, and theological foundations for understanding AI ethics from a Catholic perspective.</p>
            </div>
        </div>
```

## Related FAQs Section

```html
        <!-- Related FAQs Section -->
        <div class="faq-section" id="related">
            <h2>Related FAQs</h2>
            <p class="faq-answer">Explore these related topics to deepen your understanding:</p>
            
            <ul class="faq-answer">
                <li><a href="[FAQ-FILE].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title]</a> - [Brief description]</li>
                <li><a href="[FAQ-FILE].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title]</a> - [Brief description]</li>
                <li><a href="[FAQ-FILE].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title]</a> - [Brief description]</li>
            </ul>
        </div>
```

## Back Link Section

```html
        <!-- Back Link -->
        <div class="faq-section">
            <a href="https://hoarhouse.github.io/dcfh/faqs/index.html" class="back-link">← Back to All FAQs</a>
        </div>
```

## Complete End Structure

```html
        </div> <!-- Closes last FAQ section -->

        <!-- Additional Resources from Vatican Archives -->
        <div class="faq-section" id="additional-resources">
            <h2>📚 Additional Vatican Resources</h2>
            
            <div class="faq-item">
                <h3 class="faq-question">Where can I find more Vatican documents on this topic?</h3>
                <p class="faq-answer">For deeper understanding from official Vatican sources, explore these documents:</p>
                
                <ul class="faq-answer">
                    <li><a href="../vatican-resources/htmldocs/[FILENAME].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[Document Title]</a></li>
                    <!-- Add more documents as needed -->
                </ul>
                
                <p class="faq-answer">These documents provide official Vatican perspectives, historical context, and theological foundations for understanding AI ethics from a Catholic perspective.</p>
            </div>
        </div>

        <!-- Related FAQs Section -->
        <div class="faq-section" id="related">
            <h2>Related FAQs</h2>
            <p class="faq-answer">Explore these related topics to deepen your understanding:</p>
            
            <ul class="faq-answer">
                <li><a href="[FAQ-FILE].html" style="color: #0066cc; text-decoration: none; font-weight: 600;">[FAQ Title]</a> - [Brief description]</li>
                <!-- Add more FAQs as needed -->
            </ul>
        </div>

        <!-- Back Link -->
        <div class="faq-section">
            <a href="https://hoarhouse.github.io/dcfh/faqs/index.html" class="back-link">← Back to All FAQs</a>
        </div>
    </main>

    <!-- Footer injected by dcf-ui.js -->
    <footer id="main-footer"></footer>

    <!-- Scripts - Load in this exact order -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../js/dcf-core.js"></script>
    <script src="../js/dcf-ui.js"></script>
    <script src="../js/dcf-auth.js"></script>
    <script src="../js/dcf-analytics.js"></script>
    <script src="../js/dcf-init.js"></script>
    <script src="../js/faq-components.js"></script>
```

## Key Style Attributes

- **Links**: `style="color: #0066cc; text-decoration: none; font-weight: 600;"`
- **Section IDs**: `id="additional-resources"` and `id="related"`
- **Classes**: `faq-section`, `faq-item`, `faq-question`, `faq-answer`
- **Icons**: 📚 for Additional Vatican Resources

## Path Structure

- **Vatican Resources**: `../vatican-resources/htmldocs/[filename].html`
- **FAQ Pages**: `[faq-name].html` (same directory)
- **Back Link**: `https://hoarhouse.github.io/dcfh/faqs/index.html`