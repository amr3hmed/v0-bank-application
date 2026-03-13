import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', params.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get transactions
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', params.userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transError) {
      console.error('Transaction error:', transError);
    }

    return NextResponse.json({
      balance: user.balance,
      transactions: transactions || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في المخادم' },
      { status: 500 }
    );
  }
}
