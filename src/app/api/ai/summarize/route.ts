import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date } = await request.json()

    // Get entries for the specified date
    const { data: entries, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at', `${date}T23:59:59.999Z`)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: 'No entries found for this date' }, { status: 404 })
    }

    // Create prompt for AI
    const entriesText = entries.map(entry => 
      `[${entry.entry_type.toUpperCase()}] ${entry.content}`
    ).join('\n\n')

    const prompt = `Analyze these daily reflections about growing in humility and provide:
1. A brief summary (2-3 sentences) of the day's key themes
2. Key insights about humility growth (3-5 bullet points)
3. Encouraging feedback for continued growth

Entries:
${entriesText}

Please respond in JSON format:
{
  "summary": "Brief summary here",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "encouragement": "Encouraging message here"
}`

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })
    
    const result = await model.generateContent([
      {
        text: 'You are a compassionate recovery coach helping someone grow in humility. Be encouraging, insightful, and focus on positive growth patterns.\n\n'
      },
      {
        text: prompt
      }
    ])

    const aiResponse = result.response.text()
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
    }

    let parsedResponse
    try {
      // Clean up the response (remove markdown code blocks if present)
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      parsedResponse = JSON.parse(cleanResponse)
    } catch {
      // Fallback if JSON parsing fails
      parsedResponse = {
        summary: aiResponse,
        keyInsights: [],
        encouragement: "Keep up the great work on your humility journey!"
      }
    }

    // Save the summary to database
    const { error: saveError } = await supabase
      .from('daily_summaries')
      .upsert({
        user_id: user.id,
        date,
        summary: parsedResponse.summary,
        key_insights: {
          insights: parsedResponse.keyInsights,
          encouragement: parsedResponse.encouragement
        }
      })

    if (saveError) {
      console.error('Error saving summary:', saveError)
      // Still return the AI response even if saving fails
    }

    return NextResponse.json(parsedResponse)

  } catch (error) {
    console.error('Error in AI summarize route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


