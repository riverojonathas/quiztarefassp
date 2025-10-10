import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Connected to Supabase' });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to connect' }, { status: 500 });
  }
}