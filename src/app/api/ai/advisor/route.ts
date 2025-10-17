import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getRelevantGuideChunks, loadRecoveryGuide } from '@/lib/recovery-guide'
import { getOrCreateConversation, addMessageToConversation, getConversationContext } from '@/lib/conversations'
import { getGuideUpdates, saveGuideHashes } from '@/lib/conversation-updates'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // For now, allow unauthenticated access to AI advisor for testing
    // TODO: Add proper authentication once Vercel auth is configured

    const { question, context } = await request.json()

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({
        error: 'AI advisor is not configured. Please contact support.',
        response: 'I apologize, but the AI advisor service is currently unavailable. Please try again later or contact support for assistance.'
      }, { status: 503 })
    }

    // Get user's recent context (last 7 days of entries and VIA scores)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // For testing purposes, use a default user ID if no user is authenticated
    const userId = user?.id || 'test-user-id'

    const { data: recentEntries } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(100)

    // Build context string - only recent entries
    let contextString = ''
    if (recentEntries && recentEntries.length > 0) {
      contextString += 'Recent journal entries:\\n'
      recentEntries.forEach(entry => {
        contextString += `- ${entry.entry_type}: ${entry.content}\\n`
      })
    }

    // Get conversation history for context building
    const conversationContext = await getConversationContext(userId, 10)
    
    // Build recent entries text to help relevance scoring
    const recentEntriesText = (recentEntries || [])
      .map(e => `${e.entry_type}: ${e.content}`)
      .join('\n')

    // Pull most relevant chunks from the recovery guide
    const guideChunks = await getRelevantGuideChunks({
      question,
      recentEntriesText,
      maxChunks: 6,
      maxTotalChars: 8000
    })
    const pdfChunks = guideChunks.join('\n\n---\n\n')

    // First-run full guide or incremental updates
    const conversation = await getOrCreateConversation(userId)
    let guideFoundation = ''
    const isNewConversation = (conversation.messages ?? []).length === 0
    if (isNewConversation) {
      // Send full guide once on new conversation
      guideFoundation = await loadRecoveryGuide()
      // Persist current hashes so future requests can send only updates
      try {
        const { changed, nextHashes } = await getGuideUpdates(conversation.id)
        // Even if changed includes all sections, we've already included full guide
        await saveGuideHashes(conversation.id, nextHashes)
      } catch (e) {
        console.error('Failed to initialize guide hashes:', e)
      }
    } else {
      // Send only updated/new sections since last time
      try {
        const { changed, nextHashes } = await getGuideUpdates(conversation.id)
        if (changed.length > 0) {
          guideFoundation = changed
            .map(s => `## ${s.title}\n\n${s.content}`)
            .join('\n\n---\n\n')
          await saveGuideHashes(conversation.id, nextHashes)
        }
      } catch (e) {
        console.error('Failed to compute guide updates:', e)
      }
    }

    const prompt = `You are a compassionate recovery coach. Use the following context to provide personalized guidance. Respond in 3 to 5 sentences, plain prose, no lists or bullet points:

RECOVERY GUIDE (foundation ${isNewConversation ? 'full' : 'updates if any'}):
${guideFoundation}

RELEVANT SECTIONS:
${pdfChunks}

RECENT JOURNAL ENTRIES:
${contextString}

CONVERSATION HISTORY:
${conversationContext}

USER'S QUESTION: ${question}

${context ? `Additional context: ${context}` : ''}

Please provide a helpful, personalized response based on the recovery guide, journal context, and our conversation history. Be encouraging, practical, and focused on spiritual growth.`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

    const result = await model.generateContent(prompt)

    let aiResponse = result.response.text()

    // Enforce 3–5 sentence cap in case the model ignores instructions
    try {
      const sentences = aiResponse
        .replace(/\n+/g, ' ') // normalize newlines
        .split(/(?<=[.!?])\s+/)
        .filter(Boolean)
      if (sentences.length > 5) {
        aiResponse = sentences.slice(0, 5).join(' ')
      }
    } catch {
      // If anything goes wrong, fall back to original text
    }

    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
    }

    // Save conversation to database
    try {
      const conversation = await getOrCreateConversation(userId)
      
      // Add user message
      await addMessageToConversation(conversation.id, 'user', question)
      
      // Add AI response
      await addMessageToConversation(conversation.id, 'assistant', aiResponse)
    } catch (conversationError) {
      console.error('Failed to save conversation:', conversationError)
      // Don't fail the request if conversation saving fails
    }

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
