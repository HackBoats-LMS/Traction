import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db-nearby';
import { getSession } from '@/lib/nearby-auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.userId === 'admin_user_id') {
      return Response.json({
        user: {
          id: 'admin_user_id',
          name: 'Administrator',
          email: 'admin@nearby.local',
          profession: 'Admin',
          company: 'Nearby',
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

    const users = await getUsersCollection();
    const user = await users.findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { password: 0 } }
    );

    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    return Response.json({
      user: {
        id: user._id.toString(), name: user.name || '', email: user.email || '',
        profession: user.profession || '', company: user.company || '', bio: user.bio || '',
        avatar: user.avatar || '', city: user.city || '',
        latitude: user.latitude != null ? Number(user.latitude) : null,
        longitude: user.longitude != null ? Number(user.longitude) : null,
        address: user.address || '',
        currentLatitude: user.currentLatitude != null ? Number(user.currentLatitude) : null,
        currentLongitude: user.currentLongitude != null ? Number(user.currentLongitude) : null,
        currentCity: user.currentCity || '',
        category: user.category || '',
        customCategory: user.customCategory || '',
        phone: user.phone || '',
        googleMapsLink: user.googleMapsLink || '',
        role: user.role || 'user',
        isApproved: user.isApproved || false,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
