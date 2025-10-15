import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/entries - Starting request')
    
    const supabase = await createClient()
    console.log('Supabase client created')
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log('User check:', user ? 'authenticated' : 'not authenticated')

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()
    console.log('Content received:', content)

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Save the entry to the database
    console.log('Attempting to save entry to database')
    const { data, error } = await supabase
      .from('entries')
      .insert({
        user_id: user.id,
        content: content.trim(),
        entry_type: 'text',
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Database error saving entry:', error)
      return NextResponse.json({ error: 'Failed to save entry: ' + error.message }, { status: 500 })
    }

    console.log('Entry saved successfully:', data[0])
    return NextResponse.json({ success: true, entry: data[0] })
  } catch (error) {
    console.error('Entry creation error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get today's entries
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }

    return NextResponse.json({ entries: data })
  } catch (error) {
    console.error('Entry fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
