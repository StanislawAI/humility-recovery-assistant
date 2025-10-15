# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key to the environment variables

## Google AI Setup

1. Go to https://aistudio.google.com/
2. Create a new project or use an existing one
3. Generate an API key in the Google AI Studio
4. Add it to your environment variables as `GOOGLE_AI_API_KEY`

## Running the App

1. Install dependencies: `npm install`
2. Set up environment variables (see above)
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the same environment variables in Vercel dashboard
4. Deploy!

## Features

- ✅ User authentication (email/password, magic link)
- ✅ Multi-modal entry creation (text, voice, quick-check)
- ✅ Daily entry tracking
- ✅ Entry history with date grouping
- ✅ Basic analytics and insights
- ✅ AI-powered daily summaries (requires Google AI API key, using Gemini Flash Latest)
- ✅ Responsive design with modern UI
- ✅ Real-time data updates
- ✅ Secure row-level security

## Next Steps

- Voice recording functionality (currently shows placeholder)
- Enhanced analytics with charts
- Email notifications
- Mobile app
- Export functionality
