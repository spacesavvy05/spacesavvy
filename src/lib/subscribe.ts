// Sends a newsletter signup to the SpaceSavvy Kit form (form ID 10072630).
// Kit then emails the subscriber a confirmation link (double opt-in).
export const KIT_FORM_ID = '10072630';

export async function subscribeEmail(email: string): Promise<boolean> {
  try {
    const body = new FormData();
    body.append('email_address', email.trim());
    const res = await fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return false;
    // Kit answers 200 even on errors, so read its JSON status.
    const data = await res.json().catch(() => null);
    return !(data && data.status === 'failed');
  } catch {
    return false;
  }
}
