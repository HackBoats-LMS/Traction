import { NextRequest } from 'next/server';
import { createToken, setSessionCookie } from '@/lib/atlas-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = await createToken('admin_user_id');
      await setSessionCookie(token);
      return Response.json({
        success: true,
        user: {
          id: 'admin_user_id',
          name: 'Administrator',
          email: 'admin@atlas.local',
          profession: 'Admin',
          company: 'Atlas',
          bio: 'System Administrator',
          avatar: '',
          city: '',
          latitude: null,
          longitude: null,
          address: '',
          category: '',
          phone: '',
          googleMapsLink: '',
          role: 'admin',
          isApproved: true
        },
      });
    }

    return Response.json({ error: 'Invalid admin credentials' }, { status: 401 });
  } catch (error) {
    console.error('Admin login error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
