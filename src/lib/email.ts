import nodemailer from "nodemailer";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailSender {
  email: string;
  name?: string;
}

export interface SendEmailParams {
  /**
   * Recipient(s) of the email.
   * Can be a single email string, an array of email strings, or structured EmailRecipient objects.
   */
  to: string | string[] | EmailRecipient | EmailRecipient[];
  /**
   * Subject of the email.
   */
  subject: string;
  /**
   * HTML body of the email.
   */
  htmlContent: string;
  /**
   * Plain text alternative body.
   */
  textContent?: string;
  /**
   * Optional custom sender. Defaults to GMAIL_SENDER_EMAIL / GMAIL_SENDER_NAME from env.
   */
  sender?: EmailSender;
  /**
   * Optional reply-to address.
   */
  replyTo?: EmailRecipient;
}

export interface BrevoApiResponse {
  messageId: string;
}

/**
 * Sends a transactional email using Gmail SMTP via Nodemailer.
 * 
 * @param params Email parameters including to, subject, and HTML content.
 * @returns Object indicating success status, and message ID or error message.
 */
export async function sendTransactionalEmail(params: SendEmailParams): Promise<
  | { success: true; messageId: string }
  | { success: false; error: string }
> {
  const smtpUser = process.env.GMAIL_SMTP_USER;
  const smtpPass = process.env.GMAIL_SMTP_PASSWORD;
  const defaultSenderEmail = process.env.GMAIL_SENDER_EMAIL || smtpUser;
  const defaultSenderName = process.env.GMAIL_SENDER_NAME || "SortMySkills";

  if (!smtpUser || !smtpPass) {
    console.error("Gmail SMTP Error: GMAIL_SMTP_USER and GMAIL_SMTP_PASSWORD are not configured.");
    return { success: false, error: "SMTP credentials are missing from server environment." };
  }

  // 1. Normalize Sender
  const sender: EmailSender = {
    email: params.sender?.email || defaultSenderEmail || "",
    name: params.sender?.name || defaultSenderName,
  };

  // 2. Normalize Recipients
  let toArray: string[] = [];
  if (typeof params.to === "string") {
    toArray = [params.to];
  } else if (Array.isArray(params.to)) {
    toArray = params.to.map((item) =>
      typeof item === "string" ? item : item.email
    );
  } else {
    toArray = [params.to.email];
  }

  try {
    // Create Nodemailer Transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const formattedSender = sender.name ? `"${sender.name}" <${sender.email}>` : sender.email;

    const mailOptions = {
      from: formattedSender,
      to: toArray.join(", "),
      subject: params.subject,
      html: params.htmlContent,
      ...(params.textContent && { text: params.textContent }),
      ...(params.replyTo && { replyTo: params.replyTo.email }),
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId || "gmail-smtp-id" };
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "An unknown nodemailer error occurred";
    console.error("Error calling Gmail SMTP via Nodemailer:", err);
    return { success: false, error: err };
  }
}
