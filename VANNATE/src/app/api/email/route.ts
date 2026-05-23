import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!resend) {
      console.log("\n=================================");
      console.log("Mock Email Sent (No Resend Key):");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content:\n${html}`);
      console.log("=================================\n");
      return NextResponse.json({ id: "mock-email-id-123", simulated: true });
    }

    const data = await resend.emails.send({
      from: 'Vannate <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
