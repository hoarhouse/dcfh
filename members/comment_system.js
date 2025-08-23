// ==================== COMMENT SYSTEM ====================
// Global variables for comment management
let currentComments = [];
let currentSort = 'newest';
let userCommentLikes = new Set();

// Initialize comments when profile loads
async function initComments() {
    const contentId = currentUser ? currentUser.id : null;
    if (!contentId) {
        console.error('No user ID available for comments');
        return;
    }
    await loadComments();
}

async function loadComments() {
    try {
        const contentId = currentUser ? currentUser.id : null;
        if (!contentId) return;

        const { data: comments, error } = await window.dcfSupabase
            .from('comments')
            .select('*')
            .eq('content_type', 'profile')
            .eq('content_id', contentId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Store comments globally for sorting
        currentComments = comments || [];
        
        // Load user interactions
        await loadUserCommentInteractions();
        
        // Apply current sort
        await sortComments(currentSort);
        
        // Update comment count
        const totalComments = await getTotalCommentCount();
        const commentCountElement = document.getElementById('totalComments');
        if (commentCountElement) {
            commentCountElement.textContent = totalComments;
        }

    } catch (error) {
        console.error('Error loading comments:', error);
        await showAlert('Failed to load comments', 'error');
    }
}

async function displayComments(comments) {
    const container = document.getElementById('commentsList');
    
    if (comments.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #666; padding: 2rem;">
                💬 No comments yet. Be the first to leave a message!
            </div>
        `;
        return;
    }

    // Filter top-level comments (no parent_id)
    const topLevelComments = comments.filter(comment => !comment.parent_comment_id);
    
    const commentsHtml = await Promise.all(topLevelComments.map(async comment => {
        const replies = comments.filter(c => c.parent_comment_id === comment.id);
        return createCommentHtml(comment, replies);
    }));

    container.innerHTML = commentsHtml.join('');
    
    // Update UI states for top-level comments only
    updateAllCommentUIs(topLevelComments);
}

async function createCommentHtml(comment, replies = []) {
    const currentUser = window.getCurrentUser();
    const isAuthor = currentUser && (comment.author_id === currentUser.id || comment.author_email === currentUser.email);
    const isLiked = userCommentLikes.has(comment.id);
    const authorInitials = comment.author_name ? comment.author_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    const timeAgo = getTimeAgo(comment.created_at);
    
    const repliesHtml = replies.length > 0 ? `
        <div class="replies">
            ${replies.map(reply => createReplyHtml(reply)).join('')}
        </div>
    ` : '';
    
    return `
        <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <div class="comment-avatar">${authorInitials}</div>
                <div class="comment-main-line">
                    <span class="comment-username">${comment.author_name || 'Anonymous'}</span>
                    <span class="comment-text-inline" data-original-text="${escapeHtml(comment.comment_text)}">${escapeHtml(comment.comment_text)}</span>
                </div>
            </div>
            <div class="comment-footer-line">
                <span class="comment-date">${timeAgo}</span>
                <div class="comment-controls-inline">
                    <button class="comment-btn like-btn ${isLiked ? 'liked' : ''}" id="like-btn-${comment.id}" onclick="toggleCommentLike('${comment.id}')">
                        <span class="like-icon">${isLiked ? '❤️' : '🤍'}</span>
                        <span class="like-count" id="like-count-${comment.id}">${comment.like_count || 0}</span>
                    </button>
                    <button class="comment-btn" onclick="toggleReplyForm('${comment.id}')">💬 Reply</button>
                    ${isAuthor ? `
                        <button class="comment-btn" onclick="startEditComment('${comment.id}')">✏️ Edit</button>
                        <button class="comment-btn delete" onclick="deleteComment('${comment.id}')">🗑️ Delete</button>
                    ` : ''}
                </div>
            </div>
            <div class="edit-form" id="edit-form-${comment.id}">
                <textarea class="reply-textarea" id="edit-textarea-${comment.id}">${comment.comment_text}</textarea>
                <div class="reply-actions">
                    <button class="btn btn-primary" onclick="saveEditComment('${comment.id}')">Save</button>
                    <button class="btn btn-secondary" onclick="cancelEditComment('${comment.id}')">Cancel</button>
                </div>
            </div>
            <div class="reply-form" id="reply-form-${comment.id}">
                <textarea class="reply-textarea" id="replyText-${comment.id}" placeholder="Write a reply..."></textarea>
                <div class="reply-actions">
                    <button class="btn btn-primary" onclick="submitReply('${comment.id}')">Reply</button>
                    <button class="btn btn-secondary" onclick="toggleReplyForm('${comment.id}')">Cancel</button>
                </div>
            </div>
            ${repliesHtml}
        </div>
    `;
}

function createReplyHtml(reply) {
    const currentUser = window.getCurrentUser();
    const isAuthor = currentUser && (reply.author_id === currentUser.id || reply.author_email === currentUser.email);
    const authorInitials = reply.author_name ? reply.author_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    const timeAgo = getTimeAgo(reply.created_at);
    
    return `
        <div class="comment reply" data-comment-id="${reply.id}">
            <div class="comment-header">
                <div class="comment-avatar">${authorInitials}</div>
                <div class="comment-main-line">
                    <span class="comment-username">${reply.author_name || 'Anonymous'}</span>
                    <span class="comment-text-inline">${escapeHtml(reply.comment_text)}</span>
                </div>
            </div>
            <div class="comment-footer-line">
                <span class="comment-date">${timeAgo}</span>
                ${isAuthor ? `
                    <div class="comment-controls-inline">
                        <button class="comment-btn delete" onclick="deleteComment('${reply.id}')">🗑️ Delete</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

async function submitComment() {
    const textarea = document.getElementById('commentText');
    const commentText = textarea.value.trim();
    
    if (!commentText) {
        await showAlert('Please enter a comment', 'warning');
        return;
    }
    
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        await showAlert('Please log in to comment', 'warning');
        return;
    }
    
    try {
        const { error } = await window.dcfSupabase
            .from('comments')
            .insert([{
                content_type: 'profile',
                content_id: currentUser.id,
                comment_text: commentText,
                author_id: currentUser.id,
                author_email: currentUser.email,
                author_name: currentUser.name || currentUser.username || currentUser.email.split('@')[0],
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        textarea.value = '';
        await loadComments();
        await showAlert('Comment posted successfully', 'success');
        
    } catch (error) {
        console.error('Error posting comment:', error);
        await showAlert('Failed to post comment', 'error');
    }
}

async function submitReply(parentId) {
    const textarea = document.getElementById(`replyText-${parentId}`);
    const replyText = textarea.value.trim();
    
    if (!replyText) {
        await showAlert('Please enter a reply', 'warning');
        return;
    }
    
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        await showAlert('Please log in to reply', 'warning');
        return;
    }
    
    try {
        const profileId = window.currentProfile ? window.currentProfile.id : currentUser.id;
        const { error } = await window.dcfSupabase
            .from('comments')
            .insert([{
                content_type: 'profile',
                content_id: profileId,
                parent_comment_id: parentId,
                comment_text: replyText,
                author_id: currentUser.id,
                author_email: currentUser.email,
                author_name: currentUser.name || currentUser.username || currentUser.email.split('@')[0],
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        textarea.value = '';
        toggleReplyForm(parentId);
        await loadComments();
        
    } catch (error) {
        console.error('Error posting reply:', error);
        await showAlert('Failed to post reply', 'error');
    }
}

async function deleteComment(commentId) {
    const confirmed = await showConfirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;
    
    try {
        const { error } = await window.dcfSupabase
            .from('comments')
            .delete()
            .eq('id', commentId);
        
        if (error) throw error;
        
        const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentElement) {
            commentElement.remove();
        }
        
        await showAlert('Comment deleted successfully', 'success');
        await loadComments();
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        await showAlert('Failed to delete comment', 'error');
    }
}

function toggleReplyForm(commentId) {
    const form = document.getElementById(`reply-form-${commentId}`);
    if (form) {
        form.classList.toggle('active');
    }
}

function startEditComment(commentId) {
    const editForm = document.getElementById(`edit-form-${commentId}`);
    const commentText = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
    
    if (editForm && commentText) {
        editForm.classList.add('active');
        commentText.style.display = 'none';
        
        const textarea = document.getElementById(`edit-textarea-${commentId}`);
        if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }
}

async function saveEditComment(commentId) {
    const textarea = document.getElementById(`edit-textarea-${commentId}`);
    if (!textarea) return;
    
    const newText = textarea.value.trim();
    if (!newText) {
        await showAlert('Comment cannot be empty', 'warning');
        return;
    }
    
    try {
        let commentTextElement = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
        const originalText = commentTextElement?.getAttribute('data-original-text') || '';
        
        if (originalText === newText) {
            cancelEditComment(commentId);
            return;
        }
        
        await editComment(commentId, newText, 'User edit');
        
        // Update the specific comment's display text
        commentTextElement = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
        if (commentTextElement) {
            commentTextElement.textContent = newText;
            commentTextElement.setAttribute('data-original-text', newText);
        }
        
        // Exit edit mode
        cancelEditComment(commentId);
        
    } catch (error) {
        console.error('Error saving edit:', error);
        await showAlert('Failed to save changes', 'error');
    }
}

async function editComment(commentId, newText, editReason = 'User edit') {
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }
    
    try {
        const { error: updateError } = await window.dcfSupabase
            .from('comments')
            .update({
                comment_text: newText,
                updated_at: new Date().toISOString()
            })
            .eq('id', commentId)
            .eq('author_email', currentUser.email);
        
        if (updateError) throw updateError;
        
    } catch (error) {
        console.error('Error editing comment:', error);
        throw error;
    }
}

function cancelEditComment(commentId) {
    const editForm = document.getElementById(`edit-form-${commentId}`);
    const commentText = document.querySelector(`[data-comment-id="${commentId}"] .comment-text-inline`);
    
    if (editForm) {
        editForm.classList.remove('active');
    }
    if (commentText) {
        commentText.style.display = '';
    }
}

async function toggleCommentLike(commentId) {
    const currentUser = window.getCurrentUser();
    if (!currentUser) {
        await showAlert('Please log in to like comments', 'warning');
        return;
    }
    
    try {
        const isLiked = userCommentLikes.has(commentId);
        
        if (isLiked) {
            // Remove like
            const { error } = await window.dcfSupabase
                .from('comment_likes')
                .delete()
                .eq('comment_id', commentId)
                .eq('user_id', currentUser.id);
            if (error) throw error;
            
            userCommentLikes.delete(commentId);
        } else {
            // Add like
            const { error } = await window.dcfSupabase
                .from('comment_likes')
                .insert([{
                    comment_id: commentId,
                    user_id: currentUser.id,
                    user_email: currentUser.email,
                    user_name: currentUser.name || currentUser.username || currentUser.email.split('@')[0],
                    created_at: new Date().toISOString()
                }]);
            if (error) throw error;
            
            userCommentLikes.add(commentId);
        }
        
        // Update UI
        await updateCommentLikeCount(commentId);
        updateLikeUI(commentId);
        
    } catch (error) {
        console.error('Error toggling like:', error);
        await showAlert('Failed to update like', 'error');
    }
}

async function updateCommentLikeCount(commentId) {
    try {
        const { data, error } = await window.dcfSupabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', commentId);
        
        if (error) throw error;
        
        const likeCount = data.length;
        const likeCountElement = document.getElementById(`like-count-${commentId}`);
        
        if (likeCountElement) {
            likeCountElement.textContent = likeCount;
        }
        
    } catch (error) {
        console.error('Error updating like count:', error);
    }
}

function updateLikeUI(commentId) {
    const likeButton = document.getElementById(`like-btn-${commentId}`);
    if (likeButton) {
        const isLiked = userCommentLikes.has(commentId);
        const likeIcon = likeButton.querySelector('.like-icon');
        
        if (likeIcon) {
            likeIcon.textContent = isLiked ? '❤️' : '🤍';
        }
        
        if (isLiked) {
            likeButton.classList.add('liked');
        } else {
            likeButton.classList.remove('liked');
        }
    }
}

async function loadUserCommentInteractions() {
    const currentUser = window.getCurrentUser();
    if (!currentUser) return;
    
    try {
        // Load user's likes
        const { data: likes, error } = await window.dcfSupabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', currentUser.id);
        
        if (!error && likes) {
            userCommentLikes = new Set(likes.map(l => l.comment_id));
        }
    } catch (error) {
        console.error('Error loading user interactions:', error);
    }
}

async function sortComments(sortType) {
    currentSort = sortType;
    
    // Update sort button states
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'white';
        btn.style.color = '#666';
        btn.style.border = '1px solid #e5e5e5';
    });
    
    const activeBtn = document.getElementById(`sort-${sortType}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = '#000';
        activeBtn.style.color = 'white';
        activeBtn.style.border = 'none';
    }
    
    let sortedComments = [...currentComments];
    
    switch(sortType) {
        case 'newest':
            sortedComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'liked':
            sortedComments.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
            break;
        case 'replies':
            sortedComments.sort((a, b) => (b.reply_count || 0) - (a.reply_count || 0));
            break;
    }
    
    await displayComments(sortedComments);
}

async function getTotalCommentCount() {
    try {
        const contentId = currentUser ? currentUser.id : null;
        if (!contentId) return 0;

        const { data, error } = await window.dcfSupabase
            .from('comments')
            .select('id')
            .eq('content_type', 'profile')
            .eq('content_id', contentId);
        
        return data ? data.length : 0;
    } catch (error) {
        console.error('Error getting comment count:', error);
        return 0;
    }
}

function updateAllCommentUIs(comments) {
    comments.forEach(comment => {
        updateLikeUI(comment.id);
    });
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle Enter key for comment submission
document.addEventListener('DOMContentLoaded', function() {
    const commentTextarea = document.getElementById('commentText');
    if (commentTextarea) {
        commentTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitComment();
            }
        });
    }
});