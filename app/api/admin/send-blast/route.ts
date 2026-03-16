import { NextRequest, NextResponse } from 'next/server';
import { getAllSubscribers, getSubscriberCount } from '@/lib/subscribers';
import { sendBulkBracketLiveEmails } from '@/lib/email';

export async function GET(request: NextRequest) {
  // Check admin secret
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Preview mode - show count without sending
  const preview = request.nextUrl.searchParams.get('preview') === 'true';

  try {
    const count = await getSubscriberCount();

    if (preview) {
      return NextResponse.json({
        success: true,
        preview: true,
        subscriberCount: count,
        message: `Ready to send to ${count} subscribers. Remove ?preview=true to send.`,
      });
    }

    // Get all subscribers and send
    const subscribers = await getAllSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to email.',
        sent: 0,
      });
    }

    const results = await sendBulkBracketLiveEmails(subscribers);

    return NextResponse.json({
      success: true,
      message: `Blast complete! Sent: ${results.sent}, Failed: ${results.failed}`,
      ...results,
    });
  } catch (error) {
    console.error('Send blast error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send blast' },
      { status: 500 }
    );
  }
}
