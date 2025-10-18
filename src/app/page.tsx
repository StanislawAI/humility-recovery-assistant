import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, go to dashboard
  if (user) {
    redirect('/dashboard')
  }

  // If not authenticated, show password protection first
  redirect('/password-protection')
}
