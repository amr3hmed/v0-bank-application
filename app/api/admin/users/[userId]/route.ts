import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { is_active } = await request.json();

    const { error } = await supabase
      .from('users')
      .update({ is_active })
      .eq('id', params.userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في المخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', params.userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في المخادم' },
      { status: 500 }
    );
  }
}
