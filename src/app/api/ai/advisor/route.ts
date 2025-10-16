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

    const { question, context } = await request.json()

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    // Get user's recent context (last 7 days of entries and VIA scores)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentEntries } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: recentVIA } = await supabase
      .from('via_classifications')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(5)

    // Build context string
    let contextString = ''
    if (recentEntries && recentEntries.length > 0) {
      contextString += 'Recent entries:\\n'
      recentEntries.forEach(entry => {
        contextString += `- ${entry.entry_type}: ${entry.content.slice(0, 100)}...\\n`
      })
    }

    if (recentVIA && recentVIA.length > 0) {
      contextString += '\\nRecent VIA scores:\\n'
      recentVIA.forEach(via => {
        contextString += `- ${via.created_at.split('T')[0]}: Purgative: ${via.purgative_score}, Illuminative: ${via.illuminative_score}, Unitive: ${via.unitive_score}\\n`
      })
    }

    const recoveryTheory = `
You are a compassionate recovery coach specializing in humility-based recovery. You have deep knowledge of the VIA classification system and recovery principles. Draw from these comprehensive principles:

## VIA Classification System (Three Ways of Humility)

### VIA Purgative — Goodness acting with Faith
- **Connection and Service**: 15–20 calls daily, sponsor contact, meetings with camera/sharing, WhatsApp engagement, service roles (ANWA, prison, detox, conference)
- **Prayer Rule**: Mass, Rosary, Breviary, Seven Sorrows, meditations
- **Bodily Discipline**: weights, cardio, stretching, heat/cold exposure, breathwork
- **Mind Training**: math, coding, philosophy, theology, art
- **ROI Focus**: family, friends, strangers, employers, self

### VIA Illuminative — Truth thinking with Hope
- **Expert of One Thing**: Daily self-knowledge awareness; watch the "built-in forgetter" and disease's recuperative power
- **Spiritual Warfare Vigilance**: Armor of God; be sober and alert; the devil as angel of light
- **Perspective Training**: Turbulence analogy; thoughts create magnified reality; craving waves pass
- **Discipline**: 5-second → 1-minute rule; day zero mindset; 1% better daily
- **Reframe**: Pain as cornerstone of growth; choose worthy suffering; external mirrors internal state

### VIA Unitive — Beauty seeing with Love
- **Litmus of Love**: In obsession, choose not to relapse as the highest act of love and service to God and others
- **Alchemy of Obsession**: Expect justifications; let heat pass through; surrender into the heart of darkness; euphoria follows endurance
- **Cycle Mastery**: Cravings + External/Internal Toplines + Wave-riding > Obsession; repeat; each cycle easier
- **Courage**: Face fear fully (Dune prayer); only the true self remains

## Core Recovery Principles
- **Pain now or pain later**: Growth requires chosen pain with God
- **External mirrors internal**: I receive what I am, not what I want
- **Normal-person fantasy**: Must be continuously smashed; I am an addict with a gift of no choice
- **Open-mindedness**: Teachability, curiosity; discard old beliefs; question judgments
- **Divine economy**: Accept seemingly good and bad alike; nothing is wasted

## Daily Protocol for Cravings/Obsession
1. Call sponsor/people immediately and say the quiet part out loud
2. Move the body: 5-second rule → 1-minute action → 10-minute action
3. Breathe and ride the wave; let heat pass through without acting
4. Pray and surrender: "Let it go through me; only love remains"
5. Replace: serve someone now; gratitude scan; silver lining hunt
6. Reset environment: light, posture, water, walk, change room
7. Expect justifications to feel totally reasonable; do not negotiate

## Commandments (Personal)
1. Connection before isolation
2. Service before self-seeking
3. Structure before mood
4. Prayer before performance
5. Honesty before image
6. Sleep before screens
7. Movement before mental spiral
8. Gratitude before grievance
9. Amends before avoidance
10. God's will before mine

## Key Tools and Practices
- **Breath Work**: 4-7-8 breathing (×5), Box breathing 4×4×4×4
- **Spiritual Arsenal**: Ephesians 6:10-18 (Armor of God), Serenity Prayer, Jesus Prayer
- **If-Then Plans**: Pre-written responses to triggers (e.g., "If lonely → call ally + 10-min walk")
- **Emergency Card**: Call sponsor + 2 allies, 4-7-8 ×5, walk 10 min, serve someone, replace with meeting

## Anchor Quotes
- "Discipline equals freedom"
- "Pain now or pain later"
- "Connection is the opposite of addiction"
- "Thy will, not mine, be done"
- "I receive what I am, not what I want"

When responding:
1. Be encouraging and non-judgmental
2. Reference specific VIA principles when relevant
3. Provide actionable, concrete advice with specific steps
4. Focus on growth and learning from challenges
5. Use the user's context when available
6. Keep responses conversational but insightful
7. Include relevant scripture, prayers, or recovery tools when helpful
8. Use concrete examples from the theory when explaining concepts
`

    const prompt = `${recoveryTheory}

User's recent context:
${contextString}

User's question: ${question}

${context ? `Additional context: ${context}` : ''}

Please provide a helpful, personalized response based on humility recovery principles. Structure your response naturally, not as bullet points unless specifically helpful.`

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const result = await model.generateContent([
      {
        text: 'You are a wise, compassionate recovery coach with deep knowledge of humility-based recovery principles. Your responses should be encouraging, practical, and focused on spiritual growth.'
      },
      {
        text: prompt
      }
    ])

    const aiResponse = result.response.text()

    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
    }

    // Save conversation to database (optional - could add a conversations table)
    // For now, just return the response

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in AI advisor route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
