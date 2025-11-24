#!/bin/bash

# Phase 1: Global find/replace for summit name, dates, and terminology

echo "Starting Phase 1 Updates..."
echo "========================="

# List of files to update
FILES=(
    "about.html"
    "agenda.html"
    "agenda.js"
    "contact.html"
    "declaration.html"
    "index.html"
    "partners.html"
    "program-details.html"
    "script.js"
    "speakers.html"
    "styles.css"
    "venue.html"
    "voices.html"
)

# Change to the cyberpeace-summit directory
cd /Users/christopherhoar/Desktop/dcfh/cyberpeace-summit

# Counter for changes
NAME_CHANGES=0
DATE_CHANGES=0
TERM_CHANGES=0

# Process each file
for file in "${FILES[@]}"; do
    echo ""
    echo "Processing: $file"
    echo "-----------------"
    
    # Create backup
    cp "$file" "$file.bak"
    
    # NAME CHANGES
    # Must do in specific order to avoid double replacements
    sed -i '' 's/Global Digital Peace Summit/Global Digital \& AI Peace Summit/g' "$file"
    sed -i '' 's/Budapest Digital Peace Summit/Budapest Digital \& AI Peace Summit/g' "$file"
    sed -i '' 's/Digital Peace Summit/Digital \& AI Peace Summit/g' "$file"
    
    # DATE CHANGES
    sed -i '' 's/March 2-3, 2026/March 5-6, 2026/g' "$file"
    sed -i '' 's/March 2, 2026/March 5, 2026/g' "$file"
    sed -i '' 's/March 3, 2026/March 6, 2026/g' "$file"
    sed -i '' 's/2-3 March 2026/5-6 March 2026/g' "$file"
    sed -i '' 's/Monday, March 2/Monday, March 5/g' "$file"
    sed -i '' 's/Tuesday, March 3/Tuesday, March 6/g' "$file"
    
    # TERMINOLOGY CHANGES
    # Be careful with order to avoid double replacements
    sed -i '' 's/Budapest Declaration for Digital Peace/Budapest Declaration for Digital \& AI Peace/g' "$file"
    sed -i '' 's/Budapest Action Framework for Digital Peace/Budapest Action Framework for Digital \& AI Peace/g' "$file"
    sed -i '' 's/Integral Ecology for Digital Peace/Integral Ecology for Digital \& AI Peace/g' "$file"
    sed -i '' 's/Cyber Ceasefire/Cyber \& AI Ceasefire/g' "$file"
    sed -i '' 's/cyber ceasefire/cyber \& AI ceasefire/g' "$file"
    
    # Digital Peace (standalone) - be careful not to double-replace
    # Skip if already has "& AI"
    sed -i '' '/Digital \& AI Peace/!s/Digital Peace/Digital \& AI Peace/g' "$file"
    sed -i '' '/digital \& AI peace/!s/digital peace/digital \& AI peace/g' "$file"
    
    # Show differences
    if ! diff -q "$file.bak" "$file" > /dev/null; then
        echo "Changes made in $file:"
        diff "$file.bak" "$file" | grep "^[<>]" | head -20
    else
        echo "No changes in $file"
    fi
    
    # Remove backup
    rm "$file.bak"
done

# Update countdown timer in script.js specifically for March 5, 2026
echo ""
echo "Updating countdown timer in script.js..."
sed -i '' "s/const summitDate = new Date('2026-03-02T09:00:00'/const summitDate = new Date('2026-03-05T09:00:00'/g" script.js
sed -i '' "s/const summitDate = new Date('March 2, 2026'/const summitDate = new Date('March 5, 2026'/g" script.js

echo ""
echo "========================="
echo "Phase 1 Updates Complete!"
echo ""

# Verification
echo "Verification - Checking for old references:"
echo "==========================================="

echo ""
echo "Checking for old summit names..."
grep -n "Global Digital Peace Summit\|Budapest Digital Peace Summit\|[^&] Digital Peace Summit" *.{html,js,css} 2>/dev/null | grep -v "Digital \& AI Peace Summit" | head -10

echo ""
echo "Checking for old dates..."
grep -n "March 2-3\|March 2,\|March 3,\|2-3 March" *.{html,js,css} 2>/dev/null | head -10

echo ""
echo "Checking for old terminology..."
grep -n "Cyber Ceasefire\|[^&] Digital Peace\|digital peace" *.{html,js,css} 2>/dev/null | grep -v "\& AI" | head -10

echo ""
echo "Update complete!"