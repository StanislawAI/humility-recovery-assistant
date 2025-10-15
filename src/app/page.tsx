'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Entry {
  id?: string
  user_id: string
  content: string
  entry_type: string
  created_at: string
}

export default function HomePage() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<Entry[]>([])
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (!user) {
        router.push('/login')
      }
    }

    getUser()
  }, [router])

  const loadTodaysEntries = useCallback(async () => {
    try {
      const supabase = createClient()
      
      // Get today's entries directly from Supabase
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching entries:', error)
        return
      }

      setEntries(data || [])
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }, [user?.id])

  useEffect(() => {
    if (user) {
      loadTodaysEntries()
    }
  }, [user, loadTodaysEntries])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    // User is authenticated, show dashboard content using functional components
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today&apos;s Journey</h1>
          <p className="text-gray-600 mt-2">
            Track your progress in growing humility today
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">New Entry</h2>
            <p className="text-gray-600 mb-4">
              How are you growing in humility today?
            </p>
            <div className="space-y-4">
              <textarea 
                id="entry-text"
                className="w-full p-3 border rounded-md" 
                placeholder="Share your thoughts on humility..."
                rows={4}
              />
              <button 
                onClick={async () => {
                  const textarea = document.getElementById('entry-text') as HTMLTextAreaElement;
                  const content = textarea.value.trim();
                  
                  if (!content) {
                    alert('Please enter some content before saving.');
                    return;
                  }

                  try {
                    const supabase = createClient()
                    
                    // Save directly to Supabase from client
                    const { error } = await supabase
                      .from('entries')
                      .insert({
                        user_id: user.id,
                        content: content.trim(),
                        entry_type: 'text',
                        created_at: new Date().toISOString(),
                      })
                      .select()

                    if (error) {
                      console.error('Error saving entry:', error)
                      alert('Failed to save entry: ' + error.message);
                    } else {
                      textarea.value = '';
                      alert('Entry saved successfully!');
                      // Load the updated entries list
                      await loadTodaysEntries();
                    }
                  } catch (error) {
                    console.error('Error saving entry:', error)
                    alert('Error saving entry: ' + error);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save Entry
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Today&apos;s Entries</h2>
            <div className="space-y-4">
              {entries.length > 0 ? (
                entries.map((entry, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-gray-800">{entry.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(entry.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Your reflections from today will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}