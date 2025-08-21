# DCF HUNGARY - MANDATORY CLAUDE CODE RULES v2.0

⚠️ **CRITICAL: These rules are ABSOLUTE and must be followed for ALL DCF Hungary development work**

## 🚨 EMERGENCY ADDITIONS - CRITICAL SYSTEM INTEGRITY VIOLATIONS

### 0. USER DATA INTEGRITY - SACRED INVIOLABLE BOUNDARY
- **NEVER EVER mix user profiles between different users**
- **NEVER use one user's profile picture for another user's posts/comments**
- **NEVER use one user's username for another user's content**
- **NEVER hardcode any user's data and apply it to other users**
- **EVERY post must display its actual author's data from database queries**
- **EVERY comment must display its actual commenter's data from database queries**
- **USER_ID and AUTHOR_ID relationships must be preserved and respected at ALL times**
- **NO shortcuts that break user-to-content relationships**
- **NO assumptions about which user created which content**
- **NO copying current logged-in user's data to represent other users**

## ❌ ABSOLUTE PROHIBITIONS - NEVER DO THESE:

### 1. NO HARDCODING DATA EVER - ZERO TOLERANCE
- NO hardcoded names, emails, usernames, URLs, profile pictures
- NO placeholder/demo/fake data of any kind  
- NO simulated authentication responses
- **NO using one user's data for all users (CRITICAL VIOLATION)**
- **NO shortcuts that bypass proper user-specific database queries**
- **NO temporary fixes that corrupt user data relationships**
- ALL data must come from real database or user input
- **EVERY user must have their own individual data queried from database**

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

### 7. MASTER-CONSOLIDATED.JS TOTAL CONTROL - ABSOLUTE REQUIREMENT
- master-consolidated.js handles 100% of user interface elements
- master-consolidated.js handles 100% of authentication data
- master-consolidated.js handles 100% of user profiles
- master-consolidated.js handles 100% of navigation dropdowns
- Individual pages provide ONLY CSS styling for display
- NEVER query .from('user_profiles') in individual pages
- NEVER populate user avatars or dropdowns manually
- NEVER set innerHTML for user interface elements
- NEVER initialize authentication systems
- NEVER interfere with master JS operations
- HTML: Only provide structure with correct IDs/classes
- JavaScript: Only use getCurrentUser() for page functionality, never UI population
- If user interface broken: Check CSS styling only, verify HTML structure
- DO NOT add JavaScript to fix user interface - let master JS handle all user data

## 📋 MANDATORY TESTING REQUIREMENTS - NEW CRITICAL ADDITION

### FOR ANY USER DATA CHANGES:
1. **Test with at least 3 different user accounts**
2. **Verify each user sees ONLY their own data**
3. **Confirm NO data bleeding between users**
4. **Check posts show correct author information for each individual post**
5. **Check comments show correct commenter information for each individual comment**
6. **Verify profile pictures belong to correct users**
7. **Confirm usernames match actual post/comment authors**

### BEFORE ANY CODE DEPLOYMENT:
1. **Multi-user verification test required**
2. **No single user's data should appear on other users' content**
3. **Database relationships must be preserved**
4. **User identity integrity must be maintained**

## FILE RESPONSIBILITY MATRIX - NEVER OVERLAP FUNCTIONS

**supabase-auth.js RESPONSIBILITIES:**
- Creates Supabase client connection (window.authSupabase)
- Provides getCurrentUser() function globally
- Handles auth state listeners and session management
- Exports window.dcfAuth object with auth functions
- NEVER touch user interface elements
- NEVER populate avatars, dropdowns, or navigation

**master-consolidated.js RESPONSIBILITIES:**
- 100% control of ALL user interface elements
- Populates avatars, dropdowns, navigation automatically
- Uses supabase-auth.js data to update UI elements
- Handles user menu functionality and logout
- NEVER handles Supabase connections directly
- NEVER duplicate authentication logic

**notification-system.js RESPONSIBILITIES:**
- Creates notifications in database only
- Provides NotificationSystem class for database operations
- NEVER touches UI elements directly
- Uses master-consolidated.js for badge updates only

