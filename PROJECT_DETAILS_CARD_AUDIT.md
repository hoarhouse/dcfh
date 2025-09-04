# Project Details Card Data Source Audit

## Summary
The project details card in `dcf_project_detail.html` (lines 1971-1974) is showing **100% HARDCODED placeholder values** instead of pulling from the database.

## Current Hardcoded Display
```html
<p><strong>Status:</strong> Active</p>
<p><strong>Created:</strong> 2 weeks ago</p>
<p><strong>Timeline:</strong> 6 months</p>
<p><strong>Priority:</strong> High</p>
```

## Database Field Analysis

### ✅ Fields AVAILABLE in Database (from dcf_create_project.html):

1. **status** - EXISTS ✅
   - Database column: `projects.status`
   - Currently set to: `'active'` on creation (line 1661)
   - Display shows: Hardcoded "Active"

2. **created_at** - EXISTS ✅
   - Database column: `projects.created_at`
   - Set to: `new Date().toISOString()` on creation (line 1662)
   - Display shows: Hardcoded "2 weeks ago"

3. **timeline** - EXISTS ✅
   - Database column: `projects.timeline`
   - Captured from form: `projectData.timeline` (line 1652)
   - Display shows: Hardcoded "6 months"

4. **priority** - DOES NOT EXIST ❌
   - No database column found
   - Not captured in create form
   - Display shows: Hardcoded "High"

## Other Available Fields Not Displayed:
- `goal` - Project goal/mission
- `website_url` - Project website
- `category` - Project category
- `team_size` - Expected team size
- `location` - Project location (default: 'Remote')
- `skills` - Required skills
- `notes` - Additional notes

## Code Location Analysis

### Where Project Data is Loaded:
- **File**: `dcf_project_detail.html`
- **Line 2089**: Project data query
```javascript
const { data: project, error } = await window.dcfSupabase
    .from('projects')
    .select(`*, author:user_profiles!author_id(...)`)
    .eq('id', projectId)
    .single();
```

### Where Details Card is Displayed:
- **File**: `dcf_project_detail.html`
- **Lines 1969-1976**: Hardcoded HTML
```html
<div style="background: white; border-radius: 12px; padding: 1.5rem;">
    <h3>Project Details</h3>
    <div>
        <p><strong>Status:</strong> Active</p>
        <p><strong>Created:</strong> 2 weeks ago</p>
        <p><strong>Timeline:</strong> 6 months</p>
        <p><strong>Priority:</strong> High</p>
    </div>
</div>
```

## Fix Requirements

### Phase 1 - Connect Existing Fields (Quick Fix):
Replace hardcoded values with actual database fields:
1. **Status** → Use `project.status` (capitalize first letter)
2. **Created** → Format `project.created_at` as relative time
3. **Timeline** → Use `project.timeline` value

### Phase 2 - Add Missing Field:
1. Add `priority` column to projects table (if needed)
2. Update create/edit forms to capture priority
3. Display real priority value

### Sample Implementation:
```javascript
// Add to displayProject function
function setProjectDetailsCard(project) {
    const detailsCard = document.getElementById('projectDetailsCard');
    if (!detailsCard) return;
    
    // Format created date as relative time
    const createdDate = new Date(project.created_at);
    const daysAgo = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
    const createdText = daysAgo === 0 ? 'Today' : 
                       daysAgo === 1 ? 'Yesterday' :
                       daysAgo < 7 ? `${daysAgo} days ago` :
                       daysAgo < 30 ? `${Math.floor(daysAgo/7)} weeks ago` :
                       `${Math.floor(daysAgo/30)} months ago`;
    
    detailsCard.innerHTML = `
        <h3>Project Details</h3>
        <div>
            <p><strong>Status:</strong> ${capitalizeFirst(project.status || 'active')}</p>
            <p><strong>Created:</strong> ${createdText}</p>
            <p><strong>Timeline:</strong> ${project.timeline || 'Not specified'}</p>
            <p><strong>Priority:</strong> ${project.priority || 'Normal'}</p>
        </div>
    `;
}
```

## Conclusion

**Current State**: 0% real data - all fields hardcoded
**Available to Fix**: 75% - status, created_at, timeline exist in database
**Missing**: 25% - priority field doesn't exist in database

The project details card can be immediately fixed to show 3 out of 4 real values from the database. Only the Priority field would need to be added to the database schema to make it fully functional.