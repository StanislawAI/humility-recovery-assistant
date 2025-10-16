# Replacement Activities Component

A React component for managing healthy alternative activities when urges arise during recovery.

## Usage

```tsx
import { ReplacementActivities } from '@/components/replacement-activities'

export default function MyPage() {
  return (
    <div>
      <ReplacementActivities />
    </div>
  )
}
```

## Features

1. **Duration-based grouping**: Activities organized by time commitment (5min, 15-30min, 60+min)
2. **Default activities**: 15 pre-configured activities based on Recovery.md
3. **Custom activities**: Add your own personalized alternatives
4. **Usage tracking**: Track times_used and last_used timestamps
5. **Quick action**: "Use Now" button to instantly log activity usage
6. **Active/Inactive toggle**: Enable or disable activities without deleting
7. **Sorting**: Most-used activities appear first in each category

## Database Schema

Table: `replacement_activities`

```sql
CREATE TABLE replacement_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  duration_category TEXT CHECK (duration_category IN ('5min', '15-30min', '60+min')),
  description TEXT,
  times_used INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Default Activities

### 5 minutes
- Breathwork
- Step reading
- 10 pushups
- Hallway walk
- Wash face
- Gratitude text

### 15-30 minutes
- Brisk walk
- Kettlebell swings
- Hot/cold shower
- Read inspiring chapter
- Tidy a room

### 60+ minutes
- Workout
- Deep cleaning
- Long-walk call with ally
- Volunteer action

## Component API

The component is self-contained and requires no props. It:
- Automatically fetches user's activities from Supabase
- Shows default activities prompt if user has no activities
- Handles all CRUD operations internally
- Uses shadcn/ui components for consistent styling
- Follows the same patterns as `exercises-list.tsx` and `if-then-plans.tsx`
