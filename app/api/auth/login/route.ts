import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: 'البريد أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Simple password check (in production, use bcrypt)
    const isValidPassword = password === 'password';

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'البريد أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { message: 'الحساب معطل' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      userId: user.id,
      role: user.role,
      userName: user.full_name,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في المخادم' },
      { status: 500 }
    );
  }
}
