# Humility Recovery Assistant
## Production environment notes

To avoid deployment outages due to environment configuration:

- Configure environment variables in Vercel Project Settings → Environment Variables. Do not redefine variables in `vercel.json`.
- Required variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GOOGLE_AI_API_KEY` (Gemini)
- Health check: `GET /api/health` returns JSON with basic env and Supabase connectivity status.


A modern web application for tracking your daily journey of growing in humility. Built with Next.js 15, Supabase, and AI-powered insights.

## Features

- **Multi-modal Check-ins**: Text, voice, and quick-check entry methods
- **AI-Powered Summaries**: Daily insights generated using OpenAI
- **Progress Tracking**: Analytics and streak tracking
- **Secure & Private**: Row-level security with Supabase Auth
- **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: Google AI Studio (Gemini Flash Latest) for insights and summaries
- **Voice**: Web Speech API for voice input
- **Deployment**: Vercel

## Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Get your project URL and anon key

3. **Set up Google AI**:
   - Get a Google AI Studio API key from https://aistudio.google.com/
   - Add it to your environment variables

4. **Environment Variables**:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## Usage

1. **Sign up** for a new account or **sign in** with existing credentials
2. **Add entries** using text, voice, or quick-check prompts
3. **View your history** of all entries organized by date
4. **Check insights** for AI-generated summaries and analytics
5. **Track your progress** with streak counters and statistics

## Database Schema

The app uses three main tables:
- `entries`: User reflections and thoughts
- `daily_summaries`: AI-generated daily summaries
- `analytics`: Weekly trends and growth metrics

All tables have Row Level Security (RLS) enabled for user data privacy.

## Deployment

Deploy to Vercel:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

This is a personal recovery assistant app. Feel free to fork and customize for your own needs.

## License

MIT