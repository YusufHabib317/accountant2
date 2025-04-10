/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = 'https://cvukpuwtruisisnshfur.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dWtwdXd0cnVpc2lzbnNoZnVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDAwNzU0NCwiZXhwIjoyMDU5NTgzNTQ0fQ.hajW_uj_OVC5KGgrIT59Epfelo2oGPjz5yFZQfI5o1w';

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    try {
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) {
        return NextResponse.json({
          success: false,
          error: usersError.message,
          source: 'auth_admin_api',
        }, { status: 500 });
      }

      const userCount = usersData?.users?.length || 0;

      return NextResponse.json({
        success: true,
        count: userCount,
        message: 'Retrieved user count via Auth Admin API',
        note: 'This count represents authenticated users, not user_app records',
      });
    } catch (authErr) {
      try {
        const { data: configData } = await supabase.rpc('get_platform_info');

        return NextResponse.json({
          success: true,
          alternative: true,
          platformInfo: configData,
          message: 'Could not access user data directly, returned platform info',
        });
      } catch (configErr) {
        return NextResponse.json({
          success: false,
          error: 'All API approaches failed',
          details: 'This may require enabling specific database roles or permissions in Supabase',
        }, { status: 500 });
      }
    }
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
