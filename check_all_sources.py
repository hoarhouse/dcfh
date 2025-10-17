import os
import re

htmldocs_dir = "vatican-resources/htmldocs/"

print("🔍 CHECKING ALL HTMLDOCS SOURCE LINKS...\n")

for filename in sorted(os.listdir(htmldocs_dir)):
    if filename.endswith('.html') and not filename.startswith('test'):
        filepath = os.path.join(htmldocs_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the Official Source line
        match = re.search(r'Official Source:.*?</p>', content, re.DOTALL)
        
        if match:
            source_text = match.group(0)
            # Extract just the link
            link_match = re.search(r'href="([^"]+)"', source_text)
            if link_match:
                link = link_match.group(1)
                
                # Check if it's a proper Vatican or Crux link
                if 'vatican.va' in link:
                    print(f"✅ {filename}")
                    print(f"   {link}\n")
                elif 'cruxnow.com' in link:
                    print(f"❌ {filename} - CRUX LINK (COPYRIGHTED)")
                    print(f"   {link}\n")
                else:
                    print(f"⚠️  {filename} - UNKNOWN SOURCE")
                    print(f"   {link}\n")
            else:
                print(f"⚠️  {filename} - NO LINK FOUND\n")
        else:
            print(f"❌ {filename} - NO SOURCE LINE FOUND\n")

print("\n✅ CHECK COMPLETE")
