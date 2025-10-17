#!/usr/bin/env python3
"""
Build all 6 remaining Pope Leo XIV pages
"""
import requests
from bs4 import BeautifulSoup
import json
import re
import uuid
from supabase import create_client

SUPABASE_URL = "https://atzommnkkwzgbktuzjti.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_content(url):
    """Fetch and extract paragraphs from Vatican/news URL"""
    print(f"  Fetching: {url}")
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    paragraphs = soup.find_all('p')
    
    # Filter to content paragraphs only
    content_paras = []
    for p in paragraphs:
        text = p.get_text(strip=True)
        # Skip short, title, copyright, navigation paragraphs
        if (len(text) > 100 and 
            'Copyright' not in text and 
            'MESSAGE OF' not in text and
            'Palazzo Piacentini' not in text and
            'POPE LEO XIV' not in text[:30]):
            content_paras.append(text)
    
    print(f"  Found {len(content_paras)} content paragraphs")
    return content_paras

def build_html_page(doc_info, paragraphs, resource_id):
    """Build complete HTML page from template"""
    
    # Build paragraph HTML
    html_paras = '\n'.join([f'                    <p class="htmldoc-paragraph">{p}</p>' for p in paragraphs])
    html_paras += '\n                    <p class="htmldoc-paragraph" style="text-align: right; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e5e5; font-weight: 600;">LEO PP. XIV</p>'
    
    # Read template
    with open('vatican-resources/htmldocs/antiqua-et-nova-2025.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace metadata
    html = re.sub(r'<title>.*?</title>', 
                  f'<title>{doc_info["title"]} | DCF Hungary</title>', html)
    
    html = re.sub(r'<meta name="description" content=".*?">', 
                  f'<meta name="description" content="{doc_info["description"]}">', html)
    
    html = re.sub(r'<h1 class="htmldoc-title">.*?</h1>', 
                  '<h1 class="htmldoc-title">Pope Leo XIV</h1>', html, flags=re.DOTALL)
    
    html = re.sub(r'<h2 class="htmldoc-subtitle">.*?</h2>', 
                  f'<h2 class="htmldoc-subtitle">{doc_info["subtitle"]}</h2>', html, flags=re.DOTALL)
    
    # Replace content
    pattern = r'(<div class="htmldoc-content">)(.*?)(<div class="back-link-section")'
    replacement = r'\1\n' + html_paras + '\n                    \3'
    html = re.sub(pattern, replacement, html, flags=re.DOTALL)
    
    # Update source link
    html = re.sub(
        r'<p><strong>Official Source:</strong>.*?</p>',
        f'<p><strong>Official Source:</strong> <a href="{doc_info["vatican_url"]}" target="_blank">View Original →</a></p>',
        html
    )
    
    # Replace resource ID
    old_id = "f9fd315b-f6a8-4a54-aecf-b11150e19c80"
    html = html.replace(old_id, resource_id)
    
    # Remove duplicate scripts
    script_pattern = r'(<script src="../../js/dcf-core\.js"></script>.*?<script src="../../js/dcf-init\.js"></script>)'
    matches = re.findall(script_pattern, html, flags=re.DOTALL)
    if len(matches) > 1:
        for i in range(1, len(matches)):
            html = html.replace(matches[i], '', 1)
    
    # Remove duplicate tracking
    tracking_pattern = r'<script>\s*//\s*Resource tracking.*?</script>'
    tracking_matches = re.findall(tracking_pattern, html, flags=re.DOTALL)
    if len(tracking_matches) > 1:
        for i in range(1, len(tracking_matches)):
            html = html.replace(tracking_matches[i], '', 1)
    
    return html

def add_to_database(doc_info, resource_id):
    """Add resource to Supabase"""
    resource = {
        "id": resource_id,
        "title": doc_info["title"],
        "description": doc_info["description"],
        "file_url": doc_info["vatican_url"],
        "file_type": "htmldocs",
        "author_name": "Pope Leo XIV",
        "author_email": "documents@vatican.va",
        "organization": "Vatican / DCF Hungary",
        "language": "English",
        "type": "document",
        "tags": doc_info["tags"],
        "collection": "Vatican Documents",
        "status": "published",
        "is_featured": False,
        "page_url": f"https://hoarhouse.github.io/dcfh/vatican-resources/htmldocs/{doc_info['filename']}.html",
        "slug": doc_info["filename"],
        "created_at": f"{doc_info['date']}T12:00:00+00:00",
        "published_at": f"{doc_info['date']}T12:00:00+00:00"
    }
    
    supabase.table('resources').insert(resource).execute()
    print(f"  ✅ Added to database")

def main():
    # Load document list
    with open('pope_leo_documents.json', 'r') as f:
        documents = json.load(f)
    
    print(f"\n🚀 Building {len(documents)} Pope Leo XIV pages...\n")
    
    for i, doc in enumerate(documents, 1):
        print(f"[{i}/{len(documents)}] {doc['title']}")
        
        try:
            # Generate UUID
            resource_id = str(uuid.uuid4())
            
            # Fetch content
            paragraphs = fetch_content(doc['vatican_url'])
            
            if len(paragraphs) < 2:
                print(f"  ⚠️  WARNING: Only {len(paragraphs)} paragraphs found - check URL")
                continue
            
            # Build HTML
            html = build_html_page(doc, paragraphs, resource_id)
            
            # Save file
            filename = f"vatican-resources/htmldocs/{doc['filename']}.html"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"  ✅ Created: {filename}")
            
            # Add to database
            add_to_database(doc, resource_id)
            
            print()
            
        except Exception as e:
            print(f"  ❌ ERROR: {e}")
            print()
    
    print("🎉 ALL PAGES CREATED!")
    print("\nNext steps:")
    print("1. Review pages locally")
    print("2. git add vatican-resources/htmldocs/pope-leo*.html")
    print("3. git commit -m 'add 6 pope leo xiv pages'")
    print("4. git push")

if __name__ == "__main__":
    main()
