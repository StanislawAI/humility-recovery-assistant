# Next Features

## AI-Powered Recovery Advisor

### Overview
An interactive AI assistant that provides personalized recovery guidance based on the humility recovery theory. Users can ask questions about cravings, triggers, daily practices, or general recovery challenges, and receive evidence-based advice drawn from the VIA classification system and recovery principles.

### Key Features
- **Conversational Interface**: Chat-based interaction for natural Q&A
- **Context-Aware Responses**: Draws from user's daily entries, VIA scores, and recovery history
- **Recovery Theory Integration**: References specific VIA themes (Purgative, Illuminative, Unitive)
- **Actionable Advice**: Provides concrete next steps and coping strategies
- **Privacy-Focused**: All conversations remain private and are stored securely

### Technical Implementation
- **API Endpoint**: `/api/ai/advisor`
- **Model**: Google Gemini Flash Latest (same as summaries)
- **Context**: User's recent entries, VIA classifications, and recovery milestones
- **Response Format**: Structured advice with sections for understanding, strategies, and encouragement

### User Stories
1. User experiencing cravings can ask "How do I handle this urge?" and receive personalized strategies
2. User confused about VIA concepts can ask for explanations with real-life examples
3. User seeking motivation can request encouragement tied to their recent progress

### Integration Points
- Accessible from main dashboard
- Can reference daily checklists and metrics
- Saves conversation history for pattern analysis

### Success Metrics
- User engagement (conversations started per week)
- User satisfaction ratings
- Reduction in high-risk periods (based on advisor usage)
