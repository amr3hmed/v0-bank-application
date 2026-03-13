import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, phone } = await request.json();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'هذا البريد مسجل بالفعل' },
        { status: 400 }
      );
    }

    // Generate account number
    const accountNumber = Math.random().toString().slice(2, 12);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: password, // In production, use bcrypt
        full_name: fullName,
        phone,
        balance: 0,
        account_number: accountNumber,
        role: 'customer',
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { message: 'حدث خطأ في إنشاء الحساب' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'تم إنشاء الحساب بنجاح',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في المخادم' },
      { status: 500 }
    );
  }
}
