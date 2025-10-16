const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://mdwafgltbtgnqaplfhol.supabase.co';
const SERVICE_ROLE_KEY = '[REDACTED:jwt-token]';

const sql = fs.readFileSync('./supabase/migrations/20251015_add_recovery_features.sql', 'utf8');

const data = JSON.stringify({ query: sql });

const options = {
  hostname: 'mdwafgltbtgnqaplfhol.supabase.co',
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ Migration applied successfully!');
    } else {
      console.log('\n❌ Migration failed. Trying alternative method...');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
  console.log('\nℹ️  Please run the SQL manually in Supabase Dashboard');
});

req.write(data);
req.end();
