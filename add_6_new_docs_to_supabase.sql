-- Add 6 new Vatican documents to resources table

-- 1. Pope Leo XIV to Digital Missionaries
INSERT INTO resources (title, description, page_url, resource_type, tags, status, created_at)
VALUES (
  'Pope Leo XIV to Digital Missionaries and Influencers',
  'Address on technology, witness, and mission in the digital age',
  'https://hoarhouse.github.io/dcfh/vatican-resources/htmldocs/pope-leo-xiv-digital-missionaries-influencers-july-2025.html',
  'vatican-document',
  ARRAY['pope-leo', 'social-media', 'digital-evangelization', 'ai-ethics-philosophy', 'education-formation'],
  'published',
  '2025-07-29'
);

-- 2. Towards Full Presence
INSERT INTO resources (title, description, page_url, resource_type, tags, status, created_at)
VALUES (
  'Towards Full Presence: Pastoral Reflection on Social Media',
  'Dicastery for Communication guidance on authentic digital presence',
  'https://hoarhouse.github.io/dcfh/vatican-resources/htmldocs/towards-full-presence-social-media-2023.html',
  'vatican-document',
  ARRAY['social-media', 'pastoral-guidance', 'digital-evangelization', 'theological-perspectives', 'official-church-documents'],
  'published',
  '2023-05-28'
);

-- 3. Ethics in Internet
INSERT INTO resources (title, description, page_url, resource_type, tags, status, created_at)
VALUES (
  'Ethics in Internet',
  'Foundational document on internet ethics and moral principles',
  'https://hoarhouse.github.io/dcfh/vatican-resources/htmldocs/ethics-in-internet-2002.html',
  'vatican-document',
  ARRAY['internet-ethics', 'foundational-documents', 'social-issues', 'theological-perspectives', 'official-church-documents'],
  'published',
  '2002-02-28'
);

-- 4. The Church and Internet
INSERT INTO resources (title, description, page_url, resource_type, tags, status, created_at)
VALUES (
  'The Church and Internet',
  'The Church''s approach to internet technology and digital ministry',
  'https://hoarhouse.github.io/dcfh/vatican-resources/htmldocs/church-and-internet-2002.html',
  'vatican-document',
  ARRAY['internet-ethics', 'foundational-documents', 'digital-evangelization', 'pastoral-guidance', 'official-church-documents'],
  'published',
  '2002-02-28'
);

-- 5. Benedict XVI on Digital Culture
INSERT INTO resources (title, description, page_url, resource_type, tags, status, created_at)
VALUES (
  'Benedict XVI on Digital Culture and New Media',
  'Address to Pontifical Council on language, technology and faith',
  'https://hoarhouse.github.io/dcfh/vatican-resources/htmldocs/benedict-xvi-digital-culture-2011.html',
  'vatican-document',
  ARRAY['social-media', 'digital-culture', 'theological-perspectives', 'education-formation', 'official-church-documents'],
  'published',
  '2011-02-28'
);

-- 6. Pope Francis on Rome Call
INSERT INTO resources (title, description, page_url, resource_type, tags, status, created_at)
VALUES (
  'Pope Francis on Rome Call for AI Ethics',
  'Address at Rome Call meeting with Abrahamic religions signing',
  'https://hoarhouse.github.io/dcfh/vatican-resources/htmldocs/pope-francis-rome-call-meeting-january-2023.html',
  'vatican-document',
  ARRAY['ai-ethics-philosophy', 'foundational-documents', 'governance-policy', 'official-church-documents', 'interfaith-dialogue'],
  'published',
  '2023-01-10'
);
