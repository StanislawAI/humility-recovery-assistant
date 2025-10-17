import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const checks: Record<string, string> = {}
  const errors: string[] = []

  // Env checks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const googleKey = process.env.GOOGLE_AI_API_KEY

  checks.SUPABASE_URL = supabaseUrl ? 'present' : 'missing'
  checks.SUPABASE_ANON = supabaseAnon ? 'present' : 'missing'
  checks.GOOGLE_AI_API_KEY = googleKey ? 'present' : 'missing'

  if (!supabaseUrl) errors.push('NEXT_PUBLIC_SUPABASE_URL missing')
  if (!supabaseAnon) errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY missing')
  if (!googleKey) errors.push('GOOGLE_AI_API_KEY missing')

  // Supabase connectivity (anonymous select on a lightweight table if possible)
  try {
    const supabase = await createClient()
    // Try a harmless RPC: get auth user, which should succeed (even if null)
    await supabase.auth.getUser()
    checks.SUPABASE_CONNECTIVITY = 'ok'
  } catch (e) {
    checks.SUPABASE_CONNECTIVITY = 'error'
    errors.push('Supabase connectivity failed')
  }

  const status = errors.length === 0 ? 200 : 500
  return NextResponse.json({ status: status === 200 ? 'ok' : 'error', checks, errors }, { status })
}


