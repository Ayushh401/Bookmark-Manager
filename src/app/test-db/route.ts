import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Test basic connection
    const { data, error } = await supabase.from('bookmarks').select('count')
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'The bookmarks table might not exist. Please run the SQL migration in Supabase SQL Editor.'
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful!',
      count: data
    })
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: 'Environment variables missing or invalid',
      details: err
    })
  }
}
