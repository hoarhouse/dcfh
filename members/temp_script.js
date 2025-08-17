        // WORLD-CLASS SOCIAL MEDIA FEED SYSTEM
        
        // Core state management
        let currentSort = 'newest';
        let feedPosts = [];
        let currentUser = null;
        let isLoading = false;
        let hasMorePosts = true;
        let currentPage = 0;
        const postsPerPage = 10;
        let mediaFiles = [];
        let uploadingFiles = [];
        
        // Database connection (from database-reference.md)
        const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';
        
        // Sort configurations
        const SORT_OPTIONS = {
            newest: { 
                query: 'created_at', 
                order: 'desc',
                icon: '🕐',
                label: 'Newest'
            },
            popular: { 
                query: 'like_count', 
                order: 'desc',
                icon: '❤️',
                label: 'Most Liked'
            },
            commented: { 
                query: 'comment_count', 
                order: 'desc',
                icon: '💬',
                label: 'Most Commented'
            },
            viewed: { 
                query: 'view_count', 
                order: 'desc',
                icon: '👁️',
                label: 'Most Viewed'
            },
            trending: { 
                query: '(like_count + comment_count * 2)', 
                order: 'desc',
                icon: '📈',
                label: 'Trending'
            }
        };

        // ===== INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 INITIALIZING WORLD-CLASS FEED');
            initializeFeed();
        });

        async function initializeFeed() {
            const maxAttempts = 20;
            let attempts = 0;

            function tryInitialize() {
                attempts++;
                const supabase = window.authSupabase || window.masterSupabase;
                
                if (supabase && typeof supabase.from === 'function') {
                    currentUser = window.getCurrentUser();
                    console.log('✅ User authenticated:', currentUser);
                    
                    // Initialize UI
                    setupPostBox();
                    setupInfiniteScroll();
                    
                    // Load initial feed
                    loadFeedWithSorting(currentSort);
                    
                } else if (attempts < maxAttempts) {
                    setTimeout(tryInitialize, 500);
                } else {
                    showError('Unable to connect to database. Please refresh the page.');
                }
            }
            
            setTimeout(tryInitialize, 1000);
        }

        function switchFilter(filterType) {
            currentFilter = filterType;
            currentPage = 0;
            hasMorePosts = true;
            allPostsCache = [];
            
            // Update active tab
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(filterType + 'Tab').classList.add('active');
            
            // Update page title
            updatePageHeader(filterType);
            
            // Load posts with new filter
            loadPosts();
        }

        function updatePageHeader(filterType) {
            const pageTitle = document.querySelector('.page-title');
            const pageSubtitle = document.querySelector('.page-subtitle');
            
            const headers = {
                latest: {
                    title: 'Community Hub',
                    subtitle: 'Share insights, connect with fellow members, and engage in meaningful discussions about ethical AI and technology'
                },
                popular: {
                    title: 'Popular Posts',
                    subtitle: 'Discover the most liked and engaging content from our community members'
                },
                commented: {
                    title: 'Active Discussions',
                    subtitle: 'Join the conversations that are generating the most community engagement'
                },
                trending: {
                    title: 'Trending Now',
                    subtitle: 'See what topics and discussions are gaining momentum in our community'
                }
            };
            
            const header = headers[filterType] || headers.latest;
            pageTitle.textContent = header.title;
            pageSubtitle.textContent = header.subtitle;
        }

        async function loadPosts() {
            if (isLoading || !hasMorePosts) return;
            
            isLoading = true;
            const supabase = window.authSupabase || window.masterSupabase;
            
            // FIXED: Using simple select without foreign keys - v2
            console.log('Loading posts with simple select (no foreign keys) - v2');
            
            try {
                let query = supabase
                    .from('posts')
                    .select('*')  // SIMPLE SELECT ONLY - NO FOREIGN KEYS
                    .eq('status', 'active')
                    .range(currentPage * postsPerPage, (currentPage + 1) * postsPerPage - 1);

                // Apply sorting based on current filter
                switch (currentFilter) {
                    case 'popular':
                        query = query.order('like_count', { ascending: false });
                        break;
                    case 'commented':
                        query = query.order('comment_count', { ascending: false });
                        break;
                    case 'trending':
                        query = query.order('view_count', { ascending: false });
                        break;
                    default: // latest
                        query = query.order('created_at', { ascending: false });
                }

                const { data: posts, error } = await query;

                if (error) throw error;

                // Separate query for user profiles
                const { data: profiles } = await supabase
                    .from('user_profiles')
                    .select('email, username, name, avatar_url');

                // Match posts with user profiles by username
                const postsWithProfiles = posts.map(post => {
                    const userProfile = profiles?.find(profile => 
                        profile.username === post.username
                    );
                    return {
                        ...post,
                        user_profiles: userProfile || null
                    };
                });

                if (postsWithProfiles.length < postsPerPage) {
                    hasMorePosts = false;
                }

                allPostsCache = [...allPostsCache, ...postsWithProfiles];
                currentPage++;

                displayPosts();
                updateStats();

            } catch (error) {
                console.error('Error loading posts:', error);
                showEmptyState('Unable to load posts. Please refresh the page.');
            } finally {
                isLoading = false;
            }
        }

        function displayPosts() {
            const container = document.getElementById('postsContainer');
            
            if (allPostsCache.length === 0) {
                showEmptyState('No posts yet. Be the first to share something with the community!');
                return;
            }

            container.innerHTML = allPostsCache.map(post => createPostHTML(post)).join('');
            
            // Initialize comment system for visible posts
            allPostsCache.forEach(post => {
                setTimeout(() => initializeCommentsForPost(post.id), 100);
            });
        }

        function createPostHTML(post) {
            const author = post.user_profiles || {};
            const authorName = author.username || author.name || 'Unknown User';
            const authorInitials = getInitials(authorName);
            const timeAgo = formatTimeAgo(post.created_at);
            
            // Smart image display based on media content
            let mediaHTML = '';
            if (post.media_url) {
                mediaHTML = createSmartImageDisplay(post.media_url, post.id);
            }

            return `
                <div class="post-card" data-post-id="${post.id}">
                    <div class="post-header">
                        <div class="author-avatar">
                            ${author.avatar_url ? 
                                `<img src="${author.avatar_url}" alt="${authorName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                                authorInitials
                            }
                        </div>
                        <div class="post-meta">
                            <div class="author-name">@${authorName}</div>
                            <div class="post-time">${timeAgo}</div>
                        </div>
                    </div>
                    
                    <div class="post-content">
                        ${post.content ? `<div class="post-text">${post.content}</div>` : ''}
                        ${mediaHTML}
                    </div>
                    
                    <div class="post-actions">
                        <button class="action-btn ${post.user_liked ? 'liked' : ''}" onclick="toggleLike('${post.id}', this)">
                            ❤️ ${post.like_count || 0}
                        </button>
                        <button class="action-btn" onclick="scrollToComments('${post.id}')">
                            💬 ${post.comment_count || 0}
                        </button>
                        <button class="action-btn" onclick="sharePost('${post.id}')">
                            🔗 Share
                        </button>
                    </div>
                    
                    <div class="comments-section" id="comments-${post.id}">
                        <div class="comments-header">
                            <div class="comments-count" id="comments-count-${post.id}">0 Comments</div>
                            <div class="comments-filter">
                                <button class="filter-btn active" onclick="filterComments('${post.id}', 'all')">All</button>
                                <button class="filter-btn" onclick="filterComments('${post.id}', 'top')">Top</button>
                                <button class="filter-btn" onclick="filterComments('${post.id}', 'recent')">Recent</button>
                            </div>
                        </div>
                        <div class="comment-input-section">
                            <div class="comment-avatar" id="user-avatar-${post.id}">U</div>
                            <div class="comment-input-wrapper">
                                <textarea class="comment-input" placeholder="Add a comment..." 
                                        id="comment-input-${post.id}" rows="1"></textarea>
                                <button class="comment-submit" onclick="submitComment('${post.id}')" disabled>Post</button>
                            </div>
                        </div>
                        <div class="comments-list" id="comments-list-${post.id}">
                            <!-- Comments will be loaded here -->
                        </div>
                    </div>
                </div>
            `;
        }

        function createSmartImageDisplay(mediaUrl, postId) {
            const images = parseMediaUrls(mediaUrl);
            
            if (images.length === 0) return '';
            
            if (images.length === 1) {
                // Single image with orientation-based sizing
                return createSingleImageDisplay(images[0], postId);
            } else {
                // Collage system with main image and overlays
                return createCollageDisplay(images, postId);
            }
        }

        function parseMediaUrls(mediaUrl) {
            if (!mediaUrl) return [];
            
            try {
                // Handle JSON array
                if (mediaUrl.startsWith('[')) {
                    return JSON.parse(mediaUrl);
                }
                // Handle comma-separated string
                if (mediaUrl.includes(',')) {
                    return mediaUrl.split(',').map(url => url.trim()).filter(url => url);
                }
                // Single URL
                return [mediaUrl];
            } catch (error) {
                console.error('Error parsing media URLs:', error);
                return [];
            }
        }

        function createSingleImageDisplay(imageUrl, postId) {
            const img = new Image();
            img.src = imageUrl;
            
            return `
                <div class="single-image" onclick="openImageModal('${imageUrl}')">
                    <img src="${imageUrl}" alt="Post image" loading="lazy" 
                         onload="applySizeClass(this)" style="object-fit: contain;">
                </div>
            `;
        }

        function applySizeClass(img) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const container = img.closest('.single-image');
            
            if (aspectRatio < 0.8) {
                container.classList.add('vertical');
            } else if (aspectRatio > 1.3) {
                container.classList.add('horizontal');
            } else {
                container.classList.add('square');
            }
        }

        function createCollageDisplay(images, postId) {
            const mainImage = images[0];
            const overlayImages = images.slice(1, 5); // Show up to 4 overlays
            const hasMore = images.length > 5;
            
            const overlayPositions = [
                'group-bottom-right-1',
                'group-bottom-right-2',
                'group-top-left-1',
                'group-top-left-2'
            ];
            
            const overlaysHTML = overlayImages.map((img, index) => `
                <img src="${img}" alt="Overlay image" class="overlay-image ${overlayPositions[index]}" 
                     onclick="openCollageModal('${postId}', ${index + 1})" loading="lazy">
            `).join('');
            
            const moreIndicator = hasMore ? `
                <div class="more-images-indicator">
                    +${images.length - 5} more images
                </div>
            ` : '';
            
            return `
                <div class="collage-container" onclick="openCollageModal('${postId}', 0)">
                    <img src="${mainImage}" alt="Main post image" class="collage-main" loading="lazy">
                    <div class="collage-overlays">
                        ${overlaysHTML}
                        ${moreIndicator}
                    </div>
                </div>
            `;
        }

        // Modern Comment System State
        const postCommentsState = {};

        // Initialize comment system for a post
        function initializeCommentsForPost(postId) {
            if (!postCommentsState[postId]) {
                postCommentsState[postId] = {
                    comments: [],
                    showAllComments: false,
                    currentFilter: 'all'
                };
            }
            
            // Setup user avatar
            const userAvatar = document.getElementById(`user-avatar-${postId}`);
            if (userAvatar && currentUser) {
                userAvatar.textContent = getUserInitials(currentUser.username || currentUser.name || 'U');
            }
            
            // Setup input handlers
            const commentInput = document.getElementById(`comment-input-${postId}`);
            const submitBtn = commentInput?.parentElement?.querySelector('.comment-submit');
            
            if (commentInput && submitBtn) {
                commentInput.addEventListener('input', function() {
                    submitBtn.disabled = !this.value.trim();
                    
                    // Auto-resize
                    this.style.height = 'auto';
                    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
                });
                
                // Handle enter key
                commentInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!submitBtn.disabled) {
                            submitComment(postId);
                        }
                    }
                });
            }
            
            // Load initial comments
            loadCommentsForPost(postId);
        }

        async function loadCommentsForPost(postId) {
            const supabase = window.authSupabase || window.masterSupabase;
            
            try {
                const { data: comments, error } = await supabase
                    .from('post_comments')
                    .select('*')
                    .eq('post_id', postId)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Process comments with @username format - ENSURE ALL SHOW @username
                const processedComments = (comments || []).map(comment => {
                    const displayUsername = comment.username?.startsWith('@') ? comment.username : `@${comment.username || 'user'}`;
                    return {
                        ...comment,
                        username: displayUsername,
                        avatar: getUserInitials(comment.username || 'User')
                    };
                });

                postCommentsState[postId].comments = processedComments;
                renderComments(postId);

            } catch (error) {
                console.error('Error loading comments:', error);
                showEmptyCommentsState(postId);
            }
        }

        // Get sorted comments for progressive display
        function getSortedComments(postId) {
            const state = postCommentsState[postId];
            if (!state) return [];
            
            const { comments, currentFilter } = state;
            
            switch (currentFilter) {
                case 'top':
                    return [...comments].sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
                case 'recent':
                    return [...comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                default:
                    return [...comments].sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
            }
        }

        // Render comments with progressive loading
        function renderComments(postId) {
            const commentsList = document.getElementById(`comments-list-${postId}`);
            const state = postCommentsState[postId];
            
            if (!commentsList || !state) return;
            
            const sortedComments = getSortedComments(postId);
            
            let commentsToShow;
            let showExpandButton = false;
            
            if (state.showAllComments) {
                commentsToShow = sortedComments;
            } else {
                commentsToShow = sortedComments.slice(0, 2);
                showExpandButton = sortedComments.length > 2;
            }
            
            const commentsHtml = commentsToShow.map(comment => renderComment(comment, postId)).join('');
            
            let expandButtonHtml = '';
            if (showExpandButton) {
                expandButtonHtml = `
                    <button class="expand-comments-btn" onclick="toggleCommentsExpansion('${postId}')">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                        💬 See all comments (${sortedComments.length})
                    </button>
                `;
            } else if (state.showAllComments && sortedComments.length > 2) {
                expandButtonHtml = `
                    <button class="expand-comments-btn expanded" onclick="toggleCommentsExpansion('${postId}')">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                        Show fewer comments
                    </button>
                `;
            }
            
            commentsList.innerHTML = commentsHtml + expandButtonHtml;
            
            // Update comments count
            updateCommentsCount(postId, sortedComments.length);
        }

        // Render individual comment
        function renderComment(comment, postId) {
            const currentUserUsername = `@${currentUser?.username || 'user'}`;
            const timeAgo = formatTimeAgo(comment.created_at);
            
            return `
                <div class="comment" id="comment-${comment.id}">
                    <div class="comment-avatar">${comment.avatar}</div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <a href="#" class="comment-username">${comment.username}</a>
                            <span class="comment-time">${timeAgo}</span>
                        </div>
                        <div class="comment-text">${processCommentText(comment.content)}</div>
                        <div class="comment-actions">
                            <button class="comment-action ${comment.isLiked ? 'liked' : ''}" onclick="toggleCommentLike('${comment.id}', '${postId}')">
                                <svg fill="${comment.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                <span>${comment.like_count || 0}</span>
                            </button>
                            <button class="comment-action" onclick="showReplyInput('${comment.id}', '${postId}')">Reply</button>
                            ${comment.username === currentUserUsername ? `
                                <button class="comment-action" onclick="editComment('${comment.id}', '${postId}')">Edit</button>
                                <button class="comment-action" onclick="deleteComment('${comment.id}', '${postId}')">Delete</button>
                            ` : ''}
                        </div>
                        <div id="reply-${comment.id}"></div>
                    </div>
                </div>
            `;
        }

        // Process comment text for @mentions and links
        function processCommentText(text) {
            // Escape HTML first
            const div = document.createElement('div');
            div.textContent = text;
            let escaped = div.innerHTML;
            
            // Make URLs clickable
            escaped = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
            
            // Make @mentions clickable
            escaped = escaped.replace(/(@[a-zA-Z0-9_]+)/g, '<a href="#" class="mention" style="color: #0095f6; text-decoration: none; font-weight: 600;">$1</a>');
            
            return escaped;
        }

        // Submit comment
        async function submitComment(postId, parentId = null) {
            const input = parentId ? 
                document.querySelector(`#reply-${parentId} .reply-input`) : 
                document.getElementById(`comment-input-${postId}`);
            
            if (!input) {
                console.error('❌ COMMENT INPUT NOT FOUND:', { postId, parentId });
                return;
            }
            
            const content = input.value.trim();
            if (!content) {
                console.log('❌ EMPTY COMMENT CONTENT');
                return;
            }
            
            if (!currentUser) {
                console.error('❌ USER NOT LOGGED IN:', currentUser);
                alert('Please log in to comment');
                return;
            }

            const supabase = window.authSupabase || window.masterSupabase;
            if (!supabase) {
                console.error('❌ SUPABASE NOT AVAILABLE');
                alert('Database connection error. Please refresh the page.');
                return;
            }
            
            console.log('🚀 SUBMITTING COMMENT [FIXED VERSION]:', { postId, content, user: currentUser });
            console.log('🔍 USING FIELD: username (NOT author_name)');
            
            try {
                // Ensure username is stored without @ prefix (database stores clean username)
                const cleanUsername = currentUser.username?.replace('@', '') || currentUser.name || 'user';
                
                const { data, error } = await supabase
                    .from('post_comments')
                    .insert({
                        post_id: postId,
                        content: content,
                        username: cleanUsername,
                        user_id: currentUser.id,
                        parent_id: parentId,
                        like_count: 0
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('❌ DATABASE ERROR:', error);
                    throw error;
                }
                
                console.log('✅ COMMENT SAVED:', data);

                // Clear input
                input.value = '';
                if (!parentId) {
                    const submitBtn = input.parentElement?.querySelector('.comment-submit');
                    if (submitBtn) submitBtn.disabled = true;
                }
                
                // Expand to show all comments when user posts
                if (!parentId) {
                    postCommentsState[postId].showAllComments = true;
                }
                
                // Clear reply input
                if (parentId) {
                    document.getElementById(`reply-${parentId}`).innerHTML = '';
                }
                
                // Reload comments
                await loadCommentsForPost(postId);
                
                // Update post comment count
                await updatePostCommentCount(postId);

            } catch (error) {
                console.error('Error submitting comment:', error);
                alert('Failed to post comment. Please try again.');
            }
        }

        // Toggle comments expansion
        function toggleCommentsExpansion(postId) {
            const state = postCommentsState[postId];
            if (!state) return;
            
            state.showAllComments = !state.showAllComments;
            renderComments(postId);
        }

        // Toggle comment like
        async function toggleCommentLike(commentId, postId) {
            if (!currentUser) {
                alert('Please log in to like comments');
                return;
            }

            const supabase = window.authSupabase || window.masterSupabase;
            
            try {
                // Check if already liked
                const { data: existingLike, error: checkError } = await supabase
                    .from('comment_likes')
                    .select('id')
                    .eq('comment_id', commentId)
                    .eq('user_email', currentUser.email)
                    .single();
                
                if (checkError && checkError.code !== 'PGRST116') throw checkError;
                
                if (existingLike) {
                    // Unlike
                    await supabase
                        .from('comment_likes')
                        .delete()
                        .eq('id', existingLike.id);
                        
                    // Update count
                    await supabase
                        .from('post_comments')
                        .update({ like_count: supabase.raw('like_count - 1') })
                        .eq('id', commentId);
                } else {
                    // Like
                    await supabase
                        .from('comment_likes')
                        .insert({
                            comment_id: commentId,
                            user_email: currentUser.email,
                            user_name: currentUser.username
                        });
                        
                    // Update count
                    await supabase
                        .from('post_comments')
                        .update({ like_count: supabase.raw('like_count + 1') })
                        .eq('id', commentId);
                }
                
                // Reload comments
                await loadCommentsForPost(postId);
                
            } catch (error) {
                console.error('Error toggling comment like:', error);
            }
        }

        // Show reply input
        function showReplyInput(commentId, postId) {
            const replyDiv = document.getElementById(`reply-${commentId}`);
            const userInitials = getUserInitials(currentUser?.username || 'User');
            
            replyDiv.innerHTML = `
                <div class="reply-input-wrapper">
                    <div class="comment-avatar">${userInitials}</div>
                    <textarea class="reply-input" placeholder="Write a reply..."></textarea>
                    <div class="reply-actions">
                        <button class="reply-btn" onclick="submitComment('${postId}', '${commentId}')">Reply</button>
                        <button class="reply-btn cancel-btn" onclick="cancelReply('${commentId}')">Cancel</button>
                    </div>
                </div>
            `;
            
            const replyInput = replyDiv.querySelector('.reply-input');
            replyInput.focus();
            
            // Add Enter key submission for reply input
            replyInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (this.value.trim()) {
                        submitComment(postId, commentId);
                    }
                }
            });
        }

        // Cancel reply
        function cancelReply(commentId) {
            document.getElementById(`reply-${commentId}`).innerHTML = '';
        }

        // Edit comment
        function editComment(commentId, postId) {
            const state = postCommentsState[postId];
            if (!state) return;
            
            const comment = state.comments.find(c => c.id === commentId);
            if (!comment || comment.username !== `@${currentUser?.username}`) return;
            
            const commentEl = document.getElementById(`comment-${commentId}`);
            const textEl = commentEl.querySelector('.comment-text');
            const currentText = comment.content;
            
            textEl.innerHTML = `
                <textarea class="edit-input">${currentText}</textarea>
                <div class="edit-actions">
                    <button class="edit-btn" onclick="saveEdit('${commentId}', '${postId}')">Save</button>
                    <button class="edit-btn cancel-edit-btn" onclick="cancelEdit('${commentId}', '${postId}')">Cancel</button>
                </div>
            `;
            
            const editInput = textEl.querySelector('.edit-input');
            editInput.focus();
            
            // Add Enter key submission for edit input
            editInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (this.value.trim()) {
                        saveEdit(commentId, postId);
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEdit(commentId, postId);
                }
            });
        }

        // Save edit
        async function saveEdit(commentId, postId) {
            const editInput = document.querySelector(`#comment-${commentId} .edit-input`);
            const newContent = editInput.value.trim();
            
            if (!newContent) return;
            
            const supabase = window.authSupabase || window.masterSupabase;
            
            try {
                const { error } = await supabase
                    .from('post_comments')
                    .update({ content: newContent })
                    .eq('id', commentId)
                    .eq('username', currentUser.username);
                
                if (error) throw error;
                
                await loadCommentsForPost(postId);
                
            } catch (error) {
                console.error('Error saving edit:', error);
                alert('Failed to save edit. Please try again.');
            }
        }

        // Cancel edit
        function cancelEdit(commentId, postId) {
            renderComments(postId);
        }

        // Delete comment
        async function deleteComment(commentId, postId) {
            if (!confirm('Are you sure you want to delete this comment?')) return;
            
            const supabase = window.authSupabase || window.masterSupabase;
            
            try {
                const { error } = await supabase
                    .from('post_comments')
                    .delete()
                    .eq('id', commentId)
                    .eq('username', currentUser.username);
                
                if (error) throw error;
                
                await loadCommentsForPost(postId);
                await updatePostCommentCount(postId);
                
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment. Please try again.');
            }
        }

        // Filter comments
        function filterComments(postId, filterType) {
            const state = postCommentsState[postId];
            if (!state) return;
            
            // Update filter buttons
            const filterButtons = document.querySelectorAll(`#comments-${postId} .filter-btn`);
            filterButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Update filter and expand to show results
            state.currentFilter = filterType;
            if (filterType !== 'all') {
                state.showAllComments = true;
            }
            
            renderComments(postId);
        }

        // Update comments count
        function updateCommentsCount(postId, count) {
            const countEl = document.getElementById(`comments-count-${postId}`);
            if (countEl) {
                countEl.textContent = count === 0 ? 'No comments yet' :
                    count === 1 ? '1 Comment' :
                    `${count} Comments`;
            }
        }

        // Show empty comments state
        function showEmptyCommentsState(postId) {
            const commentsList = document.getElementById(`comments-list-${postId}`);
            if (commentsList) {
                commentsList.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #8e8e8e;">
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px; opacity: 0.5;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <p>Be the first to comment!</p>
                    </div>
                `;
            }
            updateCommentsCount(postId, 0);
        }

        // Get user initials for avatar
        function getUserInitials(name) {
            if (!name) return 'U';
            const cleanName = name.replace('@', '').trim();
            
            // Handle full names like "Chris Hoar" -> "CH"
            if (cleanName.includes(' ')) {
                return cleanName.split(' ')
                    .filter(word => word.length > 0)
                    .map(word => word.charAt(0).toUpperCase())
                    .join('')
                    .slice(0, 2);
            }
            
            // Handle single names like "chris" -> "CR" (first 2 chars)
            return cleanName.toUpperCase().slice(0, 2);
        }

        // Update post comment count in UI
        async function updatePostCommentCount(postId) {
            const supabase = window.authSupabase || window.masterSupabase;
            
            try {
                const { data: comments, error } = await supabase
                    .from('post_comments')
                    .select('id')
                    .eq('post_id', postId);

                if (error) throw error;

                const commentCount = comments.length;
                const button = document.querySelector(`[data-post-id="${postId}"] .action-btn:nth-child(2)`);
                if (button) {
                    button.innerHTML = `💬 ${commentCount}`;
                }

            } catch (error) {
                console.error('Error updating comment count:', error);
            }
        }

        async function toggleLike(postId, buttonElement) {
            if (!currentUser) {
                alert('Please log in to like posts');
                return;
            }

            const supabase = window.authSupabase || window.masterSupabase;
            
            try {
                const isLiked = buttonElement.classList.contains('liked');
                
                if (isLiked) {
                    // Remove like
                    await supabase
                        .from('post_likes')
                        .delete()
                        .eq('post_id', postId)
                        .eq('user_id', currentUser.id);
                    
                    buttonElement.classList.remove('liked');
                } else {
                    // Add like
                    await supabase
                        .from('post_likes')
                        .insert([{
                            post_id: postId,
                            user_id: currentUser.id
                        }]);
                    
                    buttonElement.classList.add('liked');
                }
                
                // Update like count display
                await updatePostLikeCount(postId);

            } catch (error) {
                console.error('Error toggling like:', error);
            }
        }

        async function updatePostLikeCount(postId) {
            const supabase = window.authSupabase || window.masterSupabase;
            
            try {
                const { data: likes, error } = await supabase
                    .from('post_likes')
                    .select('id')
                    .eq('post_id', postId);

                if (error) throw error;

                const likeCount = likes.length;
                const button = document.querySelector(`[data-post-id="${postId}"] .action-btn`);
                if (button) {
                    button.innerHTML = `❤️ ${likeCount}`;
                }

            } catch (error) {
                console.error('Error updating like count:', error);
            }
        }

        function openImageModal(imageUrl) {
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            
            modalImage.src = imageUrl;
            modal.classList.add('active');
        }

        function openCollageModal(postId, imageIndex) {
            // For now, just open the image modal with the main image
            const post = allPostsCache.find(p => p.id === postId);
            if (post && post.media_url) {
                const images = parseMediaUrls(post.media_url);
                if (images[imageIndex]) {
                    openImageModal(images[imageIndex]);
                }
            }
        }

        function closeImageModal() {
            const modal = document.getElementById('imageModal');
            modal.classList.remove('active');
        }

        function sharePost(postId) {
            const url = `${window.location.origin}${window.location.pathname}?post=${postId}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'DCF Hungary Community Post',
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    alert('Post link copied to clipboard!');
                });
            }
        }

        function scrollToComments(postId) {
            const commentsSection = document.getElementById(`comments-${postId}`);
            commentsSection.scrollIntoView({ behavior: 'smooth' });
        }

        function openCreatePost() {
            // This would open a create post modal or navigate to create post page
            alert('Create post functionality would be implemented here');
        }

        function refreshFeed() {
            currentPage = 0;
            hasMorePosts = true;
            allPostsCache = [];
            loadPosts();
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function updateStats() {
            const container = document.getElementById('statsContainer');
            const totalPosts = allPostsCache.length;
            
            // Calculate today's posts
            const today = new Date().toDateString();
            const todayPosts = allPostsCache.filter(post => 
                new Date(post.created_at).toDateString() === today
            ).length;
            
            // Calculate this week's posts
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const weekPosts = allPostsCache.filter(post => 
                new Date(post.created_at) > oneWeekAgo
            ).length;
            
            container.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">${totalPosts}</div>
                    <div class="stat-label">Total Posts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${todayPosts}</div>
                    <div class="stat-label">Today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${weekPosts}</div>
                    <div class="stat-label">This Week</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">42</div>
                    <div class="stat-label">Active Members</div>
                </div>
            `;
        }

        function showEmptyState(message) {
            const container = document.getElementById('postsContainer');
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Posts Available</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="openCreatePost()">Create First Post</button>
                </div>
            `;
        }

        function getInitials(name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }

        function formatTimeAgo(dateString) {
            const now = new Date();
            const date = new Date(dateString);
            const diff = now - date;
            
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            
            if (minutes < 1) return 'just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            
            return date.toLocaleDateString();
        }

        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeImageModal();
            }
        });

        // Close modal on outside click
        document.getElementById('imageModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });

        // ===== WORLD-CLASS FUNCTIONS =====
        
        // POST BOX SETUP
        function setupPostBox() {
            console.log('🎯 Setting up post box...');
            
            const avatar = document.getElementById('postBoxAvatar');
            if (avatar && currentUser) {
                const initials = getUserInitials(currentUser.username || currentUser.name || 'U');
                avatar.textContent = initials;
                console.log('✅ Avatar set to:', initials);
            }
            
            const content = document.getElementById('postContent');
            if (content && currentUser) {
                content.placeholder = `What's on your mind, ${currentUser.name || currentUser.username}?`;
                console.log('✅ Placeholder set for user:', currentUser.name);
            }
            
            // Initialize character counter
            if (content) {
                updateCharCounter(content);
            }
        }

        function updateCharCounter(textarea) {
            const count = textarea.value.length;
            const counter = document.getElementById('charCounter');
            if (counter) counter.textContent = `${count}/2000`;
            
            const postBtn = document.getElementById('submitPostBtn');
            if (postBtn) postBtn.disabled = count === 0;
        }

        function selectMedia() {
            const input = document.getElementById('mediaInput');
            if (input) input.click();
        }

        // HANDLE MEDIA SELECTION
        function handleMediaSelect(e) {
            const files = Array.from(e.target.files);
            
            const validationResult = validateFiles(files);
            if (!validationResult.valid) {
                showError(validationResult.error);
                return;
            }
            
            mediaFiles = [...mediaFiles, ...files];
            renderMediaPreviews();
            updateCharCounter(document.getElementById('postContent'));
        }

        function validateFiles(files) {
            const totalFiles = mediaFiles.length + files.length;
            if (totalFiles > 4) {
                return { valid: false, error: 'Maximum 4 files allowed per post' };
            }
            
            const hasVideo = files.some(f => f.type.startsWith('video/')) || 
                            mediaFiles.some(f => f.type.startsWith('video/'));
            if (hasVideo && totalFiles > 1) {
                return { valid: false, error: 'Videos cannot be mixed with other files' };
            }
            
            for (const file of files) {
                if (!isValidFileType(file)) {
                    return { valid: false, error: `Invalid file type: ${file.name}` };
                }
                if (file.size > 10 * 1024 * 1024) {
                    return { valid: false, error: `File too large: ${file.name} (max 10MB)` };
                }
            }
            
            return { valid: true };
        }

        function isValidFileType(file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
            return validTypes.includes(file.type);
        }

        function renderMediaPreviews() {
            const grid = document.getElementById('mediaPreviewGrid');
            
            if (mediaFiles.length === 0) {
                grid.style.display = 'none';
                grid.innerHTML = '';
                return;
            }
            
            grid.style.display = 'grid';
            grid.innerHTML = mediaFiles.map((file, index) => {
                const isVideo = file.type.startsWith('video/');
                const url = URL.createObjectURL(file);
                
                return `
                    <div class="media-preview">
                        ${isVideo ? 
                            `<video src="${url}" muted></video>` :
                            `<img src="${url}" alt="Preview">`
                        }
                        <button class="media-remove" onclick="removeMedia(${index})">×</button>
                        <div class="upload-progress">
                            <div class="progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function removeMedia(index) {
            mediaFiles.splice(index, 1);
            renderMediaPreviews();
            updateCharCounter(document.getElementById('postContent'));
        }

        // UPLOAD WITH PROGRESS
        async function uploadWithProgress(files) {
            const supabase = window.authSupabase || window.masterSupabase;
            const uploadedUrls = [];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const timestamp = Date.now();
                const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const path = `posts/${currentUser.id}/${filename}`;
                
                try {
                    console.log(`📤 Uploading ${file.name}...`);
                    
                    const { data, error } = await supabase.storage
                        .from('media')
                        .upload(path, file, {
                            onUploadProgress: (progress) => {
                                const percent = (progress.loaded / progress.total) * 100;
                                updateUploadProgress(i, percent);
                            }
                        });
                    
                    if (error) throw error;
                    
                    const { data: { publicUrl } } = supabase.storage
                        .from('media')
                        .getPublicUrl(path);
                    
                    uploadedUrls.push(publicUrl);
                    updateUploadProgress(i, 100);
                    console.log(`✅ Uploaded: ${file.name}`);
                    
                } catch (error) {
                    console.error(`❌ Upload failed: ${file.name}`, error);
                    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
                }
            }
            
            return uploadedUrls;
        }

        function updateUploadProgress(fileIndex, percent) {
            const progressBars = document.querySelectorAll('.media-preview .progress-bar');
            if (progressBars[fileIndex]) {
                progressBars[fileIndex].style.width = `${percent}%`;
            }
        }

        // POST SUBMISSION
        function submitPost() {
            console.log('Post function called');
            const textarea = document.getElementById('postContent');
            const content = textarea.value.trim();
            if (!content) {
                alert('Please enter some content');
                return;
            }
            alert('Post submitted: ' + content);
            textarea.value = '';
            updateCharCounter(textarea);
        }

        function determineMediaType(urls) {
            if (urls.length === 0) return null;
            
            const hasVideo = urls.some(url => url.includes('video') || url.includes('.mp4'));
            const hasImage = urls.some(url => url.includes('image') || url.match(/\.(jpg|jpeg|png|gif|webp)/i));
            
            if (hasVideo && hasImage) return 'mixed';
            if (hasVideo) return 'video';
            if (hasImage) return 'image';
            return null;
        }

        function clearPostForm() {
            console.log('🧹 Clearing post form...');
            const textarea = document.getElementById('postContent');
            textarea.value = '';
            mediaFiles = [];
            renderMediaPreviews();
            updateCharCounter(textarea);
        }

        // SORTING SYSTEM
        function changeSorting(sortType) {
            currentSort = sortType;
            currentPage = 0;
            hasMorePosts = true;
            feedPosts = [];
            
            // Update active button
            document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-sort="${sortType}"]`).classList.add('active');
            
            // Load posts with new sorting
            loadFeedWithSorting(sortType);
        }

        async function loadFeedWithSorting(sortType, page = 0) {
            if (isLoading) return;
            
            isLoading = true;
            updateFeedStatus('Loading posts...');
            
            if (page === 0) {
                showLoadingSkeleton();
            }
            
            try {
                const supabase = window.authSupabase || window.masterSupabase;
                const { query, order } = SORT_OPTIONS[sortType];
                
                console.log(`📊 Loading feed: ${sortType}, page: ${page}`);
                
                const { data: posts, error } = await supabase
                    .from('posts')
                    .select(`*, user_profiles(username, name, avatar_url)`)
                    .eq('status', 'active')
                    .order(query, { ascending: order === 'asc' })
                    .range(page * postsPerPage, (page + 1) * postsPerPage - 1);
                
                if (error) throw error;
                
                if (posts.length < postsPerPage) {
                    hasMorePosts = false;
                }
                
                if (page === 0) {
                    feedPosts = posts;
                } else {
                    feedPosts = [...feedPosts, ...posts];
                }
                
                renderFeed();
                updateFeedStatus(`${feedPosts.length} posts loaded`);
                
            } catch (error) {
                console.error('❌ FEED LOADING FAILED:', error);
                showError(`Failed to load feed: ${error.message}`);
            } finally {
                isLoading = false;
                hideLoadingSkeleton();
            }
        }

        // FEED RENDERING
        function renderFeed() {
            const container = document.getElementById('premiumFeed');
            
            if (feedPosts.length === 0) {
                container.innerHTML = `
                    <div class="feed-end">
                        <div class="end-message">
                            <span class="end-icon">📝</span>
                            <span class="end-text">No posts yet. Be the first to share!</span>
                        </div>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = feedPosts.map(post => createPremiumPostHTML(post)).join('');
        }

        function createPremiumPostHTML(post) {
            const author = post.user_profiles || {};
            const authorName = author.username || author.name || 'Unknown User';
            const authorInitials = getUserInitials(authorName);
            const timeAgo = formatTimeAgo(post.created_at);
            
            const mediaUrls = JSON.parse(post.media_url || '[]');
            const mediaHTML = mediaUrls.length > 0 ? renderMediaGrid(mediaUrls, post.id) : '';
            
            return `
                <div class="premium-post" data-post-id="${post.id}">
                    <div class="post-header">
                        <div class="author-avatar">
                            ${author.avatar_url ? 
                                `<img src="${author.avatar_url}" alt="${authorName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                                authorInitials
                            }
                        </div>
                        <div class="post-meta">
                            <div class="author-name">@${authorName}</div>
                            <div class="post-time">${timeAgo}</div>
                        </div>
                    </div>
                    
                    ${post.content ? `
                        <div class="post-content">
                            <div class="post-text">${processPostText(post.content)}</div>
                        </div>
                    ` : ''}
                    
                    ${mediaHTML}
                    
                    <div class="post-actions">
                        <button class="action-btn ${post.user_liked ? 'liked' : ''}" onclick="togglePostLike('${post.id}', this)">
                            ❤️ ${post.like_count || 0}
                        </button>
                        <button class="action-btn" onclick="scrollToComments('${post.id}')">
                            💬 ${post.comment_count || 0}
                        </button>
                        <button class="action-btn" onclick="sharePost('${post.id}')">
                            🔗 Share
                        </button>
                    </div>
                    
                    <div class="comments-section" id="comments-${post.id}">
                        <!-- Comments will be loaded here -->
                    </div>
                </div>
            `;
        }

        function renderMediaGrid(mediaUrls, postId) {
            if (mediaUrls.length === 0) return '';
            
            if (mediaUrls.length === 1) {
                const url = mediaUrls[0];
                const isVideo = url.includes('.mp4') || url.includes('video');
                
                return `
                    <div class="media-grid">
                        <div class="single-media" onclick="openLightbox('${url}', 0, ${JSON.stringify(mediaUrls).replace(/"/g, '&quot;')})">
                            ${isVideo ? 
                                `<video src="${url}" muted loop playsinline></video>` :
                                `<img src="${url}" alt="Post media" loading="lazy">`
                            }
                        </div>
                    </div>
                `;
            }
            
            // Multiple media grid
            const gridClass = `media-${Math.min(mediaUrls.length, 4)}`;
            
            return `
                <div class="media-grid">
                    <div class="multi-media ${gridClass}">
                        ${mediaUrls.slice(0, 4).map((url, index) => {
                            const isVideo = url.includes('.mp4') || url.includes('video');
                            const showOverlay = index === 3 && mediaUrls.length > 4;
                            
                            return `
                                <div class="media-item" onclick="openLightbox('${url}', ${index}, ${JSON.stringify(mediaUrls).replace(/"/g, '&quot;')})">
                                    ${isVideo ? 
                                        `<video src="${url}" muted></video>` :
                                        `<img src="${url}" alt="Post media" loading="lazy">`
                                    }
                                    ${showOverlay ? `
                                        <div class="media-overlay">
                                            +${mediaUrls.length - 4}
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        function processPostText(text) {
            // Escape HTML
            const div = document.createElement('div');
            div.textContent = text;
            let escaped = div.innerHTML;
            
            // Make URLs clickable
            escaped = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
            
            // Make @mentions clickable
            escaped = escaped.replace(/(@[a-zA-Z0-9_]+)/g, '<a href="#" class="mention" style="color: #0095f6; text-decoration: none; font-weight: 600;">$1</a>');
            
            // Make hashtags clickable
            escaped = escaped.replace(/(#[a-zA-Z0-9_]+)/g, '<a href="#" class="hashtag" style="color: #0095f6; text-decoration: none; font-weight: 600;">$1</a>');
            
            return escaped;
        }

        // LIGHTBOX GALLERY
        function openLightbox(url, index, allUrls) {
            // Implementation for full-screen media viewer
            console.log('🖼️ Opening lightbox:', url, index);
            // For now, use the existing modal
            openImageModal(url);
        }

        // INFINITE SCROLL
        function setupInfiniteScroll() {
            let scrollTimeout;
            
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (isLoading || !hasMorePosts) return;
                    
                    const scrollPosition = window.innerHeight + window.scrollY;
                    const threshold = document.body.offsetHeight - 1000;
                    
                    if (scrollPosition >= threshold) {
                        currentPage++;
                        loadFeedWithSorting(currentSort, currentPage);
                    }
                }, 100);
            });
        }

        // UI UTILITIES
        function showLoadingSkeleton() {
            document.getElementById('feedLoading').style.display = 'block';
        }

        function hideLoadingSkeleton() {
            document.getElementById('feedLoading').style.display = 'none';
        }

        function updateFeedStatus(message) {
            const statusEl = document.querySelector('.feed-status .status-text');
            if (statusEl) {
                statusEl.textContent = message;
            }
        }

        function showError(message) {
            console.error('❌ ERROR:', message);
            alert(`❌ ${message}`);
        }

        function showSuccess(message) {
            console.log('✅ SUCCESS:', message);
            alert(`✅ ${message}`);
        }

        function getUserInitials(name) {
            if (!name) return 'U';
            const cleanName = name.replace('@', '').trim();
            
            if (cleanName.includes(' ')) {
                return cleanName.split(' ')
                    .filter(word => word.length > 0)
                    .map(word => word.charAt(0).toUpperCase())
                    .join('')
                    .slice(0, 2);
            }
            
            return cleanName.toUpperCase().slice(0, 2);
        }

        function formatTimeAgo(dateString) {
            const now = new Date();
            const date = new Date(dateString);
            const diff = now - date;
            
            const minutes = Math.floor(diff / 60000);
            if (minutes < 1) return 'now';
            if (minutes < 60) return `${minutes}m ago`;
            
            const hours = Math.floor(diff / 3600000);
            if (hours < 24) return `${hours}h ago`;
            
            const days = Math.floor(diff / 86400000);
            if (days < 7) return `${days}d ago`;
            
            return date.toLocaleDateString();
        }

        // LEGACY COMPATIBILITY
        function togglePostLike(postId, buttonElement) {
            // Implement like functionality
            console.log('❤️ Toggle like:', postId);
        }

        function scrollToComments(postId) {
            const commentsSection = document.getElementById(`comments-${postId}`);
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        function sharePost(postId) {
            const url = `${window.location.origin}${window.location.pathname}?post=${postId}`;
            if (navigator.share) {
                navigator.share({ url });
            } else {
                navigator.clipboard.writeText(url);
                showSuccess('Link copied to clipboard!');
            }
        }

