/**
 * Formats Kenyan phone numbers to the standard format: 254791033018
 * Accepts multiple input formats:
 * - +254791033018 (international with +)
 * - 254791033018 (international without +)
 * - 0791033018 (local format with leading 0)
 * - 791033018 (local without leading 0)
 */
export function formatKenyanPhoneNumber(phoneNumber: string): string | null {
  if (!phoneNumber) return null;

  // Remove all whitespace and special characters except digits and +
  let cleaned = phoneNumber.replace(/[^\d+]/g, "").trim();

  // Remove leading +
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // If it starts with 254 (country code), use as is
  if (cleaned.startsWith("254")) {
    // Ensure it's exactly 12 digits (254 + 9 digit local number)
    if (cleaned.length === 12) {
      return cleaned;
    }
    // If too long, it might have extra 0 after country code
    if (cleaned.length === 13 && cleaned.startsWith("2540")) {
      return cleaned.substring(0, 3) + cleaned.substring(4);
    }
  }

  // If it starts with 0 (local format), convert to international
  if (cleaned.startsWith("0")) {
    // Remove leading 0 and add country code
    const withoutZero = cleaned.substring(1);
    if (withoutZero.length === 9) {
      return `254${withoutZero}`;
    }
  }

  // If it's 9 digits without leading 0 or country code
  if (cleaned.length === 9 && !cleaned.startsWith("0")) {
    return `254${cleaned}`;
  }

  // Invalid format
  return null;
}

/**
 * Validates if a phone number is in valid Kenyan format after formatting
 */
export function isValidKenyanPhoneNumber(phoneNumber: string): boolean {
  const formatted = formatKenyanPhoneNumber(phoneNumber);
  if (!formatted) return false;

  // Must be exactly 12 digits starting with 254
  // Valid Kenyan mobile prefixes: 7 (mobile), 1 (landlines)
  return formatted.length === 12 && /^254[17]\d{8}$/.test(formatted);
}

/**
 * Returns a user-friendly error message for invalid phone numbers
 */
export function getPhoneNumberErrorMessage(phoneNumber: string): string {
  if (!phoneNumber.trim()) {
    return "Phone number is required";
  }

  if (!isValidKenyanPhoneNumber(phoneNumber)) {
    return "Please enter a valid Kenyan phone number (e.g., 254791033018, 0791033018, or +254791033018)";
  }

  return "Invalid phone number format";
}
