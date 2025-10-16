#!/usr/bin/env node
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const file = process.argv[2]
  if (!file) {
    console.error('Usage: node scripts/apply-sql.js <path-to-sql-file>')
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const sql = fs.readFileSync(file, 'utf8')
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  console.log(`🚀 Applying SQL: ${file}`)
  // Try whole file first (preserve statement order and dependencies)
  let wholeRan = false
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    if (!error) {
      console.log('  • whole file ... ok')
      wholeRan = true
    }
  } catch (e) {
    // fall through to per-statement
  }

  if (!wholeRan) {
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      process.stdout.write(`  • ${i + 1}/${statements.length} ... `)
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: stmt })
        if (error) {
          console.log(`⚠️  ${error.message}`)
          console.log('\nIf RPC is unavailable, run the SQL manually in Supabase SQL Editor:')
          console.log(`\n----- BEGIN SQL (${file}) -----\n` + sql + '\n----- END SQL -----\n')
          process.exit(1)
        }
        console.log('ok')
      } catch (e) {
        console.log(`⚠️  ${e.message}`)
        process.exit(1)
      }
    }
  }

  console.log('✅ Done')
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})


