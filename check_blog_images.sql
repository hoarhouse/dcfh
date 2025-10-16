SELECT slug, title, featured_image_url 
FROM blog_posts 
WHERE slug IN (
  'the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code',
  'from-mushroom-clouds-to-machine-code-how-the-vatican-spent-35-years-preparing-fo',
  'the-vaticans-warning-about-ai-and-the-end-of-work',
  'implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist',
  'the-future-of-ai-and-humanity-game-changing-or-game-over'
);
