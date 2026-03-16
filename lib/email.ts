import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Bracket Blocker <notifications@bracketblocker.com>';

export async function sendWelcomeEmail(to: string) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "You're on the list for Selection Sunday",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF9500;">You're In!</h1>
        <p>We'll email you the moment the 2026 NCAA Tournament bracket drops on Selection Sunday (March 15 at 8 PM ET).</p>
        <p>When you get our email, head straight to <a href="https://bracketblocker.com/bracket" style="color: #FF9500;">bracketblocker.com/bracket</a> to block your calendar before anyone notices.</p>
        <p style="color: #666; font-size: 14px; margin-top: 32px;">
          Watch the games: <a href="https://tv.youtube.com/referral/r35xtqahc7tukn" style="color: #FF9500;">Get $15 off YouTube TV</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="color: #999; font-size: 12px;">
          Bracket Blocker - Fake meetings for real basketball.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendBracketLiveEmail(to: string) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "The Bracket is LIVE - Block Your Calendar NOW",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF9500;">THE BRACKET IS LIVE!</h1>
        <p style="font-size: 18px;">The 2026 NCAA Tournament bracket has been announced.</p>
        <p><strong>First games tip off Thursday.</strong> Block your calendar NOW before your boss schedules something.</p>
        <div style="margin: 32px 0;">
          <a href="https://bracketblocker.com/bracket" style="display: inline-block; background: #FF9500; color: black; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px;">
            BLOCK YOUR CALENDAR
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Watch the games: <a href="https://tv.youtube.com/referral/r35xtqahc7tukn" style="color: #FF9500;">Get $15 off YouTube TV</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="color: #999; font-size: 12px;">
          Bracket Blocker - Fake meetings for real basketball.<br />
          <a href="https://bracketblocker.com/unsubscribe?email=${encodeURIComponent(to)}" style="color: #999;">Unsubscribe</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send bracket live email:', error);
    throw error;
  }
}

export async function sendBulkBracketLiveEmails(emails: string[]) {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Send in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (email) => {
        try {
          await sendBracketLiveEmail(email);
          results.sent++;
        } catch (err) {
          results.failed++;
          results.errors.push(`${email}: ${err}`);
        }
      })
    );

    // Small delay between batches
    if (i + batchSize < emails.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
}
