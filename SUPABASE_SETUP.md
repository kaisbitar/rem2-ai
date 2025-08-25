# Supabase Setup Guide

This guide will help you set up Supabase for the AI Impact Tracker extension.

## Step 1: Get Your Supabase Keys

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like `https://your-project-ref.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 2: Create Environment Files

### Development Environment
1. Copy `env.development.example` to `.env.development`
2. Fill in your actual Supabase values:
   ```bash
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key-here
   NODE_ENV=development
   ```

### Production Environment
1. Copy `env.production.example` to `.env.production`
2. Fill in your production Supabase values

## Step 3: Test the Connection

Use the test utility to verify your connection:

```typescript
import { testSupabaseConnection } from '@/utils/supabase/test-connection'

// Test basic connection
const result = await testSupabaseConnection()
console.log(result)
```

## Step 4: Verify Setup

✅ **Configuration files created**
✅ **Environment variables set**
✅ **Supabase client configured**
✅ **Connection tested**
✅ **Git ignore updated**

## Security Notes

- **Never commit** `.env.development` or `.env.production` files
- **Only use the anon key** in client-side code
- **Keep service role key** secret (server-side only)
- **Environment files are already in .gitignore**

## Next Steps

Once connection is working:
1. Set up database tables
2. Implement user authentication
3. Start migrating data from Chrome storage
4. Add real-time features

## Troubleshooting

### "Missing Supabase configuration" error
- Check that your `.env.development` file exists
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Ensure no extra spaces or quotes around values

### Connection timeout
- Check your internet connection
- Verify the Supabase URL is correct
- Check if Supabase service is available

### Authentication errors
- Verify your anon key is correct
- Check if your Supabase project is active
- Ensure RLS policies are configured correctly 