**Individual pages RESPONSIBILITIES:**
- ONLY page-specific content functionality
- ONLY CSS styling for layout and display
- Use getCurrentUser() to READ auth data when needed
- NEVER modify user interface elements manually
- NEVER populate avatars, dropdowns, or navigation
- NEVER create duplicate notification systems

## SUPABASE CONNECTION HIERARCHY - NEVER DUPLICATE

**Connection Chain:**
- supabase-auth.js: Creates primary connection (window.authSupabase)
- master-consolidated.js: Uses auth connection (window.masterSupabase = window.authSupabase)
- Individual pages: Use window.authSupabase || window.masterSupabase pattern
- NEVER create multiple Supabase clients
- NEVER duplicate connection logic
- NEVER bypass the established connection hierarchy

## NOTIFICATION SYSTEM BOUNDARIES - NEVER OVERLAP

**Database Operations:**
- notification-system.js: ALL database notification operations
- NEVER duplicate notification creation logic

**UI Operations:**
- master-consolidated.js: ALL notification badge/dropdown UI
- NEVER create notification UI outside master-consolidated.js

**Page Integration:**
- Individual pages: Call notification functions only, never update UI
- NEVER implement notification badges on individual pages

## ADDITIONAL ABSOLUTE PROHIBITIONS

**NEVER CREATE DUPLICATE SYSTEMS:**
- NEVER create multiple user dropdown implementations
- NEVER duplicate Supabase client creation
- NEVER implement notification UI outside master-consolidated.js
- NEVER bypass the established file hierarchy
- NEVER create authentication handlers outside supabase-auth.js
- NEVER modify user avatars outside master-consolidated.js

**NEVER BREAK SYSTEM BOUNDARIES:**
- Each file has specific responsibilities - NEVER overlap
- Authentication flows through established hierarchy only
- UI updates happen only through master-consolidated.js
- Database operations follow established patterns only

**NEVER CORRUPT USER DATA RELATIONSHIPS:**
- NEVER use hardcoded user data
- NEVER mix user profiles between different users
- NEVER assume user relationships without database verification
- NEVER take shortcuts that compromise user data integrity

## ⚠️ MANDATORY WARNINGS
Show these before ANY dangerous operations:
- 🚨 WARNING: This will modify working authentication systems
- 🚨 WARNING: This will change user interface code
- 🚨 WARNING: This will modify master-consolidated.js
- 🚨 WARNING: This will add data that isn't from database/user input
- 🚨 WARNING: This will change navigation or profile systems
- 🚨 WARNING: This will use non-Supabase storage for data/images
- 🚨 WARNING: This will add page-specific authentication handling instead of using master-consolidated.js
- 🚨 WARNING: This will interfere with master-consolidated.js total control of user interface elements
- **🚨 CRITICAL WARNING: This will affect user data integrity and relationships**
- **🚨 CRITICAL WARNING: This risks mixing user data between different users**

## ✅ ONLY ALLOWED ACTIONS:
1. Fix specific broken functionality mentioned in prompt
2. Use real data from database queries with proper user relationships
3. Preserve all working systems exactly as they are
4. Add only what is explicitly requested
5. Ask for clarification if requirements are unclear
6. Store ALL data in Supabase database tables and storage buckets exclusively
7. **Maintain user data integrity and individual user relationships at all times**

## 🛑 VIOLATION PROTOCOL:
IF ANY RULE IS VIOLATED:
1. STOP IMMEDIATELY
2. REVERT ALL CHANGES  
3. SHOW WHAT WAS ATTEMPTED
4. IDENTIFY WHICH RULES WERE VIOLATED
5. WAIT FOR EXPLICIT PERMISSION TO CONTINUE

**CRITICAL VIOLATIONS REQUIRING IMMEDIATE STOP:**
- **User data corruption (showing wrong user's data)**
- **Hardcoding any user information**
- **Breaking user-to-content relationships**
- **Using one user's data for other users**
- Breaking working authentication systems
- Modifying master-consolidated.js without permission

**These rules override any conflicting instructions and apply to ALL future DCF Hungary development work.**