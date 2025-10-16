const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://mdwafgltbtgnqaplfhol.supabase.co';
const SERVICE_ROLE_KEY = '[REDACTED:jwt-token]';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const sql = fs.readFileSync('./supabase/migrations/20251015_add_recovery_features.sql', 'utf8');

async function applyMigration() {
  console.log('Applying migration...\n');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\nPlease run the migration manually in Supabase Dashboard:');
      console.log('https://supabase.com/dashboard/project/mdwafgltbtgnqaplfhol/sql/new');
    } else {
      console.log('✅ Migration applied successfully!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
    console.log('\nRunning migrations individually...\n');
    
    // Try running each statement individually
    const statements = sql.split(';').filter(s => s.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      
      console.log(`Running statement ${i + 1}/${statements.length}...`);
      try {
        const { error } = await supabase.rpc('exec', { sql: stmt + ';' });
        if (error) {
          console.log(`  ⚠️  ${error.message}`);
        } else {
          console.log(`  ✓`);
        }
      } catch (e) {
        console.log(`  ⚠️  ${e.message}`);
      }
    }
  }
}

applyMigration();
