import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/subscribers';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

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

    // Add to subscribers
    const result = await addSubscriber(email);

    // Send welcome email (only if new subscriber)
    if (!result.alreadyExists) {
      try {
        await sendWelcomeEmail(email);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: result.alreadyExists
        ? "You're already on the list!"
        : "You're in! Check your inbox.",
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
