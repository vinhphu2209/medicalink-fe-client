/**
 * Mask email address to hide sensitive information
 * Example: john.doe@example.com -> j***e@example.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;

  const [localPart, domain] = email.split('@');

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];

  return `${firstChar}***${lastChar}@${domain}`;
}

/**
 * Mask phone number to hide sensitive information
 * Example: +1234567890 -> +123***7890
 */
export function maskPhone(phone: string): string {
  if (!phone) return phone;

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length <= 4) {
    return phone;
  }

  const prefix = phone.substring(0, 4);
  const suffix = phone.substring(phone.length - 4);

  return `${prefix}***${suffix}`;
}

/**
 * Detect and mask sensitive information in text
 */
export function maskSensitiveInfo(text: string): string {
  if (!text) return text;

  // Mask email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  let maskedText = text.replace(emailRegex, (match) => maskEmail(match));

  // Mask phone numbers (various formats)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  maskedText = maskedText.replace(phoneRegex, (match) => maskPhone(match));

  return maskedText;
}
