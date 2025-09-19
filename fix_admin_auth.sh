#!/bin/bash

# Fix blogwiz_backup.html
echo "Fixing blogwiz_backup.html..."
sed -i '' '/const SUPABASE_URL.*atzommnkkwzgbktuzjti/,/supabase = window.supabase.createClient/c\
            // Use unified Supabase client from dcf-unified-system.js\
            if (!window.dcfSupabase) {\
                await new Promise(resolve => {\
                    const checkInterval = setInterval(() => {\
                        if (window.dcfSupabase) {\
                            clearInterval(checkInterval);\
                            resolve();\
                        }\
                    }, 100);\
                });\
            }\
            supabase = window.dcfSupabase;' /Users/christopherhoar/Desktop/dcfh/admin/blogwiz_backup.html

# Fix blogpostsmanage.html
echo "Fixing blogpostsmanage.html..."
sed -i '' '/const SUPABASE_URL.*atzommnkkwzgbktuzjti/,/supabase = window.supabase.createClient/c\
            // Use unified Supabase client from dcf-unified-system.js\
            if (!window.dcfSupabase) {\
                await new Promise(resolve => {\
                    const checkInterval = setInterval(() => {\
                        if (window.dcfSupabase) {\
                            clearInterval(checkInterval);\
                            resolve();\
                        }\
                    }, 100);\
                });\
            }\
            supabase = window.dcfSupabase;' /Users/christopherhoar/Desktop/dcfh/admin/blogpostsmanage.html

# Fix createblogwiz.html
echo "Fixing createblogwiz.html..."
sed -i '' '/const SUPABASE_URL.*atzommnkkwzgbktuzjti/,/supabase = window.supabase.createClient/c\
            // Use unified Supabase client from dcf-unified-system.js\
            if (!window.dcfSupabase) {\
                await new Promise(resolve => {\
                    const checkInterval = setInterval(() => {\
                        if (window.dcfSupabase) {\
                            clearInterval(checkInterval);\
                            resolve();\
                        }\
                    }, 100);\
                });\
            }\
            supabase = window.dcfSupabase;' /Users/christopherhoar/Desktop/dcfh/admin/createblogwiz.html

# Fix blogmanage.html
echo "Fixing blogmanage.html..."
sed -i '' '/const SUPABASE_URL.*atzommnkkwzgbktuzjti/,/supabase = window.supabase.createClient/c\
            // Use unified Supabase client from dcf-unified-system.js\
            if (!window.dcfSupabase) {\
                await new Promise(resolve => {\
                    const checkInterval = setInterval(() => {\
                        if (window.dcfSupabase) {\
                            clearInterval(checkInterval);\
                            resolve();\
                        }\
                    }, 100);\
                });\
            }\
            supabase = window.dcfSupabase;' /Users/christopherhoar/Desktop/dcfh/admin/blogmanage.html

# Fix blogwiz.html (if it has the same pattern)
echo "Fixing blogwiz.html..."
sed -i '' '/const SUPABASE_URL.*atzommnkkwzgbktuzjti/,/supabase = window.supabase.createClient/c\
            // Use unified Supabase client from dcf-unified-system.js\
            if (!window.dcfSupabase) {\
                await new Promise(resolve => {\
                    const checkInterval = setInterval(() => {\
                        if (window.dcfSupabase) {\
                            clearInterval(checkInterval);\
                            resolve();\
                        }\
                    }, 100);\
                });\
            }\
            supabase = window.dcfSupabase;' /Users/christopherhoar/Desktop/dcfh/admin/blogwiz.html

echo "Admin auth fixes complete!"