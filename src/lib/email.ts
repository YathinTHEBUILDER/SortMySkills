/**
 * Brevo Transactional Email Utility
 * Powered by Brevo SMTP REST API v3
 * Zero-dependency, lightweight, type-safe
 */

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
   * Optional custom sender. Defaults to BREVO_SENDER_EMAIL / BREVO_SENDER_NAME from env.
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
 * Sends a transactional email using the Brevo REST API.
 * 
 * @param params Email parameters including to, subject, and HTML content.
 * @returns Object indicating success status, and message ID or error message.
 */
export async function sendTransactionalEmail(params: SendEmailParams): Promise<
  | { success: true; messageId: string }
  | { success: false; error: string }
> {
  const apiKey = process.env.BREVO_API_KEY;
  const defaultSenderEmail = process.env.BREVO_SENDER_EMAIL;
  const defaultSenderName = process.env.BREVO_SENDER_NAME || "SortMySkills";

  if (!apiKey) {
    console.error("Brevo Error: BREVO_API_KEY is not configured.");
    return { success: false, error: "Brevo API Key is missing from server environment." };
  }

  // 1. Normalize Sender
  const sender: EmailSender = {
    email: params.sender?.email || defaultSenderEmail || "",
    name: params.sender?.name || defaultSenderName,
  };

  if (!sender.email) {
    console.error("Brevo Error: Sender email is not defined (BREVO_SENDER_EMAIL not set).");
    return { success: false, error: "Sender email is missing from server environment." };
  }

  // 2. Normalize Recipients
  let toArray: EmailRecipient[] = [];
  if (typeof params.to === "string") {
    toArray = [{ email: params.to }];
  } else if (Array.isArray(params.to)) {
    toArray = params.to.map((item) =>
      typeof item === "string" ? { email: item } : item
    );
  } else {
    toArray = [params.to];
  }

  // 3. Build Payload
  const payload = {
    sender,
    to: toArray,
    subject: params.subject,
    htmlContent: params.htmlContent,
    ...(params.textContent && { textContent: params.textContent }),
    ...(params.replyTo && { replyTo: params.replyTo }),
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // Fallback to raw error text
        if (errorText) errorMessage = errorText;
      }
      console.error("Brevo API sending failed:", errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = (await response.json()) as BrevoApiResponse;
    return { success: true, messageId: data.messageId };
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "An unknown fetch error occurred";
    console.error("Error calling Brevo API:", err);
    return { success: false, error: err };
  }
}
