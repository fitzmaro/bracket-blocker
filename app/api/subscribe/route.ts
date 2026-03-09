import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/subscribers';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, website, company } = body;

    // Honeypot fields - if filled, it's a bot
    if (website || company) {
      // Silently accept but do nothing (don't tip off the bot)
      return NextResponse.json({
        success: true,
        isNew: true,
        message: 'Successfully subscribed! Check your email.',
      });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Block disposable/temp email domains commonly used by bots
    const disposableDomains = ['tempmail', 'throwaway', 'mailinator', 'guerrilla', 'sharklasers', '10minute', 'temp-mail'];
    const emailDomain = email.split('@')[1]?.toLowerCase() || '';
    if (disposableDomains.some(d => emailDomain.includes(d))) {
      return NextResponse.json({
        success: true,
        isNew: true,
        message: 'Successfully subscribed! Check your email.',
      });
    }

    // Add to subscribers
    const result = await addSubscriber(email, conferences || []);

    // Send welcome email only for new subscribers
    if (result.isNew) {
      try {
        await sendWelcomeEmail(email);
      } catch (emailError) {
        // Log but don't fail the subscription
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      isNew: result.isNew,
      message: result.isNew
        ? 'Successfully subscribed! Check your email.'
        : 'You were already subscribed. Preferences updated.',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
