# Bookmark Manager

A web-based bookmark manager that allows users to securely save, view, and manage web links with real-time synchronization.

## Features

- **Google OAuth Authentication** - Secure login with Google account only
- **Bookmark CRUD Operations** - Add, view, and delete bookmarks
- **Real-time Synchronization** - Instant updates across multiple tabs/devices
- **Privacy & Security** - Row Level Security ensures users can only see their own bookmarks
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth 2.0)
- **Real-time**: Supabase Realtime (Postgres Changes)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (create at [supabase.com](https://supabase.com))
- Google Cloud Console access for OAuth setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd bookmark-manager
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API and copy:
   - Project URL
   - Anon public key
   - Service role key

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://[your-project-ref].supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL to create the bookmarks table and RLS policies:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own bookmarks
CREATE POLICY "Users can update their own bookmarks" ON bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at);
```

### 6. Configure Google OAuth in Supabase

1. In your Supabase project, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth Client ID and Client Secret
4. Set the redirect URL to: `http://localhost:3000/auth/callback` (for development)

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy - your app will be available at a `.vercel.app` domain

### Update Production URLs

After deployment, update these URLs:

1. **Google OAuth Redirect URI**:
   - Add `https://your-app.vercel.app/auth/callback` to Google Console

2. **Supabase Auth Settings**:
   - Update Site URL to `https://your-app.vercel.app`
   - Update Redirect URLs to include `https://your-app.vercel.app/auth/callback`

## Challenges Faced & Solutions

### 1. Google OAuth Redirect URI Configuration
**Challenge**: Initially encountered "redirect_uri_mismatch" errors because the redirect URIs weren't properly configured.

**Solution**: 
- Added both development (`http://localhost:3000/auth/callback`) and production URLs to Google Console
- Ensured Supabase Auth settings matched the same redirect URLs
- Used the exact same URL format in both places

### 2. Real-time Updates Not Working
**Challenge**: Real-time subscription wasn't receiving updates initially.

**Solution**:
- Ensured Realtime was enabled in Supabase project settings
- Added RLS policies that allow users to subscribe to their own data changes
- Used the correct channel subscription pattern with proper table and schema names

### 3. Environment Variables in Production
**Challenge**: Environment variables weren't being loaded correctly in production.

**Solution**:
- Used `NEXT_PUBLIC_` prefix for client-side variables
- Ensured all required variables were added to Vercel environment settings
- Used the Supabase SSR package for server-side operations

### 4. Row Level Security (RLS) Policies
**Challenge**: Users could potentially see other users' bookmarks without proper RLS.

**Solution**:
- Implemented comprehensive RLS policies for all CRUD operations
- Used `auth.uid()` to ensure users can only access their own data
- Added proper indexes for performance optimization

## Project Structure

```
bookmark-manager/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── auth-code-error/
│   │   │   └── callback/
│   │   ├── dashboard/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuthButton.tsx
│   │   ├── BookmarkForm.tsx
│   │   └── BookmarkList.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── supabaseAdmin.ts
│   │   └── supabaseClient.ts
│   └── middleware.ts
├── supabase/
│   └── migrations/
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
