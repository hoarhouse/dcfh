function createResourceItem(resource) {
    const item = document.createElement('div');
    item.className = 'post-item';
    item.dataset.resourceId = resource.id;

    const uploadDate = new Date(resource.created_at).toLocaleDateString();
    const fileSize = resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A';
    
    item.innerHTML = `
        <div class="post-checkbox">
            <input type="checkbox" onchange="toggleResourceSelection('${resource.id}', this.checked)">
        </div>
        
        <div class="post-content">
            <div class="post-main">
                <div class="post-info">
                    <div class="post-title">
                        <span>${escapeHtml(resource.title)}</span>
                        <div class="post-slug" onclick="copySlug('${resource.slug}')" title="Click to copy slug">
                            ${resource.slug}
                        </div>
                    </div>
                    
                    <div class="post-meta">
                        <span class="status-badge status-${resource.status}">${resource.status}</span>
                        <span>${escapeHtml(resource.type)}</span>
                        <span>By ${escapeHtml(resource.author_name)}</span>
                        <span>${uploadDate}</span>
                        <span>${fileSize}</span>
                    </div>
                    
                    <div class="post-excerpt">${escapeHtml((resource.description || resource.excerpt || '').substring(0, 150))}...</div>
                </div>
                
                <div class="post-stats">
                    <div>Downloads: ${resource.download_count || 0}</div>
                    <div>Views: ${resource.view_count || 0}</div>
                    <div>Rating: ${resource.rating_average || 0}/5</div>
                </div>
            </div>
        </div>
        
        <div class="post-actions">
            ${resource.status === 'pending' ? `
                <button onclick="approveResource('${resource.id}')" class="action-btn primary">Approve</button>
                <button onclick="rejectResource('${resource.id}')" class="action-btn danger">Reject</button>
            ` : ''}
            <button onclick="copySlug('${resource.slug}')" class="action-btn">Copy Slug</button>
            <a href="../resources/dcf_resource_detail.html?id=${resource.id}" target="_blank" class="action-btn">View</a>
            <button onclick="deleteResource('${resource.id}')" class="action-btn danger">Delete</button>
        </div>
    `;

    return item;
}

async function approveResource(resourceId) {
    await updateResourceStatus(resourceId, 'approved');
}

async function rejectResource(resourceId) {
    await updateResourceStatus(resourceId, 'rejected');
}

async function updateResourceStatus(resourceId, newStatus) {
    try {
        const { error } = await window.dcfSupabase
            .from('resources')
            .update({ status: newStatus })
            .eq('id', resourceId);

        if (error) throw error;
        showToast(`Resource ${newStatus} successfully`, 'success');
        loadData();
    } catch (error) {
        console.error('Error updating resource status:', error);
        showToast('Error updating resource status', 'error');
    }
}

function copySlug(slug) {
    navigator.clipboard.writeText(slug).then(() => {
        showToast('Slug copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy slug', 'error');
    });
}

function refreshResources() {
    loadData();
}