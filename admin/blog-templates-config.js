/**
 * Blog Templates Configuration
 * Extracted from blogtemplates.html for DCF Hungary blog editor
 * 
 * Template IDs match database constraint values:
 * - standard
 * - feature  
 * - interview
 * - list
 * - case-study
 * - analysis
 */

(function() {
    'use strict';

    // Template 1: Standard Article
    const standardTemplate = {
        id: 'standard',
        name: 'Standard Article',
        description: 'Clean, professional layout for regular blog posts and articles',
        requiredFields: ['title', 'content', 'author'],
        optionalFields: ['featured_image', 'excerpt', 'tags', 'read_time'],
        cssClasses: ['standard-card', 'standard-meta', 'standard-title', 'standard-excerpt', 'standard-footer'],
        htmlStructure: `
            <div class="blog-card standard-card">
                <div class="standard-meta">
                    <span>{{date}}</span>
                    <span>•</span>
                    <span>{{author}}</span>
                    <span>•</span>
                    <span>{{read_time}} min read</span>
                </div>
                <h3 class="standard-title">{{title}}</h3>
                <p class="standard-excerpt">{{excerpt}}</p>
                <div class="standard-footer">
                    <a href="{{url}}" class="read-more">Read More →</a>
                    <div class="tags">
                        {{#tags}}
                        <span class="tag">{{.}}</span>
                        {{/tags}}
                    </div>
                </div>
            </div>`,
        detailView: `
            <article class="article-detail" style="max-width: 1200px; margin: 0 auto; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <header class="article-header-compact" style="background: #dc3545; padding: 1.5rem 3rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem;">
                    <div>
                        <h1 class="article-title" style="font-family: -apple-system, sans-serif; font-size: 1.75rem; font-weight: 700; color: white; margin: 0; letter-spacing: -0.5px;">
                            {{title}}
                        </h1>
                        <div class="article-meta" style="font-family: -apple-system, sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.9); margin: 0.25rem 0 0 0;">
                            <span>By {{author}}</span>
                            <span style="margin: 0 0.5rem;">•</span>
                            <span>{{date}}</span>
                            <span style="margin: 0 0.5rem;">•</span>
                            <span>{{read_time}} min read</span>
                        </div>
                    </div>
                </header>
                <div class="article-content" style="padding: 3rem; font-size: 1rem; line-height: 1.7; color: #333;">
                    {{content}}
                </div>
            </article>`
    };

    // Template 2: Feature Story  
    const featureTemplate = {
        id: 'feature',
        name: 'Feature Story',
        description: 'Visually rich layout with hero images for featured stories and major initiatives',
        requiredFields: ['title', 'content', 'author', 'featured_image'],
        optionalFields: ['excerpt', 'category', 'read_time'],
        cssClasses: ['feature-card', 'feature-hero', 'feature-overlay', 'feature-title', 'feature-meta'],
        htmlStructure: `
            <div class="blog-card feature-card">
                <div class="feature-hero" style="background-image: url('{{featured_image}}');">
                    <div class="feature-overlay">
                        <span class="feature-category">{{category}}</span>
                        <h3 class="feature-title">{{title}}</h3>
                        <p class="feature-meta">By {{author}} • {{date}}</p>
                    </div>
                </div>
                <div class="feature-body">
                    <p>{{excerpt}}</p>
                </div>
            </div>`,
        detailView: `
            <div class="feature-detail-hero" style="background-image: url('{{featured_image}}');">
                <div class="feature-detail-overlay">
                    <span class="feature-category">{{category}}</span>
                    <h1 class="announcement-detail-title">{{title}}</h1>
                    <div class="article-meta" style="color: white; opacity: 0.9;">
                        <span>By {{author}}</span>
                        <span>{{date}}</span>
                        <span>{{read_time}} min read</span>
                    </div>
                </div>
            </div>
            <div class="article-content">
                {{content}}
            </div>`
    };

    // Template 3: Interview/Q&A (Using Magazine Style as base)
    const interviewTemplate = {
        id: 'interview',
        name: 'Interview/Q&A',
        description: 'Conversational format for interviews, Q&A sessions, and dialogues',
        requiredFields: ['title', 'content', 'author', 'interviewee'],
        optionalFields: ['featured_image', 'excerpt', 'category'],
        cssClasses: ['magazine-card', 'magazine-category', 'magazine-title', 'magazine-excerpt'],
        htmlStructure: `
            <div class="blog-card magazine-card">
                <div class="magazine-header">
                    <span class="magazine-category">Exclusive Interview</span>
                    <h3 class="magazine-title">{{title}}</h3>
                    <p class="magazine-excerpt">{{excerpt}}</p>
                    <div class="magazine-meta">
                        <span>With {{interviewee}}</span>
                        <span>By {{author}}</span>
                        <span>{{date}}</span>
                    </div>
                </div>
            </div>`,
        detailView: `
            <article class="interview-detail">
                <header>
                    <span class="magazine-category">Exclusive Interview</span>
                    <h1 class="magazine-main-title">{{title}}</h1>
                    <p class="magazine-subtitle">{{excerpt}}</p>
                    <div class="interview-meta">
                        <span>Interview with {{interviewee}}</span>
                        <span>By {{author}}</span>
                        <span>{{date}}</span>
                    </div>
                </header>
                <div class="interview-content">
                    {{content}}
                </div>
            </article>`,
        contentFormat: 'qa' // Special flag for Q&A formatting
    };

    // Template 4: List Article (Custom template based on standard)
    const listTemplate = {
        id: 'list', 
        name: 'List Article',
        description: 'Numbered or bulleted format for listicles, tips, and step-by-step guides',
        requiredFields: ['title', 'content', 'author', 'list_items'],
        optionalFields: ['featured_image', 'excerpt', 'tags'],
        cssClasses: ['list-card', 'list-title', 'list-preview', 'list-count'],
        htmlStructure: `
            <div class="blog-card list-card">
                <div class="list-header">
                    <span class="list-count">{{list_count}} Items</span>
                    <h3 class="list-title">{{title}}</h3>
                    <p class="list-excerpt">{{excerpt}}</p>
                    <div class="list-preview">
                        <ul>
                            {{#list_preview}}
                            <li>{{.}}</li>
                            {{/list_preview}}
                        </ul>
                    </div>
                    <div class="list-meta">
                        <span>By {{author}}</span>
                        <span>{{date}}</span>
                    </div>
                </div>
            </div>`,
        detailView: `
            <article class="list-detail">
                <header>
                    <h1 class="list-title">{{title}}</h1>
                    <p class="list-subtitle">{{excerpt}}</p>
                    <div class="article-meta">
                        <span>By {{author}}</span>
                        <span>{{date}}</span>
                        <span>{{list_count}} Items</span>
                    </div>
                </header>
                <div class="list-content">
                    {{content}}
                </div>
            </article>`,
        contentFormat: 'list' // Special flag for list formatting
    };

    // Template 5: Case Study (Using Research Paper as base)
    const caseStudyTemplate = {
        id: 'case-study',
        name: 'Case Study',
        description: 'In-depth analysis format for case studies, project reviews, and detailed examinations',
        requiredFields: ['title', 'content', 'author', 'subject'],
        optionalFields: ['featured_image', 'abstract', 'key_findings', 'methodology'],
        cssClasses: ['research-card', 'research-header', 'research-title', 'research-authors'],
        htmlStructure: `
            <div class="blog-card research-card">
                <div class="research-header">
                    <span class="research-label">Case Study</span>
                    <h3 class="research-title">{{title}}</h3>
                    <p class="research-authors">{{author}}</p>
                </div>
                <div class="research-body">
                    <div class="abstract-label">Subject</div>
                    <p class="abstract-text">{{subject}}</p>
                    {{#key_findings}}
                    <div class="key-findings">
                        <strong>Key Findings:</strong>
                        <ul>
                            {{#findings}}
                            <li>{{.}}</li>
                            {{/findings}}
                        </ul>
                    </div>
                    {{/key_findings}}
                </div>
            </div>`,
        detailView: `
            <article class="case-study-detail">
                <header class="research-header">
                    <span class="research-label">Case Study</span>
                    <h1 class="article-title">{{title}}</h1>
                    <p class="research-authors">{{author}}</p>
                    <p class="text-muted">Subject: {{subject}}</p>
                </header>
                {{#abstract}}
                <div class="abstract-section">
                    <h2>Abstract</h2>
                    <p>{{abstract}}</p>
                </div>
                {{/abstract}}
                {{#methodology}}
                <div class="methodology-section">
                    <h2>Methodology</h2>
                    <p>{{methodology}}</p>
                </div>
                {{/methodology}}
                <div class="article-content">
                    {{content}}
                </div>
                {{#key_findings}}
                <div class="findings-section">
                    <h2>Key Findings</h2>
                    <ul>
                        {{#findings}}
                        <li>{{.}}</li>
                        {{/findings}}
                    </ul>
                </div>
                {{/key_findings}}
            </article>`
    };

    // Template 6: Analysis/Opinion (Using Announcement as base)
    const analysisTemplate = {
        id: 'analysis',
        name: 'Analysis/Opinion',
        description: 'Thought leadership format for opinion pieces, analysis, and commentary',
        requiredFields: ['title', 'content', 'author'],
        optionalFields: ['featured_image', 'excerpt', 'category', 'key_points'],
        cssClasses: ['announcement-card', 'announcement-badge', 'announcement-title', 'announcement-text'],
        htmlStructure: `
            <div class="blog-card announcement-card">
                <div class="announcement-header">
                    <span class="announcement-badge">Analysis</span>
                    <span class="announcement-date">{{date}}</span>
                </div>
                <h3 class="announcement-title">{{title}}</h3>
                <p class="announcement-text">{{excerpt}}</p>
                {{#key_points}}
                <div class="key-points">
                    <strong>Key Points:</strong>
                    <ul>
                        {{#points}}
                        <li>{{.}}</li>
                        {{/points}}
                    </ul>
                </div>
                {{/key_points}}
                <div class="announcement-footer">
                    <span>By {{author}}</span>
                    <a href="{{url}}" class="announcement-link">Read Analysis →</a>
                </div>
            </div>`,
        detailView: `
            <article class="analysis-detail">
                <header>
                    <span class="announcement-badge">Analysis</span>
                    <h1 class="announcement-detail-title">{{title}}</h1>
                    <div class="article-meta">
                        <span>By {{author}}</span>
                        <span>{{date}}</span>
                    </div>
                    {{#excerpt}}
                    <p class="lead-text">{{excerpt}}</p>
                    {{/excerpt}}
                </header>
                {{#key_points}}
                <div class="key-points-section">
                    <h2>Key Points</h2>
                    <ul>
                        {{#points}}
                        <li>{{.}}</li>
                        {{/points}}
                    </ul>
                </div>
                {{/key_points}}
                <div class="article-content">
                    {{content}}
                </div>
            </article>`
    };

    // Combine all templates
    const templates = [
        standardTemplate,
        featureTemplate,
        interviewTemplate,
        listTemplate,
        caseStudyTemplate,
        analysisTemplate
    ];

    // Export the configuration
    window.BlogTemplates = {
        templates: templates,
        
        /**
         * Get a template by its ID
         * @param {string} id - Template ID (standard, feature, interview, list, case-study, analysis)
         * @returns {Object|null} Template object or null if not found
         */
        getTemplate: function(id) {
            return this.templates.find(t => t.id === id) || null;
        },
        
        /**
         * Get all available templates
         * @returns {Array} Array of all template objects
         */
        getAllTemplates: function() {
            return this.templates;
        },
        
        /**
         * Get template names and IDs for dropdowns
         * @returns {Array} Array of {id, name} objects
         */
        getTemplateOptions: function() {
            return this.templates.map(t => ({
                id: t.id,
                name: t.name,
                description: t.description
            }));
        },
        
        /**
         * Validate if a template ID exists
         * @param {string} id - Template ID to validate
         * @returns {boolean} True if template exists
         */
        isValidTemplate: function(id) {
            return this.templates.some(t => t.id === id);
        },
        
        /**
         * Get required fields for a template
         * @param {string} id - Template ID
         * @returns {Array} Array of required field names
         */
        getRequiredFields: function(id) {
            const template = this.getTemplate(id);
            return template ? template.requiredFields : [];
        },
        
        /**
         * Get all fields (required + optional) for a template
         * @param {string} id - Template ID
         * @returns {Array} Array of all field names
         */
        getAllFields: function(id) {
            const template = this.getTemplate(id);
            if (!template) return [];
            return [...template.requiredFields, ...template.optionalFields];
        },
        
        /**
         * Render a template with data
         * @param {string} id - Template ID
         * @param {Object} data - Data to populate template
         * @param {string} view - 'card' or 'detail' view
         * @returns {string} Rendered HTML string
         */
        renderTemplate: function(id, data, view = 'card') {
            const template = this.getTemplate(id);
            if (!template) return '';
            
            const htmlTemplate = view === 'detail' ? template.detailView : template.htmlStructure;
            
            // Simple template replacement (you may want to use a proper template engine)
            let html = htmlTemplate;
            
            // Replace placeholders with data
            Object.keys(data).forEach(key => {
                const value = data[key];
                const regex = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(regex, value || '');
            });
            
            // Handle conditional sections
            html = html.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (match, key, content) => {
                return data[key] ? content : '';
            });
            
            // Handle arrays (simplified)
            html = html.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (match, key, content) => {
                if (Array.isArray(data[key])) {
                    return data[key].map(item => 
                        content.replace(/{{\.}}/g, item)
                    ).join('');
                }
                return data[key] ? content : '';
            });
            
            return html;
        }
    };

    // Log successful load
    console.log('Blog Templates Configuration loaded successfully');
    console.log('Available templates:', window.BlogTemplates.getTemplateOptions());

})();