-- Find the resources first
SELECT id, title, page_url 
FROM resources 
WHERE title ILIKE '%first%interview%' 
   OR title ILIKE '%virtual%pope%'
   OR page_url LIKE '%first-interview%'
   OR page_url LIKE '%virtual-pope%';

-- Delete them (uncomment after confirming above)
-- DELETE FROM resources 
-- WHERE title ILIKE '%first%interview%' 
--    OR title ILIKE '%virtual%pope%'
--    OR page_url LIKE '%first-interview%'
--    OR page_url LIKE '%virtual-pope%';
