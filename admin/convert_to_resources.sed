# Update filters
s/id="blogFilter"/id="typeFilter"/g
s/id="postTypeFilter"/id="typeFilter"/g

# Update element IDs
s/id="postsList"/id="resourcesList"/g

# Update variables
s/let posts = \[\]/let resources = []/g
s/let filteredPosts = \[\]/let filteredResources = []/g
s/let selectedPosts = new Set()/let selectedResources = new Set()/g

# Update function names
s/displayPosts/displayResources/g
s/filterPosts/filterResources/g
s/createPostItem/createResourceItem/g
s/togglePostSelection/toggleResourceSelection/g
s/deletePost/deleteResource/g
s/changePostStatus/changeResourceStatus/g
s/duplicatePost/duplicateResource/g

# Update database table
s/from('blog_posts')/from('resources')/g

# Update text
s/Loading posts/Loading resources/g
s/No Blog Posts Found/No Resources Found/g
s/Create your first blog post/Upload your first resource/g
s/Failed to load blog posts/Failed to load resources/g
s/Failed to load posts/Failed to load resources/g
