const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://atzommnkkwzgbktuzjti.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks'
);

async function checkImages() {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, featured_image, image_url, thumbnail_url')
        .limit(5);
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Sample posts with image fields:');
        console.log(JSON.stringify(data, null, 2));
    }
}

checkImages();
