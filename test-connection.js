#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testing Humility Recovery Assistant Connection...\n');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    // Test basic connection
    console.log('1. 🔗 Testing Supabase connection...');
    const { error } = await supabase.from('entries').select('count');
    
    if (error && error.code === 'PGRST116') {
      console.log('   ❌ Tables not found - please run the database schema first!');
      console.log('   📋 Go to: SQL Editor → New Query → Paste schema → Run');
      return;
    } else if (error) {
      console.log('   ❌ Connection error:', error.message);
      return;
    }
    
    console.log('   ✅ Connection successful!');
    
    // Test table access
    console.log('\n2. 📊 Testing table access...');
    const tables = ['entries', 'daily_summaries', 'analytics'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`   ❌ ${table} table: ${error.message}`);
      } else {
        console.log(`   ✅ ${table} table: accessible`);
      }
    }
    
    console.log('\n3. 🔐 Testing Row Level Security...');
    const { error: testError } = await supabase
      .from('entries')
      .select('*')
      .limit(1);
    
    if (testError && testError.code === 'PGRST301') {
      console.log('   ✅ RLS is working - anonymous access blocked (expected)');
    } else {
      console.log('   ⚠️  RLS status unclear');
    }
    
    console.log('\n🎉 All tests completed! Your Humility Recovery Assistant is ready!');
    console.log('\n📱 Next steps:');
    console.log('   1. Start your app: npm run dev');
    console.log('   2. Sign up for an account');
    console.log('   3. Start tracking your humility journey!');
    
  } catch (err) {
    console.log('❌ Test failed:', err.message);
  }
}

testConnection();





