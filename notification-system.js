// notification-system.js
// Add this script to your dcf_member_home.html to enable automatic notifications

class NotificationSystem {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.currentUser = {
            name: localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson',
            email: localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org'
        };
    }

    // Create notification for post likes
    async createLikeNotification(postId, postAuthorEmail, postAuthorName, postContent) {
        try {
            // Don't notify if user likes their own post
            if (postAuthorEmail === this.currentUser.email) {
                return;
            }

            const { error } = await this.supabase
                .from('notifications')
                .insert({
                    type: 'post_like',
                    title: 'Someone liked your post',
                    message: `${this.currentUser.name} liked your post: "${this.truncateText(postContent, 50)}"`,
                    recipient_email: postAuthorEmail,
                    recipient_name: postAuthorName,
                    sender_email: this.currentUser.email,
                    sender_name: this.currentUser.name,
                    related_id: postId,
                    related_type: 'post'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error creating like notification:', error);
        }
    }

    // Create notification for post comments
    async createCommentNotification(postId, postAuthorEmail, postAuthorName, commentContent) {
        try {
            // Don't notify if user comments on their own post
            if (postAuthorEmail === this.currentUser.email) {
                return;
            }

            const { error } = await this.supabase
                .from('notifications')
                .insert({
                    type: 'post_comment',
                    title: 'New comment on your post',
                    message: `${this.currentUser.name} commented: "${this.truncateText(commentContent, 50)}"`,
                    recipient_email: postAuthorEmail,
                    recipient_name: postAuthorName,
                    sender_email: this.currentUser.email,
                    sender_name: this.currentUser.name,
                    related_id: postId,
                    related_type: 'post'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error creating comment notification:', error);
        }
    }

    // Create notification for mentions in posts/comments
    async createMentionNotification(mentionedUserEmail, mentionedUserName, postId, content) {
        try {
            // Don't notify if user mentions themselves
            if (mentionedUserEmail === this.currentUser.email) {
                return;
            }

            const { error } = await this.supabase
                .from('notifications')
                .insert({
                    type: 'post_mention',
                    title: 'You were mentioned in a post',
                    message: `${this.currentUser.name} mentioned you: "${this.truncateText(content, 50)}"`,
                    recipient_email: mentionedUserEmail,
                    recipient_name: mentionedUserName,
                    sender_email: this.currentUser.email,
                    sender_name: this.currentUser.name,
                    related_id: postId,
                    related_type: 'post'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error creating mention notification:', error);
        }
    }

    // Create notification for project updates
    async createProjectNotification(projectId, projectName, message, memberEmails) {
        try {
            const notifications = memberEmails
                .filter(email => email !== this.currentUser.email) // Don't notify the creator
                .map(email => ({
                    type: 'project_update',
                    title: `Project Update: ${projectName}`,
                    message: message,
                    recipient_email: email,
                    recipient_name: 'Project Member', // You might want to get actual names
                    sender_email: this.currentUser.email,
                    sender_name: this.currentUser.name,
                    related_id: projectId,
                    related_type: 'project'
                }));

            if (notifications.length > 0) {
                const { error } = await this.supabase
                    .from('notifications')
                    .insert(notifications);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error creating project notification:', error);
        }
    }

    // Create notification for new member joins
    async createMemberJoinNotification(newMemberName, newMemberEmail, allMemberEmails) {
        try {
            const notifications = allMemberEmails
                .filter(email => email !== newMemberEmail) // Don't notify the new member
                .map(email => ({
                    type: 'member_join',
                    title: 'New member joined DCF Hungary',
                    message: `${newMemberName} has joined the community. Welcome them!`,
                    recipient_email: email,
                    recipient_name: 'Community Member',
                    sender_email: 'system@dcfhungary.org',
                    sender_name: 'DCF Hungary System',
                    related_id: newMemberEmail,
                    related_type: 'member'
                }));

            if (notifications.length > 0) {
                const { error } = await this.supabase
                    .from('notifications')
                    .insert(notifications);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error creating member join notification:', error);
        }
    }

    // Create notification for event reminders
    async createEventReminder(eventId, eventName, eventDateTime, attendeeEmails) {
        try {
            const notifications = attendeeEmails.map(email => ({
                type: 'event_reminder',
                title: `Event Reminder: ${eventName}`,
                message: `Your event "${eventName}" is coming up on ${new Date(eventDateTime).toLocaleDateString()}.`,
                recipient_email: email,
                recipient_name: 'Event Attendee',
                sender_email: 'events@dcfhungary.org',
                sender_name: 'DCF Hungary Events',
                related_id: eventId,
                related_type: 'event'
            }));

            if (notifications.length > 0) {
                const { error } = await this.supabase
                    .from('notifications')
                    .insert(notifications);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error creating event reminder:', error);
        }
    }

    // Create system notification for all users
    async createSystemNotification(title, message, userEmails) {
        try {
            const notifications = userEmails.map(email => ({
                type: 'system_update',
                title: title,
                message: message,
                recipient_email: email,
                recipient_name: 'DCF Hungary Member',
                sender_email: 'system@dcfhungary.org',
                sender_name: 'DCF Hungary System',
                related_id: null,
                related_type: 'system'
            }));

            if (notifications.length > 0) {
                const { error } = await this.supabase
                    .from('notifications')
                    .insert(notifications);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error creating system notification:', error);
        }
    }

    // Utility function to truncate text
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Get unread notification count for a user
    async getUnreadCount(userEmail = null) {
        try {
            const email = userEmail || this.currentUser.email;
            const { count, error } = await this.supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_email', email)
                .eq('is_read', false);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    // Update notification badge in navbar
    async updateNotificationBadge() {
        try {
            const count = await this.getUnreadCount();
            const badge = document.getElementById('notificationBadge');
            
            if (badge) {
                if (count > 0) {
                    badge.textContent = count > 99 ? '99+' : count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error updating notification badge:', error);
        }
    }
}

// Integration functions for your existing dcf_member_home.html

// Modified like function that creates notifications
async function likePostWithNotification(postId) {
    try {
        const currentUserEmail = localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org';
        const currentUserName = localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson';

        // Check if already liked
        const { data: existingLike, error: checkError } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_email', currentUserEmail)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingLike) {
            // Unlike
            const { error: deleteError } = await supabase
                .from('post_likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_email', currentUserEmail);

            if (deleteError) throw deleteError;
        } else {
            // Like and create notification
            const { error: insertError } = await supabase
                .from('post_likes')
                .insert({
                    post_id: postId,
                    user_email: currentUserEmail,
                    user_name: currentUserName
                });

            if (insertError) throw insertError;

            // The notification will be created automatically by the database trigger
            // But if you want to create it manually, get post details first:
            /*
            const { data: postData } = await supabase
                .from('posts')
                .select('author_email, author_name, content')
                .eq('id', postId)
                .single();
            
            if (postData) {
                await notificationSystem.createLikeNotification(
                    postId, 
                    postData.author_email, 
                    postData.author_name, 
                    postData.content
                );
            }
            */
        }

        // Update UI
        updatePostLikes(postId);
        
    } catch (error) {
        console.error('Error liking post:', error);
        showError('Failed to like post');
    }
}

// Modified comment function that creates notifications
async function addCommentWithNotification(postId, content) {
    try {
        const currentUserEmail = localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org';
        const currentUserName = localStorage.getItem('dcf_user_name') || 'Dr. Sarah Johnson';

        const { error } = await supabase
            .from('post_comments')
            .insert({
                post_id: postId,
                content: content,
                author_email: currentUserEmail,
                author_name: currentUserName
            });

        if (error) throw error;

        // The notification will be created automatically by the database trigger
        // Update UI
        loadComments(postId);
        
    } catch (error) {
        console.error('Error adding comment:', error);
        showError('Failed to add comment');
    }
}

// Initialize notification system when page loads
let notificationSystem;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize notification system
    if (typeof supabase !== 'undefined') {
        notificationSystem = new NotificationSystem(supabase);
        
        // Update notification badge on page load
        notificationSystem.updateNotificationBadge();
        
        // Subscribe to real-time updates for badge
        supabase
            .channel('notification-badge')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_email=eq.${localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org'}`
            }, () => {
                notificationSystem.updateNotificationBadge();
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_email=eq.${localStorage.getItem('dcf_user_email') || 'sarah.johnson@dcfhungary.org'}`
            }, () => {
                notificationSystem.updateNotificationBadge();
            })
            .subscribe();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}