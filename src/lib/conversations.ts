import { createClient } from '@/lib/supabase/server'

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  user_id: string
  messages: ConversationMessage[]
  created_at: string
  updated_at: string
}

// Get or create a conversation for a user
export async function getOrCreateConversation(userId: string): Promise<Conversation> {
  const supabase = await createClient()
  
  // Try to get the most recent conversation
  const { data: existingConversation, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    throw new Error(`Failed to fetch conversation: ${error.message}`)
  }

  if (existingConversation) {
    return existingConversation as Conversation
  }

  // Create new conversation if none exists
  const { data: newConversation, error: createError } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      messages: []
    })
    .select()
    .single()

  if (createError) {
    throw new Error(`Failed to create conversation: ${createError.message}`)
  }

  return newConversation as Conversation
}

// Add a message to a conversation
export async function addMessageToConversation(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const supabase = await createClient()
  
  // Get current conversation
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('messages')
    .eq('id', conversationId)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch conversation: ${fetchError.message}`)
  }

  // Add new message
  const newMessage: ConversationMessage = {
    role,
    content,
    timestamp: new Date().toISOString()
  }

  const updatedMessages = [...(conversation.messages as ConversationMessage[]), newMessage]

  // Update conversation
  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      messages: updatedMessages,
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId)

  if (updateError) {
    throw new Error(`Failed to update conversation: ${updateError.message}`)
  }
}

// Get recent conversation history for context
export async function getRecentConversationHistory(
  userId: string,
  maxMessages: number = 10
): Promise<ConversationMessage[]> {
  const conversation = await getOrCreateConversation(userId)
  
  // Return the last N messages
  return conversation.messages.slice(-maxMessages)
}

// Get conversation history formatted for AI context
export async function getConversationContext(
  userId: string,
  maxMessages: number = 10
): Promise<string> {
  const messages = await getRecentConversationHistory(userId, maxMessages)
  
  if (messages.length === 0) {
    return ''
  }

  return messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Oracle'}: ${msg.content}`)
    .join('\n\n')
}

// Clear conversation history (for testing or reset)
export async function clearConversationHistory(userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to clear conversation history: ${error.message}`)
  }
}
