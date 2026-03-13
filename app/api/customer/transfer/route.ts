import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, recipientAccount, recipientName, amount, description } =
      await request.json();

    if (amount <= 0) {
      return NextResponse.json(
        { message: 'المبلغ يجب أن يكون أكبر من صفر' },
        { status: 400 }
      );
    }

    // Get sender's balance
    const { data: sender, error: senderError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    if (senderError || !sender) {
      return NextResponse.json(
        { message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    if (sender.balance < amount) {
      return NextResponse.json(
        { message: 'الرصيد غير كافي' },
        { status: 400 }
      );
    }

    // Find recipient by account number
    const { data: recipient, error: recipientError } = await supabase
      .from('users')
      .select('id, balance')
      .eq('account_number', recipientAccount)
      .single();

    if (recipientError || !recipient) {
      return NextResponse.json(
        { message: 'رقم الحساب غير صحيح' },
        { status: 404 }
      );
    }

    // Update sender balance
    const { error: senderUpdateError } = await supabase
      .from('users')
      .update({ balance: sender.balance - amount })
      .eq('id', userId);

    if (senderUpdateError) {
      throw senderUpdateError;
    }

    // Update recipient balance
    const { error: recipientUpdateError } = await supabase
      .from('users')
      .update({ balance: recipient.balance + amount })
      .eq('id', recipient.id);

    if (recipientUpdateError) {
      throw recipientUpdateError;
    }

    // Create transfer record
    const { error: transferError } = await supabase
      .from('transfers')
      .insert({
        from_user_id: userId,
        to_user_id: recipient.id,
        amount,
        description: description || `تحويل إلى ${recipientName}`,
        status: 'completed',
      });

    if (transferError) {
      throw transferError;
    }

    return NextResponse.json({
      message: 'تم التحويل بنجاح',
    });
  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في عملية التحويل' },
      { status: 500 }
    );
  }
}
