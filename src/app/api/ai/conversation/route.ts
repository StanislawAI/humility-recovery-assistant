import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRecentConversationHistory } from '@/lib/conversations'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent conversation history
    const messages = await getRecentConversationHistory(user.id, 20)

    return NextResponse.json({
      messages,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching conversation history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
