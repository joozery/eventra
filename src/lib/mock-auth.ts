// Demo-only stand-in for a real "check if account exists" API call.
export const mockRegisteredEmails = [
  "demo@eventra.com",
  "organizer@eventra.com",
];

export function isEmailRegistered(email: string) {
  return mockRegisteredEmails.includes(email.trim().toLowerCase());
}
