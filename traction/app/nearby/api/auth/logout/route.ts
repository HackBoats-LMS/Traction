import { clearSessionCookie } from '@/lib/nearby-auth';

export async function POST() {
  await clearSessionCookie();
  return Response.json({ success: true });
}
