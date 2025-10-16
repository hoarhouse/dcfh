with open('dcf_ai_resources.html', 'r') as f:
    content = f.read()

old_function = '''        function applyFilters() {
            const checkboxes = document.querySelectorAll('#advancedSearchContent input[type="checkbox"]:checked');
            const filters = Array.from(checkboxes).map(cb => cb.nextElementSibling.textContent);
            
            console.log('Applied filters:', filters);
            alert(`Searching with ${filters.length} filters:\\n\\n${filters.join('\\n')}`);
            
            // TODO: Connect to actual search/filter backend
        }'''

new_function = '''        function applyFilters() {
            const checkboxes = document.querySelectorAll('#advancedSearchContent input[type="checkbox"]:checked');
            const selectedTags = Array.from(checkboxes).map(cb => cb.value);
            
            if (selectedTags.length === 0) {
                alert('Please select at least one filter');
                return;
            }
            
            console.log('Searching with tags:', selectedTags);
            searchByTags(selectedTags);
        }'''

content = content.replace(old_function, new_function)

with open('dcf_ai_resources.html', 'w') as f:
    f.write(content)

print("✅ Fixed applyFilters() to call searchByTags()")
