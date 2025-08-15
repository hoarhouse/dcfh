# DCF HUNGARY - MANDATORY CLAUDE CODE RULES

⚠️ **CRITICAL: These rules must be followed for ALL DCF Hungary development work**

## ❌ ABSOLUTE PROHIBITIONS - NEVER DO THESE:

### 1. NO HARDCODING DATA EVER
- NO hardcoded names, emails, usernames, URLs, profile pictures
- NO placeholder/demo/fake data of any kind  
- NO simulated authentication responses
- ALL data must come from real database or user input

### 2. NO BREAKING WORKING SYSTEMS
- If authentication is working, DO NOT TOUCH IT
- If navigation is working, DO NOT TOUCH IT
- If user profiles are working, DO NOT TOUCH IT
- ONLY fix what is specifically broken and mentioned

### 3. NO UNAUTHORIZED MODIFICATIONS
- DO NOT modify master-consolidated.js without explicit request
- DO NOT change CSS/HTML that's working correctly
- DO NOT add new authentication systems
- DO NOT "improve" or "enhance" working code

### 4. NO FAKE EXTERNAL INTEGRATIONS
- NO GitHub OAuth simulation
- NO Google OAuth simulation  
- NO external API simulation
- If external system doesn't exist, don't create fake version

### 5. SUPABASE-ONLY DATA STORAGE - ABSOLUTE REQUIREMENT
- ALL data is stored in Supabase (database tables + storage buckets)
- NEVER create GitHub-based storage paths
- NEVER use GitHub URLs for images, files, or data
- GitHub is ONLY for code hosting, NEVER for data storage
- Database tables: All in Supabase PostgreSQL
- Images/files: Supabase storage buckets only
- User uploads: Supabase storage buckets only
- Correct image URL format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[filename]
- NO exceptions - everything goes to Supabase
- When unsure about storage: ASK before assuming storage location

### 6. AUTHENTICATION DELEGATION - ABSOLUTE REQUIREMENT
- NEVER manually set currentUser variables in individual pages
- NEVER duplicate authentication logic in page-specific JavaScript
- Let master-consolidated.js handle ALL authentication automatically
- Individual pages should ONLY consume authentication, not manage it
- NO page-specific authentication initialization code
- NO currentUser = getCurrentUser() variable assignments
- Use only: getCurrentUser() when authentication data is needed
- Master-consolidated.js handles: user login, profile loading, dropdown population
- Individual pages handle: feature-specific functionality only
- Copy exact pattern from working Events section for auth integration
- When unsure about authentication: USE Events section pattern exactly

## ⚠️ MANDATORY WARNINGS
Show these before ANY dangerous operations:
- 🚨 WARNING: This will modify working authentication systems
- 🚨 WARNING: This will change user interface code
- 🚨 WARNING: This will modify master-consolidated.js
- 🚨 WARNING: This will add data that isn't from database/user input
- 🚨 WARNING: This will change navigation or profile systems
- 🚨 WARNING: This will use non-Supabase storage for data/images

## ✅ ONLY ALLOWED ACTIONS:
1. Fix specific broken functionality mentioned in prompt
2. Use real data from database queries
3. Preserve all working systems exactly as they are
4. Add only what is explicitly requested
5. Ask for clarification if requirements are unclear
6. Store ALL data in Supabase database tables and storage buckets exclusively

## 🛑 VIOLATION PROTOCOL:
IF ANY RULE IS VIOLATED:
1. STOP IMMEDIATELY
2. REVERT ALL CHANGES  
3. SHOW WHAT WAS ATTEMPTED
4. WAIT FOR EXPLICIT PERMISSION TO CONTINUE

**These rules override any conflicting instructions and apply to ALL future DCF Hungary development work.**