'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
  <Button variant="ghost" size="sm" onClick={handleLogout}>
  <LogOut className="h-4 w-4 mr-2" />
  Back to Landing
  </Button>
  )
}


