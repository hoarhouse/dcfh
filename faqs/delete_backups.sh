#!/bin/bash
# Delete all backup files and folders from FAQs directory

echo "=================================="
echo "BACKUP FILE DELETION SCRIPT"
echo "=================================="
echo ""

# Find backup folders
echo "=== BACKUP FOLDERS TO DELETE ==="
folders=$(find . -type d \( -name "*backup*" -o -name "*BACKUP*" -o -name "*bak*" \) 2>/dev/null)
if [ -z "$folders" ]; then
    echo "No backup folders found"
else
    echo "$folders"
fi
echo ""

# Find backup files (exclude this script and certain system files)
echo "=== BACKUP FILES TO DELETE ==="
files=$(find . -type f \( -name "*.backup" -o -name "*.bak" -o -name "*.old" -o -name "*.tmp" -o -name "*_BACKUP*" -o -name "*_backup*" -o -name "*_old*" -o -name "*.prelink_backup" -o -name "*backup.html" -o -name "*backup.dump" -o -name "*backup.sql" \) ! -name "delete_backups.sh" 2>/dev/null)
if [ -z "$files" ]; then
    echo "No backup files found"
else
    echo "$files"
fi
echo ""

# Count items
folder_count=0
file_count=0
if [ ! -z "$folders" ]; then
    folder_count=$(echo "$folders" | wc -l | tr -d ' ')
fi
if [ ! -z "$files" ]; then
    file_count=$(echo "$files" | wc -l | tr -d ' ')
fi
total_count=$((folder_count + file_count))

echo "=== SUMMARY ==="
echo "Folders to delete: $folder_count"
echo "Files to delete: $file_count"
echo "Total items: $total_count"
echo ""

if [ $total_count -eq 0 ]; then
    echo "✅ No backup files or folders to delete!"
    exit 0
fi

echo "=================================="
echo "⚠️  WARNING: This will permanently delete all backup files!"
echo "=================================="
echo ""
echo "Proceed with deletion? (y/n): "
read -r confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo ""
    echo "Deleting backups..."
    
    # Delete folders
    if [ ! -z "$folders" ]; then
        echo "$folders" | while read -r folder; do
            if [ -d "$folder" ]; then
                rm -rf "$folder"
                echo "  ✓ Deleted folder: $folder"
            fi
        done
    fi
    
    # Delete files
    if [ ! -z "$files" ]; then
        echo "$files" | while read -r file; do
            if [ -f "$file" ]; then
                rm -f "$file"
                echo "  ✓ Deleted file: $file"
            fi
        done
    fi
    
    echo ""
    echo "✅ All backup files and folders deleted!"
else
    echo ""
    echo "❌ Deletion cancelled - no files were removed"
fi