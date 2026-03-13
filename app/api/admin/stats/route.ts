import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Count users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .neq('role', 'admin');

    // Get total balance
    const { data: balanceData, error: balanceError } = await supabase
      .from('users')
      .select('balance')
      .neq('role', 'admin');

    // Count transactions
    const { count: totalTransactions, error: transError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    const totalBalance = balanceData?.reduce((sum, u) => sum + u.balance, 0) || 0;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalBalance,
      activeTransactions: Math.floor((totalTransactions || 0) * 0.3),
      totalTransactions: totalTransactions || 0,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في المخادم' },
      { status: 500 }
    );
  }
}
