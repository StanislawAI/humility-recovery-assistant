# VIA Classification Tracker

A comprehensive component for tracking progress through the three spiritual ways of recovery based on Recovery.md.

## Features

- **Three VIA Ways Tracking**
  - **Purgative Way** (Goodness acting with Faith) - 5 dimensions
  - **Illuminative Way** (Truth thinking with Hope) - 4 dimensions  
  - **Unitive Way** (Beauty seeing with Love) - 3 dimensions

- **Daily Scoring** (0-10 scale for each dimension)
- **Weekly Trend Chart** showing average scores for each way
- **Detailed Descriptions** from Recovery.md
- **Auto-save** on input blur
- **Tab Navigation** between the three ways

## Installation

### 1. Apply Database Migration

Run the migration to create the `via_classifications` table:

```bash
node apply-via-migration.js
```

Or manually run the SQL in Supabase Dashboard:
- Go to SQL Editor
- Copy contents of `supabase/migrations/20251016_add_via_classifications.sql`
- Execute

### 2. Import Component

```tsx
import { ViaClassification } from '@/components/via-classification'

export default function Page() {
  return <ViaClassification />
}
```

## Database Schema

Table: `via_classifications`

- `id` - UUID primary key
- `user_id` - User reference
- `date` - Date (unique per user)
- Purgative dimensions:
  - `purgative_connection` (0-10)
  - `purgative_service` (0-10)
  - `purgative_prayer` (0-10)
  - `purgative_body` (0-10)
  - `purgative_mind` (0-10)
- Illuminative dimensions:
  - `illuminative_self_knowledge` (0-10)
  - `illuminative_vigilance` (0-10)
  - `illuminative_discipline` (0-10)
  - `illuminative_reframe` (0-10)
- Unitive dimensions:
  - `unitive_litmus_love` (0-10)
  - `unitive_obsession_alchemy` (0-10)
  - `unitive_courage` (0-10)
- `notes` - Optional text notes
- `created_at`, `updated_at` - Timestamps

## The Three VIA Ways

### Purgative Way - Goodness Acting with Faith
Focus on concrete actions and disciplines:
- Connection (15-20 calls, meetings, sponsor)
- Service (ANWA, prison, detox, conference)
- Prayer Rule (Mass, Rosary, Breviary, meditations)
- Bodily Discipline (weights, cardio, breathwork)
- Mind Training (math, coding, philosophy, theology)

### Illuminative Way - Truth Thinking with Hope
Focus on self-awareness and reframing:
- Self-Knowledge (watching the "built-in forgetter")
- Spiritual Vigilance (armor of God, sober alertness)
- Discipline (5-second rule, day zero mindset, 1% better)
- Reframe (pain as growth, external mirrors internal)

### Unitive Way - Beauty Seeing with Love
Focus on surrendering through obsession:
- Litmus of Love (choosing not to relapse as highest service)
- Obsession Alchemy (letting heat pass through, euphoria follows)
- Courage (face fear fully, cycle mastery)

## Usage Tips

1. **Daily Practice**: Score each dimension at end of day based on effort and quality
2. **Average Scores**: Each way shows an average to track overall progress
3. **Weekly Trends**: Chart shows 7-day rolling view of all three ways
4. **Descriptions**: Review the "Understanding the VIA Ways" card for guidance
5. **Scores 0-10**: 
   - 0-3: Struggling
   - 4-6: Making progress
   - 7-8: Strong practice
   - 9-10: Exceptional day

## Component Structure

```tsx
ViaClassification
├── Main Card (Tabbed Interface)
│   ├── Purgative Tab (5 dimensions)
│   ├── Illuminative Tab (4 dimensions)
│   └── Unitive Tab (3 dimensions)
├── Weekly Trend Chart (Line chart)
└── Understanding Card (Reference guide)
```

## Technologies Used

- React with TypeScript
- Supabase for data persistence
- Recharts for visualization
- shadcn/ui components (Card, Tabs, Input)
- date-fns for date handling
- Sonner for toast notifications

## Related Components

- `daily-metrics.tsx` - Similar pattern for daily tracking
- `daily-checklist.tsx` - Boolean checklist items
- Recovery.md - Source of VIA classification framework
