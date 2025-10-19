-- STEP 1: Check if FAQs are stored in 'resources' table
SELECT id, title, slug, category 
FROM resources 
WHERE slug LIKE '%faq%' OR title LIKE '%FAQ%'
LIMIT 20;

-- STEP 2: Check if FAQs are in 'blog_posts' table  
SELECT id, title, slug, news_category
FROM blog_posts
WHERE slug LIKE '%faq%' OR title LIKE '%FAQ%'
LIMIT 20;

-- STEP 3: Check 'cms_sections' table
SELECT * FROM cms_sections
WHERE content LIKE '%faq%' OR title LIKE '%FAQ%'
LIMIT 20;

-- STEP 4: Check for content fields in schema
SELECT table_name, column_name
FROM information_schema.columns
WHERE column_name IN ('content', 'description', 'body', 'text', 'html')
AND table_schema = 'public';
