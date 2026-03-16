import { NextRequest, NextResponse } from 'next/server';
import { removeSubscriber } from '@/lib/subscribers';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    await removeSubscriber(email);

    // Return a simple HTML page
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed - Bracket Blocker</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, sans-serif;
              background: #0a0a0c;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              text-align: center;
            }
            .container { max-width: 400px; padding: 20px; }
            h1 { color: #FF9500; }
            a { color: #FF9500; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unsubscribed</h1>
            <p>You've been removed from the Bracket Blocker email list.</p>
            <p><a href="https://bracketblocker.com">Back to Bracket Blocker</a></p>
          </div>
        </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
