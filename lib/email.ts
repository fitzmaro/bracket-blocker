import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type Subscriber = {
  email: string;
  conferences: string[];
  subscribedAt: string;
};

/**
 * Send bracket drop notification email
 */
export async function sendBracketDropEmail(to: string) {
  const { data, error } = await resend.emails.send({
    from: 'Bracket Blocker <notifications@contact.bracketblocker.com>', // You'll need to verify this domain in Resend
    to,
    subject: '🏀 The Bracket is LIVE - Block Your Calendar Now!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FF9500; font-size: 32px; margin: 0;">🏀 BRACKET BLOCKER</h1>
        </div>

        <h2 style="color: #1a1a1a; font-size: 24px;">The 2026 NCAA Tournament Bracket is LIVE!</h2>

        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Selection Sunday just happened. The matchups are set. Now it's time to protect your calendar
          before your boss schedules meetings during the games you need to watch.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://bracketblocker.com/bracket"
             style="display: inline-block; background: #FF9500; color: #000; font-weight: bold;
                    padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px;">
            Block Your Calendar Now →
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          First games tip off Thursday. Don't wait.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

        <p style="color: #999; font-size: 12px; text-align: center;">
          You're receiving this because you signed up for bracket alerts on Bracket Blocker.<br />
          <a href="https://bracketblocker.com/unsubscribe" style="color: #999;">Unsubscribe</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}

/**
 * Send welcome/confirmation email
 */
export async function sendWelcomeEmail(to: string) {
  const { data, error } = await resend.emails.send({
    from: 'Bracket Blocker <notifications@contact.bracketblocker.com>',
    to,
    subject: "You're in! Bracket alerts are set up 🏀",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FF9500; font-size: 32px; margin: 0;">🏀 BRACKET BLOCKER</h1>
        </div>

        <h2 style="color: #1a1a1a; font-size: 24px;">You're on the list!</h2>

        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          We'll email you the moment the NCAA Tournament bracket is announced on Selection Sunday
          (March 15, 2026 at 6:00 PM ET).
        </p>

        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Be ready to block your calendar before anyone notices. Your boss will think you're in
          back-to-back meetings. You'll be watching March Madness.
        </p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            <strong>What happens next:</strong><br />
            📅 Selection Sunday (March 15) → We email you<br />
            🏀 You pick your games<br />
            📝 We generate fake meeting invites<br />
            ✅ Your calendar is blocked. Boss is none the wiser.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

        <p style="color: #999; font-size: 12px; text-align: center;">
          <a href="https://bracketblocker.com/unsubscribe" style="color: #999;">Unsubscribe</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw - welcome email failure shouldn't break subscription
    return null;
  }

  return data;
}

/**
 * Send bracket drop notification to all subscribers
 * Call this from an admin endpoint or cron job on Selection Sunday
 */
export async function sendBracketDropToAll(subscribers: Subscriber[]) {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Resend supports batch sending up to 100 emails at a time
  // For more, we'd need to chunk and rate limit
  for (const subscriber of subscribers) {
    try {
      await sendBracketDropEmail(subscriber.email);
      results.sent++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${subscriber.email}: ${error}`);
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
