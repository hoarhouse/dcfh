#!/usr/bin/env node

// Debug script to identify exact RLS policy mismatches
// Run this in browser console on event pages to diagnose 406 errors

async function debugRLSMismatch() {
    console.log('🔍 DEBUGGING RLS AUTH CONTEXT VS DATABASE DATA MISMATCH');
    console.log('='.repeat(60));
    
    // Get Supabase client
    const supabase = window.authSupabase || window.masterSupabase || window.supabase;
    if (!supabase) {
        console.error('❌ No Supabase client available');
        return;
    }
    
    console.log('✅ Supabase client found');
    
    // 1. CHECK AUTH CONTEXT
    console.log('\n📋 1. CURRENT AUTH CONTEXT:');
    console.log('-'.repeat(30));
    
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        const authUser = await supabase.auth.getUser();
        
        console.log('Current User Object:', user);
        console.log('User ID (auth.uid()):', user?.id);
        console.log('User Email (auth.email()):', user?.email);
        console.log('User Role:', user?.role);
        console.log('Auth Error:', userError);
        
        // Test auth helper functions
        console.log('\n🔍 Testing Auth Helper Functions:');
        try {
            const { data: testAuth } = await supabase.rpc('auth.uid');
            console.log('auth.uid() RPC result:', testAuth);
        } catch (e) {
            console.log('auth.uid() RPC error:', e.message);
        }
        
        try {
            const { data: testEmail } = await supabase.rpc('auth.email');  
            console.log('auth.email() RPC result:', testEmail);
        } catch (e) {
            console.log('auth.email() RPC error:', e.message);
        }
        
    } catch (authError) {
        console.error('❌ Auth context error:', authError);
    }
    
    // 2. CHECK EVENT OWNERSHIP DATA
    console.log('\n📋 2. EVENT OWNERSHIP DATA:');
    console.log('-'.repeat(30));
    
    try {
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('id, title, organizer_id, contact_email')
            .limit(5);
            
        if (eventsError) {
            console.error('❌ Events query error:', eventsError);
        } else {
            console.log('Sample Events:');
            events.forEach(event => {
                console.log(`  • ${event.title}`);
                console.log(`    ID: ${event.id}`);
                console.log(`    organizer_id: ${event.organizer_id}`);
                console.log(`    contact_email: ${event.contact_email}`);
            });
        }
    } catch (error) {
        console.error('❌ Events data error:', error);
    }
    
    // 3. CHECK EVENT_LIKES TABLE DATA
    console.log('\n📋 3. EVENT_LIKES TABLE DATA:');
    console.log('-'.repeat(30));
    
    try {
        const { data: likes, error: likesError } = await supabase
            .from('event_likes')
            .select('*')
            .limit(5);
            
        if (likesError) {
            console.error('❌ Event_likes query error:', likesError);
            console.error('Error details:', likesError.details);
            console.error('Error hint:', likesError.hint);
        } else {
            console.log(`✅ Found ${likes?.length || 0} likes`);
            if (likes && likes.length > 0) {
                console.log('Sample Likes Data:');
                likes.forEach(like => {
                    console.log(`  • Event: ${like.event_id}`);
                    console.log(`    user_email: "${like.user_email}"`);
                    console.log(`    user_name: "${like.user_name}"`);
                });
            }
        }
    } catch (error) {
        console.error('❌ Likes table error:', error);
    }
    
    // 4. CHECK EVENT_FOLLOWS TABLE DATA
    console.log('\n📋 4. EVENT_FOLLOWS TABLE DATA:');
    console.log('-'.repeat(30));
    
    try {
        const { data: follows, error: followsError } = await supabase
            .from('event_follows')
            .select('*')
            .limit(5);
            
        if (followsError) {
            console.error('❌ Event_follows query error:', followsError);
            console.error('Error details:', followsError.details);
            console.error('Error hint:', followsError.hint);
        } else {
            console.log(`✅ Found ${follows?.length || 0} follows`);
            if (follows && follows.length > 0) {
                console.log('Sample Follows Data:');
                follows.forEach(follow => {
                    console.log(`  • Event: ${follow.event_id}`);
                    console.log(`    user_email: "${follow.user_email}"`);
                    console.log(`    user_name: "${follow.user_name}"`);
                });
            }
        }
    } catch (error) {
        console.error('❌ Follows table error:', error);
    }
    
    // 5. CHECK EVENT_REGISTRATIONS TABLE DATA
    console.log('\n📋 5. EVENT_REGISTRATIONS TABLE DATA:');
    console.log('-'.repeat(30));
    
    try {
        const { data: registrations, error: regError } = await supabase
            .from('event_registrations')
            .select('*')
            .limit(5);
            
        if (regError) {
            console.error('❌ Event_registrations query error:', regError);
            console.error('Error details:', regError.details);
            console.error('Error hint:', regError.hint);
        } else {
            console.log(`✅ Found ${registrations?.length || 0} registrations`);
            if (registrations && registrations.length > 0) {
                console.log('Sample Registration Data:');
                registrations.forEach(reg => {
                    console.log(`  • Event: ${reg.event_id}`);
                    console.log(`    attendee_email: "${reg.attendee_email}"`);
                    console.log(`    user_id: ${reg.user_id}`);
                    console.log(`    status: ${reg.status}`);
                });
            }
        }
    } catch (error) {
        console.error('❌ Registrations table error:', error);
    }
    
    // 6. IDENTIFY MISMATCHES
    console.log('\n🔍 6. CHECKING FOR MISMATCHES:');
    console.log('-'.repeat(30));
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            const currentEmail = user.email;
            const currentId = user.id;
            
            console.log(`Current auth.email(): "${currentEmail}"`);
            console.log(`Current auth.uid(): "${currentId}"`);
            
            // Check if current user's email exists in social tables
            const { data: userLikes, error: userLikesError } = await supabase
                .from('event_likes')
                .select('user_email')
                .eq('user_email', currentEmail)
                .limit(1);
                
            if (userLikesError) {
                console.error('❌ Cannot check user likes - RLS blocking:', userLikesError.message);
            } else {
                console.log(`✅ User likes with matching email: ${userLikes?.length || 0}`);
            }
            
            // Check registrations
            const { data: userRegs, error: userRegsError } = await supabase
                .from('event_registrations')
                .select('attendee_email, user_id')
                .or(`attendee_email.eq.${currentEmail},user_id.eq.${currentId}`)
                .limit(1);
                
            if (userRegsError) {
                console.error('❌ Cannot check user registrations - RLS blocking:', userRegsError.message);
            } else {
                console.log(`✅ User registrations: ${userRegs?.length || 0}`);
            }
            
        } else {
            console.log('❌ No authenticated user - this explains 406 errors for user-specific queries');
        }
        
    } catch (error) {
        console.error('❌ Mismatch check error:', error);
    }
    
    // 7. TEST SIMPLE QUERIES THAT SHOULD WORK
    console.log('\n🧪 7. TESTING BASIC QUERIES:');
    console.log('-'.repeat(30));
    
    // Test count query (should work with public read access)
    try {
        const { count, error } = await supabase
            .from('event_likes')
            .select('*', { count: 'exact', head: true });
            
        if (error) {
            console.error('❌ Basic count query failed:', error.message);
            console.log('This indicates RLS policies are too restrictive for public read access');
        } else {
            console.log(`✅ Basic count query works: ${count} total likes`);
        }
    } catch (error) {
        console.error('❌ Count query exception:', error);
    }
    
    // 8. RECOMMENDATIONS
    console.log('\n💡 8. RECOMMENDATIONS:');
    console.log('-'.repeat(30));
    
    console.log('Based on the above analysis:');
    console.log('1. Check if auth.email() matches user_email field formats');
    console.log('2. Verify RLS policies allow public SELECT access');
    console.log('3. Ensure auth context is available when policies run');
    console.log('4. Consider email case sensitivity issues');
    console.log('5. Check if user_id fields are properly populated');
    
    console.log('\n✅ Diagnostic complete! Check the errors above to identify the root cause.');
}

// Auto-run when script is loaded in browser
if (typeof window !== 'undefined') {
    console.log('🔍 RLS Debug Script Loaded');
    console.log('Run debugRLSMismatch() to diagnose 406 errors');
    window.debugRLSMismatch = debugRLSMismatch;
} else {
    // Node.js environment
    debugRLSMismatch().catch(console.error);
}