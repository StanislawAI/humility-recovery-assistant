const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables');
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const sql = fs.readFileSync('./supabase/migrations/20251016_add_via_classifications.sql', 'utf8');

async function runMigration() {
    console.log('🚀 Applying VIA Classifications migration...\n');
    
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
        try {
            console.log('Executing statement...');
            const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
            
            if (error) {
                console.log('⚠️  RPC method not available, trying alternative...');
                console.log('\nPlease run this SQL manually in the Supabase SQL Editor:\n');
                console.log('----------------------------------------');
                console.log(sql);
                console.log('----------------------------------------');
                process.exit(1);
            }
        } catch (err) {
            console.log('⚠️  Error:', err.message);
        }
    }

    console.log('\n✅ Migration completed!');
    console.log('\nIf you see errors above, please run the SQL manually:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy the contents of supabase/migrations/20251016_add_via_classifications.sql');
    console.log('3. Paste and run it');
}

runMigration();
